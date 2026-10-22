"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useMediaStream } from "@/shared/components/provider/MediaStermProvider";
import { useLanguage } from "@/shared/context/LanguageContext";

export interface UseMicrophoneTestProps {
  interviewLanguage: "Arabic" | "English";
  onReady: (ready: boolean) => void;
}

/**
 * Dedicated Custom Hook for Testing Microphone & Speech Recognition.
 * Encapsulates:
 * 1. Stream readiness check & live audio track monitoring from single source of truth (`useMediaStream`).
 * 2. Hardware volume visualizer (AudioContext + AnalyserNode + requestAnimationFrame).
 * 3. Speech recognition phrase verification ("أنا مستعد الآن" / "I am ready now").
 * 4. Automatic memory cleanup on unmount.
 */
export function useMicrophoneTest({
  interviewLanguage,
  onReady,
}: UseMicrophoneTestProps) {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const {
    stream,
    audioStatus,
    isMicEnabled,
    setMicEnabled,
    ensureStreamActive,
  } = useMediaStream();

  const [spokenText, setSpokenText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const testRecognitionRef = useRef<any>(null);

  // Expected phrase based on interview language
  const expectedText =
    interviewLanguage === "Arabic" ? "أنا مستعد الآن" : "I am ready now";
  const speechLang = interviewLanguage === "Arabic" ? "ar-SA" : "en-US";

  // Auto-acquire stream if idle
  useEffect(() => {
    if (audioStatus === "idle") {
      ensureStreamActive?.().catch(() => {});
    }
  }, [audioStatus, ensureStreamActive]);

  // Keep streamRef in sync
  useEffect(() => {
    if (stream) {
      streamRef.current = stream;
    }
  }, [stream]);

  // Live audio track verification
  const hasLiveAudioTrack = Boolean(
    stream &&
      stream.getAudioTracks().some((t) => t.readyState === "live" && t.enabled)
  );

  // Strict readiness check
  const microphoneReady = Boolean(
    stream &&
      hasLiveAudioTrack &&
      isMicEnabled &&
      audioStatus !== "error"
  );

  const isAudioMuted = !isMicEnabled || !hasLiveAudioTrack;
  const microphoneError = audioStatus === "error";

  // Notify parent setup wizard
  useEffect(() => {
    onReady(microphoneReady);
  }, [microphoneReady, onReady]);

  // Audio Visualizer functions
  const startAudioVisualizer = useCallback(() => {
    if (!streamRef.current) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;

      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(streamRef.current);
      const analyzer = audioContext.createAnalyser();
      analyserRef.current = analyzer;
      analyzer.fftSize = 256;
      source.connect(analyzer);

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);

      const updateVolume = () => {
        if (!audioContextRef.current || audioContextRef.current.state === "closed") return;
        analyzer.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const average = sum / dataArray.length;
        setVolume(average);
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn("Audio visualizer initialization failed:", err);
    }
  }, []);

  const stopAudioVisualizer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
    setVolume(0);
  }, []);

  // Speech Recognition Test
  const startVoiceTest = useCallback(() => {
    if (isAudioMuted) {
      setMicEnabled(true, "startVoiceTest");
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isAr
          ? "ميزة التعرف الصوتي غير مدعومة في هذا المتصفح. يمكنك المتابعة وكتابة إجاباتك."
          : "Speech Recognition is not supported in this browser."
      );
      return;
    }

    if (testRecognitionRef.current) {
      try {
        testRecognitionRef.current.abort();
      } catch {}
      testRecognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    testRecognitionRef.current = recognition;

    recognition.lang = speechLang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setSpokenText(result);
    };

    recognition.onstart = () => {
      setIsListening(true);
      startAudioVisualizer();
    };

    recognition.onend = () => {
      setIsListening(false);
      stopAudioVisualizer();
      testRecognitionRef.current = null;
    };

    recognition.onerror = () => {
      setIsListening(false);
      stopAudioVisualizer();
      testRecognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition start failed:", err);
      setIsListening(false);
      stopAudioVisualizer();
    }
  }, [isAudioMuted, isAr, speechLang, setMicEnabled, startAudioVisualizer, stopAudioVisualizer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioVisualizer();
      if (testRecognitionRef.current) {
        try {
          testRecognitionRef.current.abort();
        } catch {}
        testRecognitionRef.current = null;
      }
    };
  }, [stopAudioVisualizer]);

  return {
    isAr,
    microphoneReady,
    isAudioMuted,
    microphoneError,
    isListening,
    volume,
    spokenText,
    expectedText,
    startVoiceTest,
    setMicEnabled,
  };
}
