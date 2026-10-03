import { useCallback, useEffect, useRef, useState, MutableRefObject } from "react";
import { toast } from "sonner";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Phase, QuestionItem } from "../types";
import { useInterviewStore } from "../store/useInterviewStore";
import { formatToQuestionItem } from "../utils/questionMapper";
import { stopGlobalMediaStream } from "@/shared/components/provider/MediaStermProvider";

interface UseInterviewFlowProps {
  interviewId: string;
  liveConnected: boolean;
  emitEvent: (event: string, payload: any, callback?: any) => void;
  draftBaseRef: MutableRefObject<string>;
  setSubmissionError: (err: string | null) => void;
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
  disconnectSocket?: () => void;
  setMicEnabled?: (enabled: boolean, caller?: string) => void;
  pullPendingViolations?: () => any[];
  flushViolations?: () => Promise<void> | void;
}

export function useInterviewFlow({
  interviewId,
  liveConnected,
  emitEvent,
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
  setMicEnabled,
  disconnectSocket,
  pullPendingViolations,
  flushViolations,
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

  // Model a freshly generated question from any payload uniformly
  const toQuestionItem = useCallback(
    (qd: any): QuestionItem => {
      return formatToQuestionItem(qd) as QuestionItem;
    },
    []
  );

  // Ask a question: speak it, then open the mic so the user can answer
  const onAskQuestion = useCallback(
    (q: QuestionItem, shouldSpeak: boolean, autoListen: boolean) => {
      clearListenTimer();
      // Ensure mic and STT are completely off before asking new question
      abortRecognition();
      setMicEnabled?.(false, "onAskQuestion");

      const currentToken = ++questionTokenRef.current;
      useInterviewStore.getState().setCurrentQuestion(q);
      useInterviewStore.getState().addQuestion(q);

      console.log(
        "%c🗣️ [STEP 1: onAskQuestion] Displaying question as currentQuestion:",
        "background: #2563eb; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
        {
          id: q.id,
          order: q.questionOrder,
          question: q.question,
          hasAudio: !!q.questionAudio,
          shouldSpeak,
          autoListen,
        }
      );

      let existingDraft = "";
      if (typeof window !== "undefined" && q?.id) {
        try {
          existingDraft = sessionStorage.getItem(`interview_draft_${q.id}`) || "";
        } catch {}
      }
      useInterviewStore.getState().setAnswerText(existingDraft);
      draftBaseRef.current = existingDraft;
      setSubmissionError(null);
      useInterviewStore.getState().setPhase("speaking");

      const onTTSDone = () => {
        clearListenTimer();
        // Immediately ensure full text is displayed
        setDisplayedQuestion(q.question);
        setIsTyping(false);

        console.log(
          "%c🔊 [TTS DONE] AI voice finished speaking. Preparing microphone...",
          "background: #10b981; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
          { questionId: q.id, autoListen }
        );

        // Verify ALL required conditions before enabling microphone
        const state = useInterviewStore.getState();
        if (
          questionTokenRef.current !== currentToken ||
          state.phase !== "speaking" ||
          state.isSubmittingAnswer ||
          state.currentQuestion?.id !== q.id ||
          state.currentQuestion?.isAnswered
        ) {
          console.debug(
            `[${state.phase}][qToken:${currentToken}] speakDone ignored: phase=${state.phase}, submitting=${state.isSubmittingAnswer}, qid=${state.currentQuestion?.id}`
          );
          return;
        }

        if (autoListen) {
          console.debug(`[${state.phase}][qToken:${currentToken}] speakDone -> scheduling startListening`);
          // 300ms buffer prevents candidate mic from picking up residual room echo of AI voice
          listenTimerRef.current = setTimeout(() => {
            listenTimerRef.current = null;
            const currentState = useInterviewStore.getState();
            if (
              questionTokenRef.current === currentToken &&
              currentState.phase === "speaking" &&
              !currentState.isSubmittingAnswer &&
              currentState.currentQuestion?.id === q.id &&
              !currentState.currentQuestion?.isAnswered
            ) {
              startListening();
            }
          }, 300);
        } else {
          console.debug(`[${state.phase}][qToken:${currentToken}] speakDone -> transition to idle (autoListen=false)`);
          useInterviewStore.getState().setPhase("idle");
        }
      };

      speakDoneRef.current = onTTSDone;
      const audio = shouldSpeak ? q.questionAudio || null : null;
      speakQuestion(q.question, audio, languageRef.current || "English", currentToken);
    },
    [
      abortRecognition,
      clearListenTimer,
      draftBaseRef,
      languageRef,
      setMicEnabled,
      setSubmissionError,
      speakDoneRef,
      speakQuestion,
      startListening,
    ]
  );

  const onAskQuestionRef = useRef(onAskQuestion);
  onAskQuestionRef.current = onAskQuestion;

  const requestNextQuestion = useCallback(() => {
    const state = useInterviewStore.getState();
    const currentPhase = state.phase;

    console.log(
      "%c🔍 [REQUEST NEXT] Checking next question availability in buffer:",
      "background: #6366f1; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      {
        currentQuestionId: state.currentQuestion?.id,
        currentPhase,
        bufferedNextQuestion: state.nextQuestion
          ? { id: state.nextQuestion.id, order: state.nextQuestion.questionOrder }
          : null,
        questionListLength: state.questionList.length,
        unansweredInList: state.questionList
          .filter((x) => !x.isAnswered)
          .map((x) => ({ id: x.id, order: x.questionOrder })),
      }
    );

    if (currentPhase === "generating" || currentPhase === "closing") {
      console.log(`[REQUEST NEXT] Aborting because phase is already '${currentPhase}'`);
      return;
    }

    // 1. Check if there is an upcoming question ready (Prefetch hit!)
    // Prioritize nextQuestion, then fallback to any unanswered question in questionList
    const currentQId = state.currentQuestion?.id;
    const targetNext =
      state.nextQuestion ||
      state.questionList.find((q) => !q.isAnswered && q.id !== currentQId);

    if (targetNext) {
      // PREFETCH HIT: Ask immediately, zero latency!
      console.log(
        "%c🎉 [PREFETCH HIT] Found target question ready! Moving to currentQuestion with ZERO wait:",
        "background: #059669; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
        {
          targetQuestionId: targetNext.id,
          order: targetNext.questionOrder,
          source: state.nextQuestion?.id === targetNext.id ? "nextQuestion buffer" : "questionList fallback",
        }
      );
      useInterviewStore.getState().setNextQuestion(null);
      onAskQuestionRef.current(targetNext, true, true);
    } else {
      // PREFETCH MISS: (e.g. initial load without buffer, or backend is slow)
      console.log(
        "%c⏳ [PREFETCH MISS] No target question found in buffer! Setting phase to 'generating'...",
        "background: #d97706; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;"
      );
      clearListenTimer();
      abortRecognition();
      setMicEnabled?.(false, "requestNextQuestion");
      stopSpeaking();
      useInterviewStore.getState().setPhase("generating");
    }

    setQuestionLiveText("");

    // 2. ALWAYS request the backend to generate the NEXT question (to keep the buffer full)
    const voiceToSend =
      (typeof window !== "undefined"
        ? sessionStorage.getItem("interview_ai_voice")
        : null) ||
      selectedVoice ||
      "Kore";

    console.log(
      "%c📡 [PREFETCH BUFFERING] Requesting backend to generate upcoming question:",
      "background: #0284c7; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      { voiceToSend, path: liveConnected ? "SOCKET" : "HTTP" }
    );

    if (liveConnected) {
      emitEvent("question:generate", { interviewId, speakQuestion: true, voice: voiceToSend });
      return;
    }

    AxiosAPI.post(`/api/interviews/${interviewId}/questions/generate`, {
      speakQuestion: true,
      voice: voiceToSend,
    })
      .then((res) => {
        const newQ = toQuestionItem(res.data.data);
        console.log("📥 [HTTP GENERATE RESPONSE] Received generated question:", newQ?.id);
        useInterviewStore.getState().addQuestion(newQ);
        // If we were starving, ask it immediately!
        if (useInterviewStore.getState().phase === "generating") {
          onAskQuestionRef.current(newQ, true, true);
        }
      })
      .catch((e: any) => {
        console.error("Generate question error:", e);
        useInterviewStore.getState().setPhase("idle");
        toast.error(e?.response?.data?.message || "Failed to generate next question");
      });
  }, [
    abortRecognition,
    clearListenTimer,
    emitEvent,
    interviewId,
    liveConnected,
    selectedVoice,
    setMicEnabled,
    setQuestionLiveText,
    stopSpeaking,
    toQuestionItem,
  ]);

  const requestNextQuestionRef = useRef(requestNextQuestion);
  requestNextQuestionRef.current = requestNextQuestion;

  const submitAnswerWithText = useCallback(
    (text: string) => {
      const state = useInterviewStore.getState();
      if (state.isSubmittingAnswer) {
        console.warn("[SUBMIT BLOCKED] Already submitting answer.");
        return;
      }
      const q = state.currentQuestion;
      if (!q || q.isAnswered) {
        console.warn("[SUBMIT BLOCKED] No active question or already answered:", q?.id);
        return;
      }

      console.log(
        "%c🚀 [STEP 2: submitAnswerWithText] Submitting Answer:",
        "background: #f59e0b; color: black; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
        {
          questionId: q.id,
          questionOrder: q.questionOrder,
          answerLength: text.length,
          answerPreview: text.length > 60 ? text.substring(0, 60) + "..." : text,
          transport: liveConnected ? "SOCKET" : "HTTP",
        }
      );

      // Invariant: Stop STT & disable hardware mic BEFORE network call
      clearListenTimer();
      abortRecognition();
      setMicEnabled?.(false, "submitAnswerWithText");
      stopSpeaking();
      useInterviewStore.getState().setPhase("processing");

      const proceed = () => {
        console.log(
          "%c⚡ [STEP 3: proceed()] Optimistic local update -> marking question as answered:",
          "background: #8b5cf6; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
          {
            answeredQuestionId: q.id,
          }
        );
        setSubmissionError(null);
        if (typeof window !== "undefined" && q?.id) {
          try {
            sessionStorage.removeItem(`interview_draft_${q.id}`);
          } catch {}
        }
        useInterviewStore.getState().setAnswerText("");
        useInterviewStore.getState().setCurrentQuestion({ ...q, isAnswered: true });

        console.log(
          "%c⏩ [STEP 4: proceed() -> requestNextQuestion] Calling requestNextQuestion()...",
          "background: #8b5cf6; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;"
        );
        requestNextQuestionRef.current();
      };

      const handleFailure = (errMsg: string) => {
        // Invariant: On failure, restore answer text, transition to idle, mic stays OFF
        console.error("❌ [SUBMIT FAILURE]:", errMsg);
        useInterviewStore.getState().setAnswerText(text);
        setMicEnabled?.(false, "submitAnswerWithText failure");
        useInterviewStore.getState().setPhase("idle");
        setSubmissionError(errMsg);
        toast.error(errMsg);
      };

      const payload: any = { interviewId, questionId: q.id, answerText: text };
      if (pullPendingViolations) {
        payload.violations = pullPendingViolations();
      }

      if (liveConnected) {
        // Proceed instantly without waiting for the backend (Zero Latency Submission)
        proceed();

        console.log(
          "%c📡 [STEP 5: BACKGROUND SOCKET] Emitting 'answer:submit' event in background...",
          "background: #0284c7; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
          payload
        );
        
        emitEvent("answer:submit", payload, ({ ok, message, data }: any) => {
          console.log(
            "%c📥 [STEP 6: SOCKET ACK] Backend answer:submit acknowledgment received:",
            ok
              ? "background: #10b981; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;"
              : "background: #ef4444; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
            { ok, message, data }
          );
          if (!ok) {
            const errMsg = message || "تعذر إرسال الإجابة. إجابتك محفوظة.";
            console.error(errMsg);
          }
        });
        return;
      }

      // Same for HTTP
      proceed();
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
      emitEvent,
      interviewId,
      liveConnected,
      setMicEnabled,
      setSubmissionError,
      stopSpeaking,
    ]
  );

  const replayQuestion = useCallback(() => {
    const state = useInterviewStore.getState();
    const q = state.currentQuestion;
    if (!q) return;

    clearListenTimer();
    abortRecognition();
    setMicEnabled?.(false, "replayQuestion");
    stopSpeaking();

    const currentToken = ++questionTokenRef.current;
    useInterviewStore.getState().setPhase("speaking");

    const onTTSDone = () => {
      clearListenTimer();
      setDisplayedQuestion(q.question);
      setIsTyping(false);
      
      const currentState = useInterviewStore.getState();
      if (
        questionTokenRef.current !== currentToken ||
        currentState.phase !== "speaking" ||
        currentState.isSubmittingAnswer ||
        currentState.currentQuestion?.id !== q.id
      ) {
        return;
      }

      if (!q.isAnswered) {
        listenTimerRef.current = setTimeout(() => {
          listenTimerRef.current = null;
          const freshState = useInterviewStore.getState();
          if (
            questionTokenRef.current === currentToken &&
            freshState.phase === "speaking" &&
            !freshState.isSubmittingAnswer &&
            !freshState.currentQuestion?.isAnswered
          ) {
            startListening();
          }
        }, 300);
      } else {
        useInterviewStore.getState().setPhase("idle");
      }
    };

    speakDoneRef.current = onTTSDone;
    speakQuestion(q.question, q.questionAudio, languageRef.current || "English", currentToken);
  }, [
    abortRecognition,
    clearListenTimer,
    languageRef,
    setMicEnabled,
    speakDoneRef,
    speakQuestion,
    startListening,
    stopSpeaking,
  ]);

  const handleSubmitAnswer = useCallback(() => {
    const text = useInterviewStore.getState().answerText.trim();
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
  }, [abortRecognition, clearListenTimer, setMicEnabled, setSubmissionError, stopSpeaking, submitAnswerWithText]);

  const handleSkipQuestion = useCallback(() => {
    clearListenTimer();
    abortRecognition();
    setMicEnabled?.(false, "handleSkipQuestion");
    stopSpeaking();
    setSubmissionError(null);
    toast.info("Question skipped");
    const q = useInterviewStore.getState().currentQuestion;
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
  }, [abortRecognition, clearListenTimer, interviewId, setMicEnabled, setSubmissionError, stopSpeaking]);

  const handleFinishInterview = useCallback(async () => {
    if (useInterviewStore.getState().phase === "closing") return;

    const confirmed = typeof window !== "undefined"
      ? window.confirm("Are you sure you want to end the interview now?")
      : true;
    if (!confirmed) return;

    clearListenTimer();
    useInterviewStore.getState().setPhase("closing");
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
    router,
    setMicEnabled,
    setReportLiveText,
    stopSpeaking,
    stopStream,
  ]);

  // Typewriter effect for displaying the generated question smoothly
  useEffect(() => {
    const currentQuestion = useInterviewStore.getState().currentQuestion;
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
        const state = useInterviewStore.getState();
        if (!state.isAISpeaking && state.phase === "speaking" && speakDoneRef.current) {
          const cb = speakDoneRef.current;
          speakDoneRef.current = null;
          cb();
        }
      }
    }, speed);
    return () => clearInterval(interval);
  }, [useInterviewStore().currentQuestion?.question, speakDoneRef]);

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
