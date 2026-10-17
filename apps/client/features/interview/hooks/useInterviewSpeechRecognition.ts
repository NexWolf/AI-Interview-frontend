import { useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Phase,
  ISpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from "../types";

import { useInterviewStore } from "../store/useInterviewStore";

interface UseInterviewSpeechRecognitionProps {
  stopSpeaking: () => void;
  submitAnswerRef: React.MutableRefObject<(text: string) => void>;
  draftBaseRef: React.MutableRefObject<string>;
  interviewLanguage?: string;
  setMicEnabled?: (enabled: boolean, caller?: string) => void;
}

export function useInterviewSpeechRecognition({
  stopSpeaking,
  submitAnswerRef,
  draftBaseRef,
  interviewLanguage,
  setMicEnabled,
}: UseInterviewSpeechRecognitionProps) {
  /* Refs: Internal engine and hardware references (100% Type-Safe) */
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startedRef = useRef<boolean>(false);
  const fatalErrorRef = useRef<boolean>(false);
  const hasShownFatalToastRef = useRef<boolean>(false);

  /* Silence clear function: safely clears both the debounce timeout and countdown interval */
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    useInterviewStore.getState().setAutoSubmitCountdown(null);
  }, []);

  /* Start listening: Gate ordering + Safe Rollback */
  const startListening = useCallback(() => {
    // 1. First gate: verify browser SpeechRecognition support and instance availability
    if (!recognitionRef.current) {
      toast.info(
        "Microphone transcription is not supported in this browser. You can type your answer directly."
      );
      return;
    }

    // 2. Second gate: prevent starting if permissions were permanently denied or fatal capture error occurred
    if (fatalErrorRef.current) {
      console.debug("[startListening] blocked: fatal error active");
      return;
    }

    // 3. Third gate: strict concurrency and state guard (generating, processing, closing, submitting, or AI speaking)
    const state = useInterviewStore.getState();
    const currentPhase = state.phase;
    const isSubmitting = state.isSubmittingAnswer;
    const isAISpeaking = state.isAISpeaking;

    if (
      currentPhase === "generating" ||
      currentPhase === "processing" ||
      currentPhase === "closing" ||
      isSubmitting ||
      isAISpeaking
    ) {
      console.debug(
        `[${currentPhase}][startListening] blocked: phase=${currentPhase}, isAISpeaking=${isAISpeaking}, isSubmitting=${isSubmitting}`
      );
      return;
    }

    console.debug(`[${currentPhase}][startListening] allowed`);

    // 4. Start hardware recognition with safe rollback on error
    if (!startedRef.current) {
      try {
        recognitionRef.current.start();
        startedRef.current = true;

        // Invariant: Hardware mic ON and phase -> "listening" only upon successful start
        setMicEnabled?.(true, "startListening");
        useInterviewStore.getState().setPhase("listening");
      } catch (err: unknown) {
        console.warn("SpeechRecognition.start() error:", err);
        startedRef.current = false;
        setMicEnabled?.(false, "startListening error");
        useInterviewStore.getState().setPhase("idle");
      }
    }
  }, [setMicEnabled]);

  // Fired by the speech recognition engine when utterance/stream ends
  const handleRecognitionEnd = useCallback(
    (instance: ISpeechRecognition) => {
      clearSilenceTimer();
      startedRef.current = false;

      // Stale instance check
      const state = useInterviewStore.getState();
      const currentPhase = state.phase;

      if (recognitionRef.current !== instance) {
        console.debug(`[${currentPhase}][recognition onend] ignored (stale instance)`);
        return;
      }

      // If a fatal permission/capture error occurred, leave mic off
      if (fatalErrorRef.current) {
        console.debug(`[${currentPhase}][recognition onend] ignored (fatal error)`);
        setMicEnabled?.(false, "recognition onend fatal error");
        useInterviewStore.getState().setIsListening(false);
        return;
      }

      if (
        currentPhase === "closing" ||
        currentPhase !== "listening" ||
        state.isSubmittingAnswer
      ) {
        console.debug(
          `[${currentPhase}][recognition onend] ignored (phase=${currentPhase}, submitting=${state.isSubmittingAnswer})`
        );
        setMicEnabled?.(false, "recognition onend not listening");
        useInterviewStore.getState().setIsListening(false);
        return;
      }

      const text = state.answerText.trim();
      if (text) {
        console.debug(`[${currentPhase}][recognition onend] submit (answer length: ${text.length})`);
        setMicEnabled?.(false, "recognition onend submit");
        useInterviewStore.getState().setIsListening(false);
        stopSpeaking();
        submitAnswerRef.current(text);
      } else {
        // No speech detected yet - restart only when phase === "listening", not submitting, and no fatal error
        console.debug(`[${currentPhase}][recognition onend] restart (waiting for candidate speech)`);
        try {
          instance.start();
          startedRef.current = true;
          useInterviewStore.getState().setIsListening(true);
          setMicEnabled?.(true, "recognition onend restart");
        } catch (err: unknown) {
          console.warn("SpeechRecognition restart error:", err);
          startedRef.current = false;
          setMicEnabled?.(false, "recognition restart error");
          useInterviewStore.getState().setIsListening(false);
        }
      }
    },
    [
      clearSilenceTimer,
      setMicEnabled,
      stopSpeaking,
      submitAnswerRef,
    ]
  );

  const handleRecognitionEndRef = useRef(handleRecognitionEnd);
  handleRecognitionEndRef.current = handleRecognitionEnd;

  // Set up the SpeechRecognition engine once per language change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
    if (!supported) return;

    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) return;

    const recognition: ISpeechRecognition = new SpeechRecognitionConstructor();
    const instance = recognition;

    /* sound and language settings */
    recognition.continuous = true;
    recognition.interimResults = true;
    const isArabic =
      interviewLanguage?.toLowerCase().includes("arabic") ||
      interviewLanguage?.includes("عربي");
    recognition.lang = isArabic ? "ar-SA" : "en-US";

    /* speech to text */
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (recognitionRef.current !== instance) return;
      clearSilenceTimer();

      // Rebuild transcript from event.results
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      const base = draftBaseRef.current.trim();
      useInterviewStore.getState().setAnswerText(base ? `${base} ${fullTranscript}`.trim() : fullTranscript.trim());

      // Start countdown logic after 2 seconds of silence
      silenceTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current !== instance || useInterviewStore.getState().phase !== "listening") return;

        let countdown = 5;
        useInterviewStore.getState().setAutoSubmitCountdown(countdown);

        countdownIntervalRef.current = setInterval(() => {
          countdown -= 1;
          if (countdown <= 0) {
            clearSilenceTimer();
            if (recognitionRef.current === instance && useInterviewStore.getState().phase === "listening") {
              console.log("[SILENCE DETECTED] Countdown finished. Auto-submitting...");
              try {
                instance.stop();
                startedRef.current = false;
              } catch {}
            }
          } else {
            useInterviewStore.getState().setAutoSubmitCountdown(countdown);
          }
        }, 1000);
      }, 2000);
    };

    recognition.onerror = (err: SpeechRecognitionErrorEvent) => {
      if (recognitionRef.current !== instance) return;
      const errorType = err.error || err;

      if (errorType === "no-speech") {
        // Browser timed out waiting for speech. 'onend' will decide whether to restart.
        return;
      }

      if (
        errorType === "not-allowed" ||
        errorType === "audio-capture" ||
        errorType === "service-not-allowed"
      ) {
        fatalErrorRef.current = true;
        startedRef.current = false;
        setMicEnabled?.(false, `recognition fatal error: ${errorType}`);
        useInterviewStore.getState().setIsListening(false);
        if (!hasShownFatalToastRef.current) {
          hasShownFatalToastRef.current = true;
          toast.error(
            "Microphone permission denied or audio capture unavailable. Please check your browser settings or type your answer."
          );
        }
        console.warn(`[${useInterviewStore.getState().phase}][recognition onerror] Fatal error: ${errorType}`);
        return;
      }

      console.warn(`[${useInterviewStore.getState().phase}][recognition onerror] Non-fatal error:`, errorType);
    };

    recognition.onend = () => {
      handleRecognitionEndRef.current(instance);
    };

    recognitionRef.current = recognition;

    return () => {
      clearSilenceTimer();
      startedRef.current = false;
      try {
        recognition.onend = null;
        recognition.onerror = null;
        recognition.onresult = null;
        recognition.onstart = null;
        recognition.abort();
      } catch {}
      if (recognitionRef.current === instance) {
        recognitionRef.current = null;
      }
      setMicEnabled?.(false, "recognition unmount");
      useInterviewStore.getState().setIsListening(false);
    };
  }, [clearSilenceTimer, draftBaseRef, interviewLanguage, setMicEnabled]);

  // Manual mic toggle (also used to stop & submit a voice answer)
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.info(
        "Microphone transcription is not supported in this browser. You can type your answer directly."
      );
      return;
    }

    const state = useInterviewStore.getState();
    const currentPhase = state.phase;

    // If AI is speaking, user interrupting AI stops speech and begins candidate answer
    if (currentPhase === "speaking" || state.isAISpeaking) {
      stopSpeaking();
      startListening();
      return;
    }

    if (currentPhase === "listening") {
      stopSpeaking();
      clearSilenceTimer();
      startedRef.current = false;
      try {
        recognitionRef.current.stop(); // "onend" will auto-submit answer
      } catch {}
      return;
    }

    stopSpeaking();
    startListening();
  }, [clearSilenceTimer, startListening, stopSpeaking]);

  // A helper to forcefully stop the recognition (e.g. when skip, manual submit, or finish)
  // CRITICAL: Do NOT call transition() inside forceStopRecognition
  const forceStopRecognition = useCallback(() => {
    clearSilenceTimer();
    startedRef.current = false;
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch {}
    setMicEnabled?.(false, "forceStopRecognition");
    useInterviewStore.getState().setIsListening(false);
  }, [clearSilenceTimer, setMicEnabled]);

  // A helper to completely abort the instance
  // CRITICAL: Do NOT call transition() inside abortRecognition
  const abortRecognition = useCallback(() => {
    clearSilenceTimer();
    startedRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    setMicEnabled?.(false, "abortRecognition");
    useInterviewStore.getState().setIsListening(false);
  }, [clearSilenceTimer, setMicEnabled]);

  return {
    startListening,
    toggleListening,
    forceStopRecognition,
    abortRecognition,
  };
}
