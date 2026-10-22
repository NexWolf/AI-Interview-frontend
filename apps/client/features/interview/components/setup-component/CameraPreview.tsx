"use client";

import React from "react";
import { Check, Video, RotateCcw } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useCameraPreview } from "@/features/interview/hooks/useCameraPreview";
import {
  useCameraProctoring,
  CameraViolationEvent,
} from "@/features/interview/hooks/useCameraProctoring";
import {
  CameraRoomFeed,
  CameraActivationOverlay,
  CameraPausedWarning,
  CameraFloatingControls,
} from "./camera";

export type ProctoringStatus = {
  faceDetected: boolean;
  multipleFaces: boolean;
  isLookingAway: boolean;
  statusMessage: string;
  hasViolation: boolean;
};

export type CameraProps = {
  onReady?: (value: boolean) => void;
  isRoomInterview?: boolean;
  onCameraViolation?: (violation: CameraViolationEvent) => void;
  onProctoringStatusChange?: (status: ProctoringStatus) => void;
};

/**
 * Main Camera Preview Component for Interview Preparation and Proctoring.
 * Clean, declarative presenter: Logic is cleanly abstracted inside `useCameraPreview`.
 */
export const CameraPreview: React.FC<CameraProps> = ({
  onReady,
  isRoomInterview = false,
  onCameraViolation,
  onProctoringStatusChange,
}) => {
  const {
    videoRef,
    isAr,
    isRequesting,
    isVideoMuted,
    isAudioMuted,
    hasLiveVideoTrack,
    cameraReady,
    cameraError,
    handleToggleVideo,
    handleToggleAudio,
    handleActivateDevices,
  } = useCameraPreview({ onReady });

  const onCameraViolationRef = React.useRef(onCameraViolation);
  onCameraViolationRef.current = onCameraViolation;

  const onProctoringStatusChangeRef = React.useRef(onProctoringStatusChange);
  onProctoringStatusChangeRef.current = onProctoringStatusChange;

  const lastStatusRef = React.useRef<{ hasViolation: boolean; statusMessage: string }>({
    hasViolation: false,
    statusMessage: "",
  });

  // Real-time camera proctoring (only active when inside the actual interview room)
  const {
    faceDetected,
    multipleFaces,
    isLookingAway,
    statusMessage,
  } = useCameraProctoring({
    videoRef,
    isEnabled: isRoomInterview && cameraReady,
    onViolation: (v) => {
      onCameraViolationRef.current?.(v);
    },
  });

  // Notify parent of proctoring status changes for top bar display (only on meaningful change)
  React.useEffect(() => {
    if (!isRoomInterview || !onProctoringStatusChangeRef.current) return;

    const hasViolation = !faceDetected || multipleFaces || isLookingAway;
    const msg = statusMessage || "";

    if (
      lastStatusRef.current.hasViolation !== hasViolation ||
      lastStatusRef.current.statusMessage !== msg
    ) {
      lastStatusRef.current = { hasViolation, statusMessage: msg };
      onProctoringStatusChangeRef.current({
        faceDetected,
        multipleFaces,
        isLookingAway,
        statusMessage,
        hasViolation,
      });
    }
  }, [faceDetected, multipleFaces, isLookingAway, statusMessage, isRoomInterview]);

  // 1. Room Interview View (Proctoring Feed)
  if (isRoomInterview) {
    return (
      <CameraRoomFeed
        videoRef={videoRef}
        cameraReady={cameraReady}
        cameraError={cameraError}
        faceDetected={faceDetected}
        multipleFaces={multipleFaces}
        isLookingAway={isLookingAway}
        statusMessage={statusMessage}
      />
    );
  }

  // 2. Setup Step View (Hardware Check with Modular Overlays & Controls)
  return (
    <div className="w-full md:w-1/2 p-5 sm:p-6 rounded-2xl border border-border bg-card/60 shadow-sm transition-all flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Video className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground text-base">
            {isAr ? "فحص الكاميرا والأجهزة" : "Camera & Hardware Check"}
          </h2>
        </div>

        {cameraReady && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
            {isAr ? "متصل ويعمل" : "Working"}
          </div>
        )}

        {cameraError && (
          <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            {isAr ? "الكاميرا غير متاحة" : "Camera unavailable"}
          </div>
        )}
      </div>

      {/* Camera Preview Viewport */}
      <div className="mt-4 rounded-xl bg-muted/30 border border-border p-4 flex-1 flex flex-col justify-between gap-4">
        <div className="relative w-full flex-1 min-h-[240px] rounded-xl overflow-hidden bg-neutral-950 border border-border/80 flex items-center justify-center shadow-inner group">
          {/* Dynamic Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn(
              "w-full h-full object-cover -scale-x-100 transition-opacity duration-300",
              cameraReady && !isVideoMuted ? "opacity-100 block" : "opacity-0 hidden"
            )}
          />

          {/* Anti-Cheating Warning when video is paused */}
          {hasLiveVideoTrack && isVideoMuted && (
            <CameraPausedWarning onResume={handleToggleVideo} />
          )}

          {/* Interactive Activation Overlay when stream is not acquired or permission blocked */}
          {!hasLiveVideoTrack && (
            <CameraActivationOverlay
              cameraError={cameraError}
              isRequesting={isRequesting}
              onActivate={handleActivateDevices}
            />
          )}

          {/* Floating Action Controls Bar (Meet / Zoom style) when camera is active */}
          {cameraReady && (
            <CameraFloatingControls
              isVideoMuted={isVideoMuted}
              isAudioMuted={isAudioMuted}
              isRequesting={isRequesting}
              onToggleVideo={handleToggleVideo}
              onToggleAudio={handleToggleAudio}
              onRefresh={handleActivateDevices}
            />
          )}

          {/* Top Live Indicator Dot */}
          {cameraReady && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-white/90">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isVideoMuted ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
                )}
              />
              <span className="font-medium">
                {isVideoMuted
                  ? isAr ? "الفيديو متوقف" : "Video Paused"
                  : isAr ? "مباشر" : "Live Feed"}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Status & Refresh Action */}
        <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{isAr ? "حالة الأجهزة:" : "Hardware Status:"}</span>
            <span
              className={cn(
                "font-semibold",
                cameraReady ? "text-emerald-500" : cameraError ? "text-rose-500" : "text-amber-500"
              )}
            >
              {cameraReady
                ? isAr ? "متصل وجاهز ✓" : "Connected & Ready ✓"
                : cameraError
                  ? isAr ? "خطأ في الإذن ✗" : "Access Error ✗"
                  : isAr ? "بانتظار التفعيل" : "Pending Activation"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleActivateDevices}
            disabled={isRequesting}
            className="text-[11px] text-primary hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
          >
            <RotateCcw className={cn("w-3 h-3", isRequesting && "animate-spin")} />
            <span>{isAr ? "إعادة الفحص" : "Re-test"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraPreview;