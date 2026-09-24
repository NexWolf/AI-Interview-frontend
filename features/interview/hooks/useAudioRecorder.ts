/* THIS HOOK USE TO GET MICROPHONE AND MEDIASTREAM AND RECORD VOICE SAFELY */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SILENCE_DURATION = 2000;

export function useAudioRecorder() {
  const streamRef = useRef<MediaStream | null>(null);
  const recordRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceStartRef = useRef<number | null>(null);

  const [isListening, setIsListening] = useState<boolean>(false);

  const cleanupAudio = useCallback(() => {
    // 1. Cancel animation frame
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // 2. Stop and close AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    // 3. Stop MediaRecorder
    if (recordRef.current && recordRef.current.state !== "inactive") {
      try {
        recordRef.current.stop();
      } catch {}
    }
    recordRef.current = null;

    // 4. Release media stream tracks (free the microphone)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    silenceStartRef.current = null;
  }, []);

  const stopListening = useCallback(() => {
    cleanupAudio();
    setIsListening(false);
  }, [cleanupAudio]);

  const startListening = useCallback(async () => {
    // Clean up any existing stream before starting a new one
    cleanupAudio();
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      recordRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        // audio chunks available in audioChunksRef.current
      };

      recorder.start();
      setIsListening(true);

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);

      const checkAudio = () => {
        if (!audioContextRef.current || audioContextRef.current.state === "closed") return;

        analyzer.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

        if (average <= 10) {
          if (silenceStartRef.current === null) {
            silenceStartRef.current = Date.now();
          }

          const silenceDuration = Date.now() - silenceStartRef.current;
          if (silenceDuration >= SILENCE_DURATION) {
            stopListening();
            return;
          }
        } else {
          silenceStartRef.current = null;
        }

        rafIdRef.current = requestAnimationFrame(checkAudio);
      };

      rafIdRef.current = requestAnimationFrame(checkAudio);
    } catch (err) {
      console.error("Failed to start audio recording:", err);
      stopListening();
    }
  }, [cleanupAudio, stopListening]);

  // Cleanup completely on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    isListening,
    startListening,
    stopListening,
    audioChunks: audioChunksRef,
  };
}