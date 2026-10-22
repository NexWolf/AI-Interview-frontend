"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useInterviewStore } from "../store/useInterviewStore";

interface UseAudioRecorderProps {
  /**
   * Existing MediaStream from MediaStreamProvider.
   * If provided, the recorder reuses it without re-prompting getUserMedia or disrupting hardware tracks.
   */
  stream?: MediaStream | null;
  /**
   * Called when the 5-second silence countdown hits 0.
   */
  onAutoSubmit?: (blob: Blob | null) => void;
  /**
   * Required continuous silence duration before countdown begins (default: 2000ms).
   */
  silenceDurationMs?: number;
  /**
   * Audio frequency threshold below which sound is considered silence (default: 22).
   */
  silenceThreshold?: number;
}

export function useAudioRecorder({
  stream = null,
  onAutoSubmit,
  silenceDurationMs = 2000,
  silenceThreshold = 22,
}: UseAudioRecorderProps = {}) {
  const recordRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const internalStreamRef = useRef<MediaStream | null>(null);
  const stopResolverRef = useRef<((blob: Blob | null) => void) | null>(null);

  // Web Audio API refs for volume & silence detection
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const hasSpokenRef = useRef<boolean>(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef<boolean>(false);

  const onAutoSubmitRef = useRef(onAutoSubmit);
  onAutoSubmitRef.current = onAutoSubmit;

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentVolume, setCurrentVolume] = useState<number>(0);

  // Pick best browser-supported mimeType
  const getSupportedMimeType = useCallback((): string => {
    if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
      return "audio/webm";
    }
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
      "audio/wav",
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return "";
  }, []);

  const clearSilenceTimers = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    silenceStartRef.current = null;
    hasSpokenRef.current = false;
    useInterviewStore.getState().setAutoSubmitCountdown(null);
  }, []);

  const cleanupAudio = useCallback(() => {
    isRecordingRef.current = false;
    clearSilenceTimers();

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;

    if (recordRef.current && recordRef.current.state !== "inactive") {
      try {
        recordRef.current.stop();
      } catch {}
    }
    recordRef.current = null;
    audioChunksRef.current = [];
    setIsRecording(false);
    setCurrentVolume(0);
  }, [clearSilenceTimers]);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    isRecordingRef.current = false;
    clearSilenceTimers();
    setCurrentVolume(0);

    return new Promise((resolve) => {
      const recorder = recordRef.current;
      const mime = getSupportedMimeType() || "audio/webm";

      if (!recorder || recorder.state === "inactive") {
        const blob =
          audioChunksRef.current.length > 0
            ? new Blob(audioChunksRef.current, { type: mime })
            : null;
        resolve(blob);
        return;
      }

      let resolved = false;
      const finish = (blob: Blob | null) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(safetyTimer);
        stopResolverRef.current = null;
        resolve(blob);
      };

      stopResolverRef.current = finish;

      // Safety timeout: Guarantee promise resolution if recorder.onstop doesn't fire
      const safetyTimer = setTimeout(() => {
        console.warn("[useAudioRecorder] onstop timed out; resolving with available chunks");
        const blob =
          audioChunksRef.current.length > 0
            ? new Blob(audioChunksRef.current, { type: mime })
            : null;
        finish(blob);
      }, 1200);

      try {
        if (recorder.state === "recording") {
          recorder.requestData();
        }
        recorder.stop();
      } catch (err) {
        console.warn("[useAudioRecorder] Error stopping recorder:", err);
        clearTimeout(safetyTimer);
        finish(null);
      }
    });
  }, [clearSilenceTimers, getSupportedMimeType]);

  const startRecording = useCallback(
    async (overrideStream?: MediaStream | null) => {
      cleanupAudio();
      audioChunksRef.current = [];
      hasSpokenRef.current = false;
      silenceStartRef.current = null;

      try {
        let activeStream = overrideStream || stream || internalStreamRef.current;

        // If no stream provided via props or cache, acquire one safely
        if (
          !activeStream ||
          !activeStream.active ||
          activeStream.getAudioTracks().length === 0 ||
          activeStream.getAudioTracks().every((t) => t.readyState === "ended")
        ) {
          activeStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          internalStreamRef.current = activeStream;
        }

        // CRITICAL: Explicitly ensure audio tracks are enabled (unmuted)
        const audioTracks = activeStream.getAudioTracks();
        if (audioTracks.length === 0) {
          throw new Error("No active audio tracks available on media stream");
        }
        audioTracks.forEach((track) => {
          track.enabled = true;
        });

        // Isolate audio tracks into an audio-only stream to guarantee MediaRecorder compatibility
        const audioOnlyStream = new MediaStream(audioTracks);

        const mimeType = getSupportedMimeType();
        const options: MediaRecorderOptions = mimeType ? { mimeType } : {};

        const recorder = new MediaRecorder(audioOnlyStream, options);
        recordRef.current = recorder;

        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const finalMime = mimeType || "audio/webm";
          const blob =
            audioChunksRef.current.length > 0
              ? new Blob(audioChunksRef.current, { type: finalMime })
              : null;

          console.log(
            `%c🎙️ [useAudioRecorder] Recording stopped. Chunks: ${audioChunksRef.current.length}, Total Bytes: ${blob?.size || 0}`,
            "background: #10b981; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;"
          );

          if (stopResolverRef.current) {
            stopResolverRef.current(blob);
          }
          setIsRecording(false);
          isRecordingRef.current = false;
        };

        recorder.onerror = (e) => {
          console.warn("[useAudioRecorder] MediaRecorder error:", e);
          if (stopResolverRef.current) {
            stopResolverRef.current(null);
          }
          setIsRecording(false);
          isRecordingRef.current = false;
        };

        // Record chunks every 250ms for smooth memory allocation
        recorder.start(250);
        setIsRecording(true);
        isRecordingRef.current = true;

        // Start Web Audio API Analyser for real-time silence detection
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

        if (AudioCtx) {
          const audioContext = new AudioCtx();
          audioContextRef.current = audioContext;

          if (audioContext.state === "suspended") {
            await audioContext.resume().catch(() => {});
          }

          const source = audioContext.createMediaStreamSource(activeStream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const checkAudioActivity = () => {
            if (!analyserRef.current || !isRecordingRef.current) return;

            analyserRef.current.getByteFrequencyData(dataArray);
            const average =
              dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

            const roundedVol = Math.round(average);
            setCurrentVolume(roundedVol);

            if (average > silenceThreshold) {
              // Candidate is actively speaking
              hasSpokenRef.current = true;
              silenceStartRef.current = null;

              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
                useInterviewStore.getState().setAutoSubmitCountdown(null);
              }
            } else if (hasSpokenRef.current) {
              // Candidate paused after having spoken
              if (silenceStartRef.current === null) {
                silenceStartRef.current = Date.now();
              } else if (Date.now() - silenceStartRef.current >= silenceDurationMs) {
                // Trigger 5-second countdown if not already counting
                if (!countdownIntervalRef.current) {
                  let count = 5;
                  useInterviewStore.getState().setAutoSubmitCountdown(count);

                  countdownIntervalRef.current = setInterval(async () => {
                    count -= 1;
                    if (count <= 0) {
                      if (countdownIntervalRef.current) {
                        clearInterval(countdownIntervalRef.current);
                        countdownIntervalRef.current = null;
                      }
                      useInterviewStore.getState().setAutoSubmitCountdown(null);
                      console.log(
                        "%c⏱️ [useAudioRecorder] Silence countdown finished (0s). Auto-submitting audio...",
                        "background: #10b981; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;"
                      );
                      const blob = await stopRecording();
                      if (onAutoSubmitRef.current) {
                        onAutoSubmitRef.current(blob);
                      }
                    } else {
                      useInterviewStore.getState().setAutoSubmitCountdown(count);
                    }
                  }, 1000);
                }
              }
            }

            rafIdRef.current = requestAnimationFrame(checkAudioActivity);
          };

          rafIdRef.current = requestAnimationFrame(checkAudioActivity);
        }
      } catch (err) {
        console.error("[useAudioRecorder] Failed to start audio recording:", err);
        cleanupAudio();
      }
    },
    [cleanupAudio, getSupportedMimeType, silenceDurationMs, silenceThreshold, stopRecording, stream]
  );

  // Cleanup recorder safely on unmount without touching hardware tracks
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    isRecording,
    currentVolume,
    startRecording,
    stopRecording,
    cleanupAudio,
    audioChunks: audioChunksRef,
  };
}
