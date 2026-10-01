import { useCallback, useEffect, useRef, useState, MutableRefObject } from "react";
import { toast } from "sonner";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Phase, QuestionItem } from "../types";
import { stopGlobalMediaStream } from "@/shared/components/provider/MediaStermProvider";

interface UseInterviewFlowProps {
  interviewId: string;
  liveConnected: boolean;
  emitEvent: (event: string, payload: any, callback?: any) => void;
  transition: (phase: Phase) => void;
  phaseRef: MutableRefObject<Phase>;
  isSubmittingRef: MutableRefObject<boolean>;
  currentQuestionRef: MutableRefObject<QuestionItem | null>;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<QuestionItem | null>>;
  setQuestionList: React.Dispatch<React.SetStateAction<QuestionItem[]>>;
  answerTextRef: MutableRefObject<string>;
  setAnswer: (text: string) => void;
  draftBaseRef: MutableRefObject<string>;
  setSubmissionError: React.Dispatch<React.SetStateAction<string | null>>;
  speakDoneRef: MutableRefObject<(() => void) | null>;
  startListening: () => void;
  stopSpeaking: () => void;
  speakQuestion: (
    text: string,
    audioUrl?: string | null,
    language?: string,
    questionToken?: number
  ) => void;
  forceStopRecognition: () => void;
  abortRecognition: () => void;
  makeAudioUrl: (b64: string, mime: string) => string | null;
  setQuestionLiveText: React.Dispatch<React.SetStateAction<string>>;
  setReportLiveText: React.Dispatch<React.SetStateAction<string>>;
  selectedVoice: string;
  languageRef: MutableRefObject<string>;
  router: AppRouterInstance;
  stopStream: () => void;
  currentQuestion: QuestionItem | null;
  flushViolations?: () => Promise<void> | void;
  setMicEnabled?: (enabled: boolean, caller?: string) => void;
  disconnectSocket?: () => void;
  isAISpeaking?: boolean;
}

