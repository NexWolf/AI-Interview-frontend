"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

type MediaStatus = "idle" | "loading" | "ready" | "error" | "muted";

type MediaStreamContextType = {
  stream: MediaStream | null;
  videoStatus: MediaStatus;
  audioStatus: MediaStatus;
  stopStream: () => void;
  restartStream: () => Promise<MediaStream | null>;
  ensureStreamActive: () => Promise<MediaStream | null>;
};

const MediaStreamContext = createContext<MediaStreamContextType | null>(null);

// Global registry of all active media streams to guarantee no orphaned hardware tracks
const activeStreamsRegistry = new Set<MediaStream>();

/**
 * Force-close all active camera and microphone tracks across the entire browser window,
 * disconnect video/audio DOM elements, and cancel speech synthesis.
 */
export const stopGlobalMediaStream = () => {
  if (typeof window === "undefined") return;

  // 1. Force-stop all tracks attached to any HTMLMediaElement in the DOM
  try {
    document.querySelectorAll<HTMLMediaElement>("video, audio").forEach((el) => {
      try {
        const streamObj = el.srcObject as MediaStream | null;
        if (streamObj && "getTracks" in streamObj) {
          streamObj.getTracks().forEach((track) => {
            try {
              track.enabled = false;
              track.stop();
            } catch {}
          });
        }
        el.pause();
        el.srcObject = null;
        el.removeAttribute("src");
        el.load();
      } catch {}
    });
  } catch {}

  // 2. Stop all streams stored in the global registry
  try {
    activeStreamsRegistry.forEach((st) => {
      try {
        st.getTracks().forEach((track) => {
          try {
            track.enabled = false;
            track.stop();
          } catch {}
        });
      } catch {}
    });
    activeStreamsRegistry.clear();
  } catch {}

  // 3. Stop window.__activeMediaStream if present
  try {
    const globalStream = (window as any).__activeMediaStream as MediaStream | undefined;
    if (globalStream) {
      globalStream.getTracks().forEach((track) => {
        try {
          track.enabled = false;
          track.stop();
        } catch {}
      });
      (window as any).__activeMediaStream = null;
    }
  } catch {}

  // 4. Cancel any ongoing speech synthesis
  try {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  } catch {}
};

export const MediaStreamProvider = ({ children }: { children: React.ReactNode }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoStatus, setVideoStatus] = useState<MediaStatus>("loading");
  const [audioStatus, setAudioStatus] = useState<MediaStatus>("loading");
  const streamRef = useRef<MediaStream | null>(null);
  const pendingAcquisitionRef = useRef<Promise<MediaStream | null> | null>(null);

  const stopStream = useCallback(() => {
    // 1. Stop all tracks in streamRef
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.enabled = false;
          track.stop();
        } catch (err) {
          console.error("Error stopping track:", err);
        }
      });
      activeStreamsRegistry.delete(streamRef.current);
      streamRef.current = null;
    }

    // 2. Stop global tracks & DOM video elements
    stopGlobalMediaStream();

    // 3. Update state
    setStream(null);
    setVideoStatus("idle");
    setAudioStatus("idle");
  }, []);

  const startStream = useCallback(async (): Promise<MediaStream | null> => {
    // If a request is already in-flight, return the existing promise so callers share it
    if (pendingAcquisitionRef.current) {
      return pendingAcquisitionRef.current;
    }

    const acquisitionPromise = (async (): Promise<MediaStream | null> => {
      // Check if current stream already has live video and audio tracks
      if (
        streamRef.current &&
        streamRef.current.active &&
        streamRef.current.getVideoTracks().some((t) => t.readyState === "live" && t.enabled)
      ) {
        setStream(streamRef.current);
        setVideoStatus("ready");
        setAudioStatus("ready");
        return streamRef.current;
      }

      setVideoStatus("loading");
      setAudioStatus("loading");

      // Stop any dead/ended tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.enabled = false;
            track.stop();
          } catch {}
        });
        activeStreamsRegistry.delete(streamRef.current);
        streamRef.current = null;
      }

      try {
        if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
          setVideoStatus("error");
          setAudioStatus("error");
          return null;
        }

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 24, max: 30 },
            facingMode: "user",
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        streamRef.current = newStream;
        activeStreamsRegistry.add(newStream);
        setStream(newStream);

        if (typeof window !== "undefined") {
          (window as any).__activeMediaStream = newStream;
        }

        const videoTrack = newStream.getVideoTracks()[0];
        const audioTrack = newStream.getAudioTracks()[0];

        setVideoStatus(videoTrack && videoTrack.readyState === "live" ? "ready" : "error");
        setAudioStatus(audioTrack && audioTrack.readyState === "live" ? "ready" : "error");

        videoTrack?.addEventListener("ended", () => setVideoStatus("error"));
        videoTrack?.addEventListener("mute", () => setVideoStatus("muted"));
        videoTrack?.addEventListener("unmute", () => setVideoStatus("ready"));

        audioTrack?.addEventListener("ended", () => setAudioStatus("error"));
        audioTrack?.addEventListener("mute", () => setAudioStatus("muted"));
        audioTrack?.addEventListener("unmute", () => setAudioStatus("ready"));

        return newStream;
      } catch (e) {
        console.warn("MediaStream access error:", e);
        setVideoStatus("error");
        setAudioStatus("error");
        return null;
      }
    })();

    pendingAcquisitionRef.current = acquisitionPromise;
    try {
      return await acquisitionPromise;
    } finally {
      pendingAcquisitionRef.current = null;
    }
  }, []);

  const ensureStreamActive = useCallback(async (): Promise<MediaStream | null> => {
    const current = streamRef.current;
    if (
      current &&
      current.active &&
      current.getVideoTracks().some((t) => t.readyState === "live" && t.enabled)
    ) {
      setStream(current);
      setVideoStatus("ready");
      setAudioStatus("ready");
      return current;
    }
    return await startStream();
  }, [startStream]);

  useEffect(() => {
    startStream();

    const handleBeforeUnload = () => {
      stopGlobalMediaStream();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [startStream]);

  return (
    <MediaStreamContext.Provider
      value={{
        stream,
        videoStatus,
        audioStatus,
        stopStream,
        restartStream: startStream,
        ensureStreamActive,
      }}
    >
      {children}
    </MediaStreamContext.Provider>
  );
};

export const useMediaStream = () => {
  const ctx = useContext(MediaStreamContext);
  if (!ctx) throw Error("useMediaStream must be used inside MediaStreamProvider");
  return ctx;
};

