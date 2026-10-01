import { useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Phase } from "../types";

interface UseInterviewSpeechRecognitionProps {
  transition: (phase: Phase) => void;
  phaseRef: React.MutableRefObject<Phase>;
  isSubmittingRef: React.MutableRefObject<boolean>;
  setIsListening: (isListening: boolean) => void;
  answerTextRef: React.MutableRefObject<string>;
  stopSpeaking: () => void;
  submitAnswerRef: React.MutableRefObject<(text: string) => void>;
  setAnswer: (text: string) => void;
  draftBaseRef: React.MutableRefObject<string>;
  interviewLanguage?: string;
  setMicEnabled?: (enabled: boolean, caller?: string) => void;
  isAISpeaking?: boolean;
}

export function useInterviewSpeechRecognition({
  transition,
  phaseRef,
  isSubmittingRef,
  setIsListening,
  answerTextRef,
  stopSpeaking,
  submitAnswerRef,
  setAnswer,
  draftBaseRef,
  interviewLanguage,
  setMicEnabled,
  isAISpeaking,
}: UseInterviewSpeechRecognitionProps) {
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startedRef = useRef<boolean>(false);
  const fatalErrorRef = useRef<boolean>(false);
  const hasShownFatalToastRef = useRef<boolean>(false);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    const currentPhase = phaseRef.current;

    // Strict phase & submission guards: block only if generating, processing, closing, submitting, or AI actively speaking
    if (
      currentPhase === "generating" ||
      currentPhase === "processing" ||
      currentPhase === "closing" ||
      isSubmittingRef.current ||
      isAISpeaking
    ) {
      console.debug(
        `[${currentPhase}][startListening] blocked: phase=${currentPhase}, isAISpeaking=${isAISpeaking}, isSubmitting=${isSubmittingRef.current}`
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
    transition("listening");

    if (!startedRef.current) {
      try {
        recognitionRef.current.start();
        startedRef.current = true;
      } catch (err: any) {
        console.warn("SpeechRecognition.start() error:", err);
      }
    }
  }, [phaseRef, isSubmittingRef, setMicEnabled, transition]);

  // Fired by the speech recognition engine when utterance/stream ends
  const handleRecognitionEnd = useCallback(
    (instance: any) => {
      clearSilenceTimer();
      startedRef.current = false;

      // Stale instance check
      if (recognitionRef.current !== instance) {
        console.debug(`[${phaseRef.current}][recognition onend] ignored (stale instance)`);
        return;
      }

      // If a fatal permission/capture error occurred, leave mic off
      if (fatalErrorRef.current) {
        console.debug(`[${phaseRef.current}][recognition onend] ignored (fatal error)`);
        setMicEnabled?.(false, "recognition onend fatal error");
        setIsListening(false);
        return;
      }

      if (
        phaseRef.current === "closing" ||
        phaseRef.current !== "listening" ||
        isSubmittingRef.current
      ) {
        console.debug(
          `[${phaseRef.current}][recognition onend] ignored (phase=${phaseRef.current}, submitting=${isSubmittingRef.current})`
        );
        setMicEnabled?.(false, "recognition onend not listening");
        setIsListening(false);
        return;
      }

      const text = answerTextRef.current.trim();
      if (text) {
        console.debug(`[${phaseRef.current}][recognition onend] submit (answer length: ${text.length})`);
        setMicEnabled?.(false, "recognition onend submit");
        setIsListening(false);
        transition("processing");
        stopSpeaking();
        submitAnswerRef.current(text);
      } else {
        // No speech detected yet - restart only when phase === "listening", not submitting, and no fatal error
        console.debug(`[${phaseRef.current}][recognition onend] restart (waiting for candidate speech)`);
        try {
          instance.start();
          startedRef.current = true;
          setIsListening(true);
          setMicEnabled?.(true, "recognition onend restart");
        } catch (err) {
          console.warn("SpeechRecognition restart error:", err);
          startedRef.current = false;
          setMicEnabled?.(false, "recognition restart error");
          setIsListening(false);
        }
      }
    },
    [
      clearSilenceTimer,
      phaseRef,
      isSubmittingRef,
      answerTextRef,
      setMicEnabled,
      setIsListening,
      transition,
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
      setAnswer(base ? `${base} ${fullTranscript}`.trim() : fullTranscript.trim());

      // Auto-submit after 3.5 seconds of silence
      silenceTimerRef.current = setTimeout(() => {
        if (recognitionRef.current === instance && phaseRef.current === "listening") {
          console.log("[SILENCE DETECTED] Candidate stopped speaking. Auto-submitting...");
          try {
            instance.stop();
            startedRef.current = false;
          } catch {}
        }
      }, 3500);
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
        setIsListening(false);
        if (!hasShownFatalToastRef.current) {
          hasShownFatalToastRef.current = true;
          toast.error(
            "Microphone permission denied or audio capture unavailable. Please check your browser settings or type your answer."
          );
        }
        console.warn(`[${phaseRef.current}][recognition onerror] Fatal error: ${errorType}`);
        return;
      }

      console.warn(`[${phaseRef.current}][recognition onerror] Non-fatal error:`, errorType);
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
      setIsListening(false);
    };
  }, [clearSilenceTimer, draftBaseRef, interviewLanguage, phaseRef, setAnswer, setIsListening, setMicEnabled]);

  // Manual mic toggle (also used to stop & submit a voice answer)
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.info(
        "Microphone transcription is not supported in this browser. You can type your answer directly."
      );
      return;
    }

    // If AI is speaking, user interrupting AI stops speech and begins candidate answer
    if (phaseRef.current === "speaking" || isAISpeaking) {
      stopSpeaking();
      startListening();
      return;
    }

    if (phaseRef.current === "listening") {
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
  }, [clearSilenceTimer, phaseRef, startListening, stopSpeaking]);

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
    setIsListening(false);
  }, [clearSilenceTimer, setIsListening, setMicEnabled]);

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
    setIsListening(false);
  }, [clearSilenceTimer, setIsListening, setMicEnabled]);

  return {
    startListening,
    toggleListening,
    forceStopRecognition,
    abortRecognition,
  };
}