export function useInterviewFlow({
  interviewId,
  liveConnected,
  emitEvent,
  transition,
  phaseRef,
  isSubmittingRef,
  currentQuestionRef,
  setCurrentQuestion,
  setQuestionList,
  answerTextRef,
  setAnswer,
  draftBaseRef,
  setSubmissionError,
  speakDoneRef,
  startListening,
  stopSpeaking,
  speakQuestion,
  forceStopRecognition,
  abortRecognition,
  makeAudioUrl,
  setQuestionLiveText,
  setReportLiveText,
  selectedVoice,
  languageRef,
  router,
  stopStream,
  currentQuestion,
  flushViolations,
  setMicEnabled,
  disconnectSocket,
  isAISpeaking,
}: UseInterviewFlowProps) {
  const [displayedQuestion, setDisplayedQuestion] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Monotonically increasing question token to invalidate stale TTS/listen callbacks
  const questionTokenRef = useRef<number>(0);
  const listenTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearListenTimer = useCallback(() => {
    if (listenTimerRef.current) {
      clearTimeout(listenTimerRef.current);
      listenTimerRef.current = null;
    }
  }, []);

  // Model a freshly generated question from the socket/HTTP payload
  const toQuestionItem = useCallback(
    (qd: any): QuestionItem => {
      const audio = qd.questionAudio
        ? makeAudioUrl(qd.questionAudio.audioBase64, qd.questionAudio.mimeType)
        : null;
      return {
        id: String(qd.questionId),
        question: qd.question,
        questionOrder: qd.questionOrder,
        keyTopics: qd.keyTopics || [],
        questionAudio: audio,
        isAnswered: false,
      };
    },
    [makeAudioUrl]
  );

  // Ask a question: speak it, then open the mic so the user can answer
  const onAskQuestion = useCallback(
    (q: QuestionItem, shouldSpeak: boolean, autoListen: boolean) => {
      clearListenTimer();
      // Ensure mic and STT are completely off before asking new question
      abortRecognition();
      setMicEnabled?.(false, "onAskQuestion");

      const currentToken = ++questionTokenRef.current;
      isSubmittingRef.current = false;
      currentQuestionRef.current = q;
      setCurrentQuestion(q);
      setQuestionList((prev) =>
        prev.some((x) => x.id === q.id) ? prev : [...prev, q]
      );

      let existingDraft = "";
      if (typeof window !== "undefined" && q?.id) {
        try {
          existingDraft = sessionStorage.getItem(`interview_draft_${q.id}`) || "";
        } catch {}
      }
      setAnswer(existingDraft);
      draftBaseRef.current = existingDraft;
      setSubmissionError(null);
      transition("speaking");

      const onTTSDone = () => {
        clearListenTimer();
        // Immediately ensure full text is displayed
        setDisplayedQuestion(q.question);
        setIsTyping(false);

        // Verify ALL required conditions before enabling microphone
        if (
          questionTokenRef.current !== currentToken ||
          phaseRef.current !== "speaking" ||
          isSubmittingRef.current ||
          currentQuestionRef.current?.id !== q.id ||
          currentQuestionRef.current?.isAnswered
        ) {
          console.debug(
            `[${phaseRef.current}][qToken:${currentToken}] speakDone ignored: phase=${phaseRef.current}, submitting=${isSubmittingRef.current}, qid=${currentQuestionRef.current?.id}`
          );
          return;
        }

        if (autoListen) {
          console.debug(`[${phaseRef.current}][qToken:${currentToken}] speakDone -> scheduling startListening`);
          // 300ms buffer prevents candidate mic from picking up residual room echo of AI voice
          listenTimerRef.current = setTimeout(() => {
            listenTimerRef.current = null;
            if (
              questionTokenRef.current === currentToken &&
              phaseRef.current === "speaking" &&
              !isSubmittingRef.current &&
              currentQuestionRef.current?.id === q.id &&
              !currentQuestionRef.current?.isAnswered
            ) {
              startListening();
            }
          }, 300);
        } else {
          console.debug(`[${phaseRef.current}][qToken:${currentToken}] speakDone -> transition to idle (autoListen=false)`);
          transition("idle");
        }
      };

      speakDoneRef.current = onTTSDone;
      const audio = shouldSpeak ? q.questionAudio || null : null;
      speakQuestion(q.question, audio, languageRef.current || "English", currentToken);
    },
    [
      abortRecognition,
      clearListenTimer,
      currentQuestionRef,
      draftBaseRef,
      languageRef,
      phaseRef,
      setCurrentQuestion,
      setQuestionList,
      setAnswer,
      setMicEnabled,
      setSubmissionError,
      speakDoneRef,
      speakQuestion,
      startListening,
      transition,
      isSubmittingRef,
    ]
  );

  const onAskQuestionRef = useRef(onAskQuestion);
  onAskQuestionRef.current = onAskQuestion;

  const requestNextQuestion = useCallback(() => {
    if (phaseRef.current === "generating" || phaseRef.current === "closing") return;
    clearListenTimer();
    abortRecognition();
    setMicEnabled?.(false, "requestNextQuestion");
    stopSpeaking();
    transition("generating");
    setQuestionLiveText("");

    const voiceToSend =
      (typeof window !== "undefined"
        ? sessionStorage.getItem("interview_ai_voice")
        : null) ||
      selectedVoice ||
      "Kore";

    console.log("[REQUEST-NEXT] path:", liveConnected ? "socket" : "http", "voice:", voiceToSend);
    if (liveConnected) {
      emitEvent("question:generate", { interviewId, speakQuestion: true, voice: voiceToSend });
      return;
    }

    AxiosAPI.post(`/api/interviews/${interviewId}/questions/generate`, {
      speakQuestion: true,
      voice: voiceToSend,
    })
      .then((res) => {
        onAskQuestionRef.current(toQuestionItem(res.data.data), true, true);
      })
      .catch((e: any) => {
        console.error("Generate question error:", e);
        transition("idle");
        toast.error(e?.response?.data?.message || "Failed to generate next question");
      });
  }, [
    abortRecognition,
    clearListenTimer,
    emitEvent,
    interviewId,
    liveConnected,
    phaseRef,
    selectedVoice,
    setMicEnabled,
    setQuestionLiveText,
    stopSpeaking,
    toQuestionItem,
    transition,
  ]);

  const requestNextQuestionRef = useRef(requestNextQuestion);
  requestNextQuestionRef.current = requestNextQuestion;

  const submitAnswerWithText = useCallback(
    (text: string) => {
      if (isSubmittingRef.current) return;
      const q = currentQuestionRef.current;
      if (!q || q.isAnswered) return;

      // Invariant: Stop STT & disable hardware mic BEFORE network call
      clearListenTimer();
      abortRecognition();
      setMicEnabled?.(false, "submitAnswerWithText");
      stopSpeaking();
      transition("processing");

      isSubmittingRef.current = true;

      const proceed = () => {
        isSubmittingRef.current = false;
        setSubmissionError(null);
        if (typeof window !== "undefined" && q?.id) {
          try {
            sessionStorage.removeItem(`interview_draft_${q.id}`);
          } catch {}
        }
        setAnswer("");
        setCurrentQuestion((prev) => (prev ? { ...prev, isAnswered: true } : null));
        requestNextQuestionRef.current();
      };

      const handleFailure = (errMsg: string) => {
        isSubmittingRef.current = false;
        // Invariant: On failure, restore answer text, transition to idle, mic stays OFF
        setAnswer(text);
        setMicEnabled?.(false, "submitAnswerWithText failure");
        transition("idle");
        setSubmissionError(errMsg);
        toast.error(errMsg);
      };

      const payload = { interviewId, questionId: q.id, answerText: text };
      console.log("[SUBMIT] path:", liveConnected ? "socket" : "http", "qid:", q.id, "textLen:", text.length);

      if (liveConnected) {
        emitEvent("answer:submit", payload, ({ ok, message }: any) => {
          if (!ok) {
            const errMsg = message || "تعذر إرسال الإجابة. إجابتك محفوظة.";
            handleFailure(errMsg);
            return;
          }
          proceed();
        });
        return;
      }

      AxiosAPI.post(`/api/interviews/${interviewId}/questions/${q.id}/answer`, {
        answerText: text,
      })
        .then(proceed)
        .catch((e: any) => {
          console.error("Save answer error:", e);
          const errMsg =
            e?.response?.data?.message ||
            "تعذر إرسال الإجابة بسبب مشكلة في الاتصال. إجابتك محفوظة ويمكنك إعادة المحاولة.";
          handleFailure(errMsg);
        });
    },
    [
      abortRecognition,
      clearListenTimer,
      currentQuestionRef,
      emitEvent,
      interviewId,
      isSubmittingRef,
      liveConnected,
      setAnswer,
      setCurrentQuestion,
      setMicEnabled,
      setSubmissionError,
      stopSpeaking,
      transition,
    ]
  );

  const replayQuestion = useCallback(() => {
    const q = currentQuestionRef.current;
    if (!q) return;

    clearListenTimer();
    abortRecognition();
    setMicEnabled?.(false, "replayQuestion");
    stopSpeaking();

    const currentToken = ++questionTokenRef.current;
    transition("speaking");

    const onTTSDone = () => {
      clearListenTimer();
      setDisplayedQuestion(q.question);
      setIsTyping(false);

      if (
        questionTokenRef.current !== currentToken ||
        phaseRef.current !== "speaking" ||
        isSubmittingRef.current ||
        currentQuestionRef.current?.id !== q.id
      ) {
        return;
      }

      if (!q.isAnswered) {
        listenTimerRef.current = setTimeout(() => {
          listenTimerRef.current = null;
          if (
            questionTokenRef.current === currentToken &&
            phaseRef.current === "speaking" &&
            !isSubmittingRef.current &&
            !currentQuestionRef.current?.isAnswered
          ) {
            startListening();
          }
        }, 300);
      } else {
        transition("idle");
      }
    };

    speakDoneRef.current = onTTSDone;
    speakQuestion(q.question, q.questionAudio, languageRef.current || "English", currentToken);
  }, [
    abortRecognition,
    clearListenTimer,
    currentQuestionRef,
    isSubmittingRef,
    languageRef,
    phaseRef,
    setMicEnabled,
    speakDoneRef,
    speakQuestion,
    startListening,
    stopSpeaking,
    transition,
  ]);

  const handleSubmitAnswer = useCallback(() => {
    const text = answerTextRef.current.trim();
    if (!text) {
      toast.error("Please provide or speak an answer before submitting.");
      return;
    }
    clearListenTimer();
    abortRecognition();
    setMicEnabled?.(false, "handleSubmitAnswer");
    stopSpeaking();
    setSubmissionError(null);
    submitAnswerWithText(text);
  }, [abortRecognition, answerTextRef, clearListenTimer, setMicEnabled, setSubmissionError, stopSpeaking, submitAnswerWithText]);

  const handleSkipQuestion = useCallback(() => {
    clearListenTimer();
    abortRecognition();
    setMicEnabled?.(false, "handleSkipQuestion");
    stopSpeaking();
    setSubmissionError(null);
    toast.info("Question skipped");
    const q = currentQuestionRef.current;
    if (q) {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem(`interview_draft_${q.id}`);
        } catch {}
      }
      AxiosAPI.post(`/api/interviews/${interviewId}/questions/${q.id}/skip`).catch((e) => {
        console.warn("Skip persistence failed:", e?.response?.data?.message || e?.message);
      });
    }
    requestNextQuestionRef.current();
  }, [abortRecognition, clearListenTimer, currentQuestionRef, interviewId, setMicEnabled, setSubmissionError, stopSpeaking]);

  const handleFinishInterview = useCallback(async () => {
    if (phaseRef.current === "closing") return;

    const confirmed = typeof window !== "undefined"
      ? window.confirm("Are you sure you want to end the interview now?")
      : true;
    if (!confirmed) return;

    clearListenTimer();
    transition("closing");
    stopSpeaking();
    abortRecognition();
    setMicEnabled?.(false, "handleFinishInterview");
    stopStream();
    stopGlobalMediaStream();

    // Flush any pending violations before concluding
    if (flushViolations) {
      await flushViolations();
    }

    toast.loading("Generating your comprehensive AI interview report...");

    const navigateToReport = () => {
      stopGlobalMediaStream();
      toast.dismiss();
      toast.success("Interview completed! Loading your evaluation report...");
      router.replace(`/dashboard/interviewDetails?id=${interviewId}`);
    };

    if (liveConnected) {
      setReportLiveText("");
      emitEvent("interview:finish", { interviewId });
      return;
    }

    AxiosAPI.post(`/api/interviews/${interviewId}/summary`)
      .then(() => navigateToReport())
      .catch(async (e: any) => {
        stopGlobalMediaStream();
        console.warn("Finish interview summary error, executing direct completion fallback:", e);
        try {
          await AxiosAPI.patch(`/api/interviews/${interviewId}/complete`);
        } catch (completeErr) {
          console.error("Direct completion error:", completeErr);
        }
        navigateToReport();
      });
  }, [
    abortRecognition,
    clearListenTimer,
    emitEvent,
    flushViolations,
    interviewId,
    liveConnected,
    phaseRef,
    router,
    setMicEnabled,
    setReportLiveText,
    stopSpeaking,
    stopStream,
    transition,
  ]);

  // Typewriter effect for displaying the generated question smoothly
  useEffect(() => {
    if (!currentQuestion?.question) {
      setDisplayedQuestion("");
      setIsTyping(false);
      return;
    }
    setDisplayedQuestion("");
    setIsTyping(true);
    let i = 0;
    const text = currentQuestion.question;
    const speed = 40;

    const interval = setInterval(() => {
      setDisplayedQuestion(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        // If AI is not actively speaking sound and speechDone is still pending, trigger it
        if (!isAISpeaking && phaseRef.current === "speaking" && speakDoneRef.current) {
          const cb = speakDoneRef.current;
          speakDoneRef.current = null;
          cb();
        }
      }
    }, speed);
    return () => clearInterval(interval);
  }, [currentQuestion?.question]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearListenTimer();
    };
  }, [clearListenTimer]);

  return {
    displayedQuestion,
    isTyping,
    onAskQuestion: useCallback(
      (q: QuestionItem, shouldSpeak: boolean, autoListen: boolean) =>
        onAskQuestionRef.current(q, shouldSpeak, autoListen),
      []
    ),
    requestNextQuestion: useCallback(() => requestNextQuestionRef.current(), []),
    submitAnswerWithText,
    replayQuestion,
    handleSubmitAnswer,
    handleSkipQuestion,
    handleFinishInterview,
    toQuestionItem,
  };
}
