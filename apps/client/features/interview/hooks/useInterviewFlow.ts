import { useCallback, useEffect, useRef, useState, MutableRefObject } from "react";
import { toast } from "sonner";
import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { QuestionItem } from "../types";
import { useInterviewStore } from "../store/useInterviewStore";
import { formatToQuestionItem } from "../utils/questionMapper";
import { stopGlobalMediaStream } from "@/shared/components/provider/MediaStermProvider";
import {
  detectInterviewMode,
  getInterviewRedirectUrl,
  clearTaskDefenseSession,
} from "../utils/interviewRouting";
import { useTypewriter } from "./useTypewriter";

interface UseInterviewFlowProps {
  interviewId: string;
  liveConnected: boolean;
  emitEvent: (event: string, payload: any, callback?: any) => void;
  draftBaseRef: MutableRefObject<string>;
  speakDoneRef: MutableRefObject<(() => void) | null>;
  startListening: () => void;
  stopSpeaking: () => void;
  speakQuestion: (
    text: string,
    audioUrl?: string | null,
    language?: string,
    questionToken?: number
  ) => void;
  abortRecognition: () => void;
  selectedVoice: string;
  languageRef: MutableRefObject<string>;
  router: AppRouterInstance;
  stopStream: () => void;
  setMicEnabled?: (enabled: boolean, caller?: string) => void;
  pullPendingViolations?: () => any[];
  flushViolations?: () => Promise<void> | void;
  isCareerDiscovery?: boolean;
}

