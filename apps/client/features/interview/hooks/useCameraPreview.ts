"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useMediaStream } from "@/shared/components/provider/MediaStermProvider";
import { useLanguage } from "@/shared/context/LanguageContext";
import { preloadFaceLandmarker } from "./useCameraProctoring";

export interface UseCameraPreviewProps {
  onReady?: (value: boolean) => void;
}

/**
 * Dedicated Custom Hook for Camera Preview & Hardware Control.
 * Encapsulates:
 * 1. Stream acquisition and lifecycle management from single source of truth (`useMediaStream`).
 * 2. Video element binding, safe autoplay handling, and unmount detachment.
 * 3. Track mute state synchronization for both camera and microphone.
 * 4. Manual activation / reconnection triggers.
 * 5. Strict readiness validation (`cameraReady`) to gate interview start.
 */
export function useCameraPreview({ onReady }: UseCameraPreviewProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = useLanguage();
  const isAr = language === "ar";

  const {
    stream,
    videoStatus,
    ensureStreamActive,
    restartStream,
    setMicEnabled,
  } = useMediaStream();

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Auto-acquire stream if idle (only if not explicitly stopped)
  useEffect(() => {
    if (videoStatus === "idle") {
      ensureStreamActive().catch((err) => {
        console.warn("Failed to activate camera stream:", err);
      });
    }
  }, [videoStatus, ensureStreamActive]);

  // Security & Anti-Cheating check: cameraReady strictly requires live, unmuted video track
  const hasLiveVideoTrack = Boolean(
    stream &&
      stream.getVideoTracks().some((t) => t.readyState === "live" && t.enabled)
  );
  const cameraReady =
    hasLiveVideoTrack && videoStatus !== "error" && !isVideoMuted;
  const cameraError = videoStatus === "error";

  // Pre-warm MediaPipe wasm in idle time during Setup so entering the room has zero freeze
  useEffect(() => {
    if (cameraReady) {
      if (typeof window !== "undefined") {
        if ("requestIdleCallback" in window) {
          (window as any).requestIdleCallback(() => preloadFaceLandmarker());
        } else {
          setTimeout(() => preloadFaceLandmarker(), 400);
        }
      }
    }
  }, [cameraReady]);

  // Bind stream to video element with safe autoplay and unmount cleanup
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !stream) return;

    if (videoEl.srcObject !== stream) {
      videoEl.srcObject = stream;
    }

    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Camera video play caught:", err);
        }
      });
    }

    return () => {
      if (videoEl) {
        try {
          videoEl.pause();
          videoEl.srcObject = null;
        } catch {}
      }
    };
  }, [stream, cameraReady]);

  // Synchronize track mute states with stream tracks
  useEffect(() => {
    if (!stream) return;
    const vTrack = stream.getVideoTracks()[0];
    const aTrack = stream.getAudioTracks()[0];
    if (vTrack) setIsVideoMuted(!vTrack.enabled);
    if (aTrack) setIsAudioMuted(!aTrack.enabled);
  }, [stream]);

  // Propagate readiness to parent wizard (locks Start button if camera is muted/off)
  useEffect(() => {
    if (onReady) {
      onReady(cameraReady);
    }
  }, [cameraReady, onReady]);

  // Toggle Video Track
  const handleToggleVideo = useCallback(() => {
    if (!stream) return;
    const vTrack = stream.getVideoTracks()[0];
    if (vTrack) {
      const nextState = !vTrack.enabled;
      vTrack.enabled = nextState;
      setIsVideoMuted(!nextState);
    }
  }, [stream]);

  // Toggle Audio Track
  const handleToggleAudio = useCallback(() => {
    if (!stream) return;
    const aTrack = stream.getAudioTracks()[0];
    const nextState = aTrack ? !aTrack.enabled : true;
    setMicEnabled(nextState, "CameraPreviewToggle");
    setIsAudioMuted(!nextState);
  }, [stream, setMicEnabled]);

  // Manual Trigger to Request or Reconnect Camera & Microphone
  const handleActivateDevices = useCallback(async () => {
    try {
      setIsRequesting(true);
      const newStream = await restartStream();
      if (newStream) {
        setMicEnabled(true, "CameraPreviewManualActivate");
        setIsAudioMuted(false);
        setIsVideoMuted(false);
      }
    } catch (err) {
      console.warn("Manual device activation error:", err);
    } finally {
      setIsRequesting(false);
    }
  }, [restartStream, setMicEnabled]);

  return {
    videoRef,
    isAr,
    stream,
    videoStatus,
    isRequesting,
    isVideoMuted,
    isAudioMuted,
    hasLiveVideoTrack,
    cameraReady,
    cameraError,
    handleToggleVideo,
    handleToggleAudio,
    handleActivateDevices,
  };
}
