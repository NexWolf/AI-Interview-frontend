import { useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseInterviewSpeechRecognitionProps {
  transition: (phase: any) => void;
  phaseRef: React.MutableRefObject<string>;
  isSubmittingRef: React.MutableRefObject<boolean>;
  setIsListening: (isListening: boolean) => void;
  answerTextRef: React.MutableRefObject<string>;
  stopSpeaking: () => void;
  submitAnswerRef: React.MutableRefObject<(text: string) => void>;
  setAnswer: (text: string) => void;
  draftBaseRef: React.MutableRefObject<string>;
  interviewLanguage?: string;
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
}: UseInterviewSpeechRecognitionProps) {
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.info("Microphone transcription is not supported in this browser. You can type your answer directly.");
      return;
    }
    transition("listening");
    try {
      recognitionRef.current.start();
    } catch {
      // recognition already active
    }
  }, [transition]);

  // Fired by the speech recognition engine when the user stops talking
  const handleRecognitionEnd = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    if (
      phaseRef.current === "closing" ||
      phaseRef.current !== "listening" ||
      isSubmittingRef.current ||
      !recognitionRef.current
    ) {
      setIsListening(false);
      return;
    }

    const text = answerTextRef.current.trim();
    if (text) {
      setIsListening(false);
      transition("processing");
      stopSpeaking();
      submitAnswerRef.current(text);
    } else {
      // No speech detected yet - keep the session alive and try again
      try {
        recognitionRef.current.start();
        setIsListening(true); // Ensure UI stays in listening mode
      } catch {}
    }
  }, [
    answerTextRef,
    isSubmittingRef,
    phaseRef,
    setIsListening,
    stopSpeaking,
    submitAnswerRef,
    transition,
  ]);

  const handleRecognitionEndRef = useRef(handleRecognitionEnd);
  handleRecognitionEndRef.current = handleRecognitionEnd;

  // Set up the SpeechRecognition engine once (re-created if language changes)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
    if (!supported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    const isArabic =
      interviewLanguage?.toLowerCase().includes("arabic") ||
      interviewLanguage?.includes("عربي");
    recognition.lang = isArabic ? "ar-SA" : "en-US";

    recognition.onresult = (event: any) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      // Rebuild the whole transcript from event.results every time instead of appending.
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      const base = draftBaseRef.current.trim();
      setAnswer(base ? `${base} ${fullTranscript}`.trim() : fullTranscript.trim());

      // Auto-submit after 3.5 seconds of silence
      silenceTimerRef.current = setTimeout(() => {
        if (recognitionRef.current && phaseRef.current === "listening") {
          console.log("[SILENCE DETECTED] User stopped speaking. Auto-submitting...");
          recognitionRef.current.stop();
        }
      }, 3500);
    };

    recognition.onerror = (err: any) => {
      if (err.error === "no-speech") {
        // Browser timed out waiting for speech. 'onend' will automatically restart it.
        return;
      }
      console.warn("Speech recognition error:", err.error || err);
      setIsListening(false);
    };

    recognition.onend = () => handleRecognitionEndRef.current();

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      try {
        recognition.onend = null;
        recognition.onerror = null;
        recognition.onresult = null;
        recognition.onstart = null;
        recognition.abort();
      } catch {}
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };
  }, [setAnswer, interviewLanguage, phaseRef]);

  // Manual mic toggle (also used to stop & submit a voice answer)
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.info("Microphone transcription is not supported in this browser. You can type your answer directly.");
      return;
    }
    if (phaseRef.current === "listening") {
      stopSpeaking();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      recognitionRef.current.stop(); // "onend" auto-submits, like a real call
    } else {
      stopSpeaking();
      startListening();
    }
  }, [phaseRef, stopSpeaking, startListening]);

  // A helper to forcefully stop the recognition (e.g., when skip, manual submit, or finish)
  const forceStopRecognition = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch {}
  }, []);

  // A helper to completely abort and destroy the instance (used in finish)
  const abortRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
  }, []);

  return {
    startListening,
    toggleListening,
    forceStopRecognition,
    abortRecognition,
  };
}