export function useInterviewFlow({
  interviewId,
  liveConnected,
  emitEvent,
  draftBaseRef,
  speakDoneRef,
  startListening,
  stopSpeaking,
  speakQuestion,
  abortRecognition,
  selectedVoice,
  languageRef,
  router,
  stopStream,
  setMicEnabled,
  pullPendingViolations,
  flushViolations,
  isCareerDiscovery = false,
}: UseInterviewFlowProps) {
  // Read generation lagging status directly from Zustand store
  const isGenerationLagging = useInterviewStore((s) => s.isGenerationLagging);
  const generationWatchdogRef = useRef<NodeJS.Timeout | null>(null);

  // Watchdog timer: If generation takes longer than 20 seconds, flag as lagging in Zustand store
  useEffect(() => {
    const unsubscribe = useInterviewStore.subscribe((state) => {
      if (state.phase === "generating") {
        if (!generationWatchdogRef.current) {
          generationWatchdogRef.current = setTimeout(() => {
            useInterviewStore.getState().setIsGenerationLagging(true);
          }, 20000);
        }
      } else {
        if (generationWatchdogRef.current) {
          clearTimeout(generationWatchdogRef.current);
          generationWatchdogRef.current = null;
        }
      }
    });

    return () => {
      unsubscribe();
      if (generationWatchdogRef.current) {
        clearTimeout(generationWatchdogRef.current);
      }
    };
  }, []);

  // Monotonically increasing question token to invalidate stale TTS/listen callbacks
  const questionTokenRef = useRef<number>(0);
  const listenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleFinishInterviewRef = useRef<() => void>(() => {});
  const isCareerDiscoveryRef = useRef<boolean>(isCareerDiscovery);

  useEffect(() => {
    isCareerDiscoveryRef.current = isCareerDiscovery;
  }, [isCareerDiscovery]);

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
      // Deduplication guard: If this exact question is already current and actively speaking, do not restart
      const currentState = useInterviewStore.getState();
      if (
        currentState.currentQuestion?.id === q.id &&
        currentState.phase === "speaking"
      ) {
        console.debug(
          `[onAskQuestion] Deduplication: Question ${q.id} is already actively speaking. Skipping duplicate ask.`
        );
        return;
      }

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
      useInterviewStore.getState().setSubmissionError(null);
      useInterviewStore.getState().setPhase("speaking");

      const onTTSDone = () => {
        clearListenTimer();

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
      speakDoneRef,
      speakQuestion,
      startListening,
    ]
  );

  const onAskQuestionRef = useRef(onAskQuestion);
  onAskQuestionRef.current = onAskQuestion;

  const requestNextQuestion = useCallback((options?: { forceGenerate?: boolean }) => {
    const state = useInterviewStore.getState();
    const currentPhase = state.phase;

    console.log(
      "%c🔍 [REQUEST NEXT] Checking next question availability in buffer:",
      "background: #6366f1; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      {
        currentQuestionId: state.currentQuestion?.id,
        currentPhase,
        forceGenerate: options?.forceGenerate,
        bufferedNextQuestion: state.nextQuestion
          ? { id: state.nextQuestion.id, order: state.nextQuestion.questionOrder }
          : null,
        questionListLength: state.questionList.length,
        unansweredInList: state.questionList
          .filter((x) => !x.isAnswered)
          .map((x) => ({ id: x.id, order: x.questionOrder })),
      }
    );

    if (currentPhase === "closing") {
      console.log(`[REQUEST NEXT] Aborting because phase is 'closing'`);
      return;
    }

    if (currentPhase === "generating" && !options?.forceGenerate) {
      console.log(`[REQUEST NEXT] Aborting because phase is already 'generating'`);
      return;
    }

    // 1. Check if there is an upcoming question ready (Prefetch hit!)
    // Prioritize nextQuestion, then fallback to any unanswered question in questionList
    // Clean Code Invariant: Question progression MUST be strictly forward ((order > currentOrder))
    const currentQId = state.currentQuestion?.id;
    const currentOrder = state.currentQuestion?.questionOrder || 0;

    const validNextBuffered =
      state.nextQuestion &&
      (state.nextQuestion.questionOrder || 0) > currentOrder &&
      !state.nextQuestion.isAnswered
        ? state.nextQuestion
        : null;

    const fallbackNext = state.questionList.find(
      (q) =>
        !q.isAnswered &&
        q.id !== currentQId &&
        (q.questionOrder || 0) > currentOrder
    );

    const targetNext = validNextBuffered || fallbackNext;

    if (targetNext) {
      // PREFETCH HIT: Ask immediately, zero latency!
      console.log(
        "%c🎉 [PREFETCH HIT] Found target question ready! Moving to currentQuestion with ZERO wait:",
        "background: #059669; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
        {
          targetQuestionId: targetNext.id,
          order: targetNext.questionOrder,
          source:
            state.nextQuestion?.id === targetNext.id
              ? "nextQuestion buffer"
              : "questionList fallback",
        }
      );
      useInterviewStore.getState().setNextQuestion(null);
      onAskQuestionRef.current(targetNext, true, true);
    } else {
      // If the backend previously notified us that the interview is completed (no more questions)
      if (state.isPendingCompletion) {
        console.log(
          "%c🏁 [INTERVIEW FINISHED] No further questions remaining and completion is pending. Finishing interview...",
          "background: #10b981; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;"
        );
        handleFinishInterviewRef.current();
        return;
      }

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

    // Clear live question stream text in store
    useInterviewStore.getState().clearQuestionLiveText();

    // In Career Discovery, stop prefetching once all 5 questions have been generated or are being presented
    const isDiscovery = Boolean(isCareerDiscovery || isCareerDiscoveryRef.current);
    const nextOrder = targetNext?.questionOrder || 0;
    if (isDiscovery && (state.questionList.length >= 5 || currentOrder >= 5 || nextOrder >= 5)) {
      console.log(
        "%c🛑 [CAREER DISCOVERY PREFETCH HALT] Reached 5 questions limit. Not generating additional questions.",
        "background: #0284c7; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;"
      );
      return;
    }

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
    stopSpeaking,
    toQuestionItem,
    isCareerDiscovery,
  ]);

  const requestNextQuestionRef = useRef(requestNextQuestion);
  requestNextQuestionRef.current = requestNextQuestion;

  const submitAnswer = useCallback(
    async (text?: string, audioBlob?: Blob | null) => {
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

      const finalText = (text ?? state.answerText ?? "").trim();
      const hasAudio = Boolean(audioBlob && audioBlob.size > 0);

      if (!finalText && !hasAudio) {
        const errorMsg =
          languageRef.current === "Arabic"
            ? "لم يتم التقاط أي صوت أو إجابة. يرجى التحدث بالميكروفون بوضوح ثم المحاولة مجدداً."
            : "No audio or text response detected. Please speak into your microphone clearly and try again.";
        console.warn("[SUBMIT BLOCKED] Neither answer text nor audio provided.");
        useInterviewStore.getState().setSubmissionError(errorMsg);
        return;
      }

      console.log(
        "%c🚀 [submitAnswer] Submitting Answer:",
        "background: #f59e0b; color: black; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
        {
          questionId: q.id,
          questionOrder: q.questionOrder,
          hasAudio,
          audioBytes: audioBlob?.size,
          answerLength: finalText.length,
          transport: hasAudio ? "HTTP (FormData)" : liveConnected ? "SOCKET" : "HTTP",
        }
      );

      // Invariant: Stop STT & stop speaking, keep hardware mic ready
      clearListenTimer();
      abortRecognition();
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
        useInterviewStore.getState().setSubmissionError(null);
        if (typeof window !== "undefined" && q?.id) {
          try {
            sessionStorage.removeItem(`interview_draft_${q.id}`);
          } catch {}
        }
        useInterviewStore.getState().setAnswerText("");
        useInterviewStore.getState().markQuestionAnswered(q.id);

        const isDiscovery = Boolean(isCareerDiscovery || isCareerDiscoveryRef.current);
        // If Career Discovery and this was question 5 (or last), conclude the interview immediately!
        if (isDiscovery && q.questionOrder >= 5) {
          console.log(
            "%c🎯 [CAREER DISCOVERY COMPLETED] Reached 5 questions. Ending interview session...",
            "background: #10b981; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;"
          );
          handleFinishInterviewRef.current();
          return;
        }

        console.log(
          "%c⏩ [STEP 4: proceed() -> requestNextQuestion] Calling requestNextQuestion()...",
          "background: #8b5cf6; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;"
        );
        requestNextQuestionRef.current();
      };

      const handleFailure = (errMsg: string) => {
        console.error("❌ [SUBMIT FAILURE]:", errMsg);
        if (finalText) {
          useInterviewStore.getState().setAnswerText(finalText);
        }
        useInterviewStore.getState().setPhase("idle");
        useInterviewStore.getState().setSubmissionError(errMsg);
        toast.error(errMsg);
      };

      const violations = pullPendingViolations ? pullPendingViolations() : [];

      // 1. If audio is provided -> Send multipart/form-data via HTTP to trigger AssemblyAI on backend
      if (hasAudio && audioBlob) {
        proceed();

        const formData = new FormData();
        const ext = audioBlob.type.includes("mp4") ? "mp4" : "webm";
        formData.append("audio", audioBlob, `answer_${q.id}.${ext}`);
        if (finalText) {
          formData.append("answerText", finalText);
        }
        if (violations.length > 0) {
          formData.append("violations", JSON.stringify(violations));
        }

        AxiosAPI.post(`/api/interviews/${interviewId}/questions/${q.id}/answer`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }).catch((e: any) => {
          console.error("Save audio answer error:", e);
          const errMsg =
            e?.response?.data?.message ||
            "تعذر إرسال الإجابة الصوتية بسبب مشكلة في الاتصال. إجابتك محفوظة ويمكنك إعادة المحاولة.";
          handleFailure(errMsg);
        });
        return;
      }

      // 2. Text-only submission with active Socket connection
      if (liveConnected) {
        proceed();
        const payload: any = { interviewId, questionId: q.id, answerText: finalText };
        if (violations.length > 0) {
          payload.violations = violations;
        }

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

      // 3. Text-only HTTP fallback
      proceed();
      AxiosAPI.post(`/api/interviews/${interviewId}/questions/${q.id}/answer`, {
        answerText: finalText,
      }).catch((e: any) => {
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
      pullPendingViolations,
      stopSpeaking,
      isCareerDiscovery,
    ]
  );

  const submitAnswerWithText = useCallback(
    (text: string) => submitAnswer(text, null),
    [submitAnswer]
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

  const handleSubmitAnswer = useCallback(
    (audioBlob?: Blob | null) => {
      const text = useInterviewStore.getState().answerText.trim();
      const hasAudio = Boolean(audioBlob && audioBlob.size > 0);
      if (!text && !hasAudio) {
        const errorMsg =
          languageRef.current === "Arabic"
            ? "لم يتم التقاط أي صوت أو إجابة. يرجى التحدث بالميكروفون بوضوح ثم المحاولة مجدداً."
            : "No audio or text response detected. Please speak into your microphone clearly and try again.";
        console.warn("[SUBMIT BLOCKED] Neither answer text nor audio provided.");
        useInterviewStore.getState().setSubmissionError(errorMsg);
        return;
      }
      clearListenTimer();
      abortRecognition();
      stopSpeaking();
      useInterviewStore.getState().setSubmissionError(null);
      submitAnswer(text, audioBlob);
    },
    [abortRecognition, clearListenTimer, languageRef, stopSpeaking, submitAnswer]
  );

  const handleSkipQuestion = useCallback(() => {
    const state = useInterviewStore.getState();
    const q = state.currentQuestion;

    if (!q) {
      console.warn("[SKIP BLOCKED] No active current question to skip.");
      return;
    }

    if (state.phase === "generating" || state.isGeneratingQuestion) {
      console.warn("[SKIP BLOCKED] Already generating next question.");
      return;
    }

    clearListenTimer();
    abortRecognition();
    setMicEnabled?.(false, "handleSkipQuestion");
    stopSpeaking();
    state.setSubmissionError(null);
    state.setAnswerText("");
    toast.info(languageRef.current === "Arabic" ? "تم تخطي السؤال" : "Question skipped");

    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(`interview_draft_${q.id}`);
      } catch {}
    }
    AxiosAPI.post(`/api/interviews/${interviewId}/questions/${q.id}/skip`).catch((e) => {
      console.warn("Skip persistence failed:", e?.response?.data?.message || e?.message);
    });

    const isDiscovery = Boolean(isCareerDiscovery || isCareerDiscoveryRef.current);
    if (isDiscovery && q.questionOrder >= 5) {
      handleFinishInterviewRef.current();
      return;
    }

    // Mark current question as answered/skipped in local store
    state.markQuestionAnswered(q.id);
    const updatedList = useInterviewStore.getState().questionList;

    // Check if nextQuestion is ready in buffer (strictly forward)
    const currentOrder = q.questionOrder || 0;
    const validNext =
      state.nextQuestion &&
      (state.nextQuestion.questionOrder || 0) > currentOrder &&
      !state.nextQuestion.isAnswered
        ? state.nextQuestion
        : null;

    const targetNext =
      validNext ||
      updatedList.find(
        (item) =>
          !item.isAnswered &&
          item.id !== q.id &&
          (item.questionOrder || 0) > currentOrder
      );

    if (targetNext) {
      // PREFETCH HIT: Next question already available! Present immediately
      console.log(
        "%c⏩ [SKIP PREFETCH HIT] Next question ready in buffer. Transitioning immediately:",
        "background: #059669; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
        targetNext.id
      );
      state.setNextQuestion(null);
      onAskQuestionRef.current(targetNext, true, true);

      // Keep pipeline filled in background
      requestNextQuestionRef.current();
    } else {
      // PREFETCH MISS: Next question not in buffer yet!
      // Enter 'generating' (Sara is thinking) state and clear old question
      console.log(
        "%c⏳ [SKIP PREFETCH MISS] Next question not ready in buffer. Setting phase to 'generating' (سارة تفكر في السؤال القادم...)",
        "background: #d97706; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;"
      );
      state.setCurrentQuestion(null);
      state.clearQuestionLiveText();
      state.setPhase("generating");

      // Force generation request to backend
      requestNextQuestionRef.current({ forceGenerate: true });
    }
  }, [
    abortRecognition,
    clearListenTimer,
    interviewId,
    isCareerDiscovery,
    languageRef,
    setMicEnabled,
    stopSpeaking,
  ]);

  const handleFinishInterview = useCallback(async () => {
    if (useInterviewStore.getState().phase === "closing") return;

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

    // Check if nextQuestion exists and was not presented to the user
    const state = useInterviewStore.getState();
    const bufferedNextQuestion = state.nextQuestion;
    const currentQ = state.currentQuestion;

    const unviewedQuestionIds: string[] = [];
    if (bufferedNextQuestion?.id) {
      unviewedQuestionIds.push(String(bufferedNextQuestion.id));
      console.log(
        "%c🛑 [FINISH INTERVIEW] Detected unviewed buffered nextQuestion. Cancelling it and notifying backend:",
        "background: #dc2626; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
        bufferedNextQuestion
      );
    }

    // Also check questionList for any trailing prefetched question generated after currentQuestion
    if (currentQ?.questionOrder) {
      state.questionList.forEach((q) => {
        if (!q.isAnswered && q.questionOrder > currentQ.questionOrder && q.id !== currentQ.id) {
          if (!unviewedQuestionIds.includes(String(q.id))) {
            unviewedQuestionIds.push(String(q.id));
          }
        }
      });
    }

    // Discard unviewed questions from frontend store immediately so they are never displayed
    useInterviewStore.getState().setNextQuestion(null);
    if (unviewedQuestionIds.length > 0) {
      useInterviewStore.getState().setQuestionList(
        state.questionList.filter((q) => !unviewedQuestionIds.includes(String(q.id)))
      );
    }

    const finishPayload = {
      unviewedQuestionIds,
      unviewedQuestionId: bufferedNextQuestion?.id ? String(bufferedNextQuestion.id) : undefined,
      lastDisplayedQuestionOrder: currentQ?.questionOrder,
    };

    toast.loading("Ending interview...");

    const modeInfo = detectInterviewMode();
    const { isTaskDefense, isCareerDiscovery: isDiscovery, defenseTaskId } = modeInfo;

    const navigateToReport = (defenseResult?: any) => {
      stopGlobalMediaStream();
      toast.dismiss();

      const candidateTok =
        typeof window !== "undefined"
          ? sessionStorage.getItem("candidate_access_token")
          : null;

      if (candidateTok) {
        toast.success("Interview completed successfully! Thank you.");
        window.location.reload();
        return;
      }

      if (isTaskDefense) {
        clearTaskDefenseSession();
        const passed = defenseResult?.passed ?? true;
        const score = defenseResult?.score ?? "";
        toast.success(
          passed
            ? "مبروك! تم اجتياز مناقشة المهمة بنجاح 🚀"
            : "تم الانتهاء من المناقشة، يرجى مراجعة التقييم."
        );
        router.replace(
          getInterviewRedirectUrl(modeInfo, interviewId, {
            defenseCompleted: true,
            passed,
            score,
          })
        );
        return;
      }

      if (isDiscovery) {
        toast.success("Interview completed! Redirecting to your learning tasks...");
        router.replace(getInterviewRedirectUrl(modeInfo, interviewId));
        return;
      }

      toast.success("Interview completed! Redirecting to report...");
      router.replace(getInterviewRedirectUrl(modeInfo, interviewId));
    };

    try {
      // 1. Mark interview as completed immediately with unviewed question metadata
      await AxiosAPI.patch(`/api/interviews/${interviewId}/complete`, finishPayload).catch((e) => {
        console.warn("Complete interview patch warning:", e?.response?.data?.message || e?.message);
      });

      // 2. If Task Defense: call defense evaluation endpoint
      let defenseEvalResult = null;
      if (isTaskDefense) {
        const evalEndpoint = defenseTaskId
          ? `/api/agent/tasks/${defenseTaskId}/evaluate-defense`
          : `/api/agent/interviews/${interviewId}/evaluate-defense`;

        const evalRes = await AxiosAPI.post(evalEndpoint, finishPayload).catch((err) => {
          console.error("Task defense evaluation error:", err);
          return null;
        });
        defenseEvalResult = evalRes?.data?.data || null;
      } else if (!isDiscovery) {
        // Trigger report generation only if NOT Career Discovery
        await AxiosAPI.post(`/api/interviews/${interviewId}/summary`, finishPayload).catch((err) => {
          console.error("Background summary generation error:", err);
        });
      }

      // 3. Navigate immediately
      navigateToReport(defenseEvalResult);
    } catch (error) {
      console.error("Error ending interview:", error);
      // Navigate anyway to avoid being stuck if there's an error
      navigateToReport();
    }
  }, [
    clearListenTimer,
    flushViolations,
    interviewId,
    router,
    setMicEnabled,
    stopSpeaking,
    stopStream,
    abortRecognition,
  ]);

  handleFinishInterviewRef.current = handleFinishInterview;

  // Typewriter effect synchronized with AI speech
  const currentQuestion = useInterviewStore((s) => s.currentQuestion);
  const currentQuestionText = currentQuestion?.question;
  const isAISpeaking = useInterviewStore((s) => s.isAISpeaking);
  const [canStartTyping, setCanStartTyping] = useState<boolean>(false);

  useEffect(() => {
    if (!currentQuestion?.id) {
      setCanStartTyping(false);
      return;
    }

    if (isAISpeaking) {
      setCanStartTyping(true);
      return;
    }

    // Safety timeout: If audio does not start within 1200ms (e.g. muted audio or fallback), begin typing anyway
    const timer = setTimeout(() => {
      setCanStartTyping(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentQuestion?.id, isAISpeaking]);

  const { displayedText: displayedQuestion, isTyping } = useTypewriter({
    text: currentQuestionText,
    speed: 40,
    enabled: canStartTyping,
    onComplete: () => {
      // If AI is not actively speaking sound and speechDone is still pending, trigger it
      const state = useInterviewStore.getState();
      if (!state.isAISpeaking && state.phase === "speaking" && speakDoneRef.current) {
        const cb = speakDoneRef.current;
        speakDoneRef.current = null;
        cb();
      }
    },
  });

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearListenTimer();
    };
  }, [clearListenTimer]);

  return {
    displayedQuestion,
    isTyping,
    isGenerationLagging,
    onAskQuestion: useCallback(
      (q: QuestionItem, shouldSpeak: boolean, autoListen: boolean) =>
        onAskQuestionRef.current(q, shouldSpeak, autoListen),
      []
    ),
    requestNextQuestion: useCallback(
      (options?: { forceGenerate?: boolean }) =>
        requestNextQuestionRef.current(options),
      []
    ),
    submitAnswer,
    submitAnswerWithText,
    replayQuestion,
    handleSubmitAnswer,
    handleSkipQuestion,
    handleFinishInterview,
    toQuestionItem,
  };
}
