import { useCallback, useEffect, useRef, useState, MutableRefObject } from "react";
import { toast } from "sonner";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Phase, QuestionItem } from "../types";
import { stopGlobalMediaStream } from "@/shared/components/provider/MediaStermProvider";

interface UseInterviewFlowProps {
  interviewId: string;
  liveConnected: boolean;
  emitEvent: (event: string, payload?: any, callback?: Function) => void;
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
  speakQuestion: (text: string, audioUrl?: string | null, language?: string) => void;
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
  disconnectSocket: () => void;
  setMicEnabled: (enabled: boolean) => void;
  flushViolations?: () => Promise<void>;
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
  disconnectSocket,
  setMicEnabled,
  flushViolations,
}: UseInterviewFlowProps) {
  const [displayedQuestion, setDisplayedQuestion] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const questionTokenRef = useRef(0);
  const listenTimerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupMicTimers = useCallback(() => {
    if (listenTimerRef.current) clearTimeout(listenTimerRef.current);
    setMicEnabled(true);
  }, [setMicEnabled]);

  const stopSpeakingWrapped = useCallback(() => {
    cleanupMicTimers();
    stopSpeaking();
  }, [cleanupMicTimers, stopSpeaking]);

  useEffect(() => {
    return () => cleanupMicTimers();
  }, [cleanupMicTimers]);

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

  const onAskQuestion = useCallback(
    (q: QuestionItem, shouldSpeak: boolean, autoListen: boolean) => {
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
        } catch { }
      }
      setAnswer(existingDraft);
      draftBaseRef.current = existingDraft;
      setSubmissionError(null);
      transition("speaking");

      abortRecognition(); // AGGRESSIVELY DESTROY STT BEFORE AI SPEAKS

      questionTokenRef.current += 1;
      const myToken = questionTokenRef.current;
      cleanupMicTimers();

      if (shouldSpeak) {
        setMicEnabled(false); // Hardware mute!
        const audio = q.questionAudio || null;

        speakDoneRef.current = () => {
          if (questionTokenRef.current !== myToken) {
            console.debug(`[speakDone] block token: ${myToken} != ${questionTokenRef.current}`);
            return;
          }
          if (phaseRef.current !== "speaking") {
            console.debug(`[speakDone] block phase: ${phaseRef.current}`);
            cleanupMicTimers();
            return;
          }
          if (isSubmittingRef.current) {
            console.debug(`[speakDone] block submitting`);
            cleanupMicTimers();
            return;
          }
          if (currentQuestionRef.current?.id !== q.id) {
            console.debug(`[speakDone] block diff question`);
            cleanupMicTimers();
            return;
          }
          if (currentQuestionRef.current?.isAnswered) {
            console.debug(`[speakDone] block answered`);
            cleanupMicTimers();
            return;
          }

          setMicEnabled(true);
          if (autoListen) {
            listenTimerRef.current = setTimeout(() => {
              startListening();
            }, 800);
          } else {
            transition("idle");
          }
        };
        speakQuestion(q.question, audio, languageRef.current || "English");
      } else {
        setMicEnabled(true);
        if (autoListen) {
          listenTimerRef.current = setTimeout(startListening, 800);
        } else {
          speakDoneRef.current = () => {
            transition("idle");
          };
        }
        speakQuestion(q.question, null, languageRef.current || "English");
      }
    },
    [
      isSubmittingRef,
      currentQuestionRef,
      setCurrentQuestion,
      setQuestionList,
      setAnswer,
      draftBaseRef,
      setSubmissionError,
      transition,
      abortRecognition,
      cleanupMicTimers,
      setMicEnabled,
      speakDoneRef,
      startListening,
      speakQuestion,
      languageRef,
      phaseRef,
    ]
  );

  const onAskQuestionRef = useRef(onAskQuestion);
  onAskQuestionRef.current = onAskQuestion;

  const requestNextQuestion = useCallback(() => {
    if (phaseRef.current === "generating" || phaseRef.current === "closing") return;
    cleanupMicTimers();
    transition("generating");
    stopSpeakingWrapped();
    abortRecognition();
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
    phaseRef,
    cleanupMicTimers,
    transition,
    stopSpeakingWrapped,
    abortRecognition,
    setQuestionLiveText,
    selectedVoice,
    liveConnected,
    emitEvent,
    interviewId,
    toQuestionItem,
  ]);

  const requestNextQuestionRef = useRef(requestNextQuestion);
  requestNextQuestionRef.current = requestNextQuestion;

  const submitAnswerWithText = useCallback(
    (text: string) => {
      cleanupMicTimers();
      if (isSubmittingRef.current) return;
      const q = currentQuestionRef.current;
      if (!q || q.isAnswered) return;

      isSubmittingRef.current = true;

      setAnswer("");
      abortRecognition();

      const proceed = () => {
        isSubmittingRef.current = false;
        setSubmissionError(null);
        if (typeof window !== "undefined" && q?.id) {
          try {
            sessionStorage.removeItem(`interview_draft_${q.id}`);
          } catch { }
        }
        setCurrentQuestion((prev) => (prev ? { ...prev, isAnswered: true } : null));
        requestNextQuestionRef.current();
      };

      const payload = { interviewId, questionId: q.id, answerText: text };
      console.log("[SUBMIT] path:", liveConnected ? "socket" : "http", "qid:", q.id, "textLen:", text.length);

      if (liveConnected) {
        emitEvent("answer:submit", payload, ({ ok, message }: any) => {
          if (!ok) {
            isSubmittingRef.current = false;
            setAnswer(text);
            transition("idle");
            const errMsg = message || "تعذر إرسال الإجابة. إجابتك محفوظة.";
            setSubmissionError(errMsg);
            toast.error(errMsg);
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
          isSubmittingRef.current = false;
          setAnswer(text);
          console.error("Save answer error:", e);
          transition("idle");
          const errMsg =
            e?.response?.data?.message ||
            "تعذر إرسال الإجابة بسبب مشكلة في الاتصال. إجابتك محفوظة ويمكنك إعادة المحاولة.";
          setSubmissionError(errMsg);
          toast.error(errMsg);
        });
    },
    [
      cleanupMicTimers,
      isSubmittingRef,
      currentQuestionRef,
      setSubmissionError,
      setAnswer,
      setCurrentQuestion,
      interviewId,
      liveConnected,
      emitEvent,
      transition,
      abortRecognition,
    ]
  );

  const replayQuestion = useCallback(() => {
    const q = currentQuestionRef.current;
    if (!q) return;

    questionTokenRef.current += 1;
    const myToken = questionTokenRef.current;
    cleanupMicTimers();

    setMicEnabled(false);

    speakDoneRef.current = () => {
      if (questionTokenRef.current !== myToken) return;
      if (phaseRef.current !== "speaking") { cleanupMicTimers(); return; }
      if (isSubmittingRef.current) { cleanupMicTimers(); return; }
      if (currentQuestionRef.current?.id !== q.id) { cleanupMicTimers(); return; }

      setMicEnabled(true);
      if (!q.isAnswered) {
        listenTimerRef.current = setTimeout(startListening, 800);
      } else {
        transition("idle");
      }
    };

    transition("speaking");
    speakQuestion(q.question, q.questionAudio, languageRef.current || "English");
  }, [currentQuestionRef, cleanupMicTimers, setMicEnabled, speakDoneRef, phaseRef, isSubmittingRef, startListening, transition, speakQuestion, languageRef]);

  const handleSubmitAnswer = useCallback(() => {
    cleanupMicTimers();
    const text = answerTextRef.current.trim();
    if (!text) {
      toast.error("Please provide or speak an answer before submitting.");
      return;
    }
    setSubmissionError(null);
    forceStopRecognition();
    stopSpeakingWrapped();
    transition("processing");
    submitAnswerWithText(text);
  }, [cleanupMicTimers, answerTextRef, setSubmissionError, forceStopRecognition, stopSpeakingWrapped, transition, submitAnswerWithText]);

  const handleSkipQuestion = useCallback(() => {
    cleanupMicTimers();
    setSubmissionError(null);
    forceStopRecognition();
    stopSpeakingWrapped();
    toast.info("Question skipped");
    const q = currentQuestionRef.current;
    if (q) {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem(`interview_draft_${q.id}`);
        } catch { }
      }
      AxiosAPI.post(`/api/interviews/${interviewId}/questions/${q.id}/skip`).catch((e) => {
        console.warn("Skip persistence failed:", e?.response?.data?.message || e?.message);
      });
    }
    requestNextQuestionRef.current();
  }, [cleanupMicTimers, setSubmissionError, forceStopRecognition, stopSpeakingWrapped, currentQuestionRef, interviewId]);

  const handleFinishInterview = useCallback(async () => {
    cleanupMicTimers();
    if (phaseRef.current === "closing") return;

    const confirmed = typeof window !== "undefined"
      ? window.confirm("Are you sure you want to end the interview now?")
      : true;
    if (!confirmed) return;

    transition("closing");
    stopSpeakingWrapped();
    abortRecognition();
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
    cleanupMicTimers,
    phaseRef,
    transition,
    stopSpeakingWrapped,
    abortRecognition,
    stopStream,
    liveConnected,
    setReportLiveText,
    emitEvent,
    interviewId,
    router,
    flushViolations,
  ]);

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
      }
    }, speed);
    return () => clearInterval(interval);
  }, [currentQuestion?.question]);

  return {
    displayedQuestion,
    isTyping,
    onAskQuestion: useCallback((q: QuestionItem, shouldSpeak: boolean, autoListen: boolean) => onAskQuestionRef.current(q, shouldSpeak, autoListen), []),
    requestNextQuestion: useCallback(() => requestNextQuestionRef.current(), []),
    submitAnswerWithText,
    replayQuestion,
    handleSubmitAnswer,
    handleSkipQuestion,
    handleFinishInterview,
    toQuestionItem,
    stopSpeakingWrapped,
  };
}
