import { useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Phase } from "../types";

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
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startedRef = useRef<boolean>(false);
  const fatalErrorRef = useRef<boolean>(false);
  const hasShownFatalToastRef = useRef<boolean>(false);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      clearInterval(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    useInterviewStore.getState().setAutoSubmitCountdown(null);
  }, []);

  const startListening = useCallback(() => {
    const state = useInterviewStore.getState();
    const currentPhase = state.phase;
    const isSubmitting = state.isSubmittingAnswer;
    const isAISpeaking = state.isAISpeaking;

    // Strict phase & submission guards: block only if generating, processing, closing, submitting, or AI actively speaking
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

    if (fatalErrorRef.current) {
      console.debug(`[${currentPhase}][startListening] blocked: fatal error active`);
      return;
    }

    if (!recognitionRef.current) {
      toast.info(
        "Microphone transcription is not supported in this browser. You can type your answer directly."
      );
      return;
    }

    console.debug(`[${currentPhase}][startListening] allowed`);

    // Invariant: Hardware mic ON, UI listening TRUE, phase -> "listening"
    setMicEnabled?.(true, "startListening");
    useInterviewStore.getState().setPhase("listening");

    if (!startedRef.current) {
      try {
        recognitionRef.current.start();
        startedRef.current = true;
      } catch (err: any) {
        console.warn("SpeechRecognition.start() error:", err);
      }
    }
  }, [setMicEnabled]);

  // Fired by the speech recognition engine when utterance/stream ends
  const handleRecognitionEnd = useCallback(
    (instance: any) => {
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
        } catch (err) {
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

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const instance = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    const isArabic =
      interviewLanguage?.toLowerCase().includes("arabic") ||
      interviewLanguage?.includes("عربي");
    recognition.lang = isArabic ? "ar-SA" : "en-US";

    recognition.onresult = (event: any) => {
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
      silenceTimerRef.current = setTimeout(() => {
        if (recognitionRef.current !== instance || useInterviewStore.getState().phase !== "listening") return;
        
        let countdown = 5;
        useInterviewStore.getState().setAutoSubmitCountdown(countdown);
        
        silenceTimerRef.current = setInterval(() => {
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

    recognition.onerror = (err: any) => {
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
