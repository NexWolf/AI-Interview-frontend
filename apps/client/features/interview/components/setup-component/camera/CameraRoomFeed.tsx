"use client";

import React from "react";
import { Video, VideoOff } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface CameraRoomFeedProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraReady: boolean;
  cameraError: boolean;
  faceDetected: boolean;
  multipleFaces: boolean;
  isLookingAway: boolean;
  statusMessage: string;
}

/**
 * Modern In-Interview Room Camera Feed.
 * Stripped of intrusive badges for an unobstructed view of the candidate.
 * Applies a glowing red border only when a proctoring violation occurs.
 */
export const CameraRoomFeed: React.FC<CameraRoomFeedProps> = ({
  videoRef,
  cameraReady,
  cameraError,
  faceDetected,
  multipleFaces,
  isLookingAway,
}) => {
  const hasVisualViolation = !faceDetected || multipleFaces || isLookingAway;

  return (
    <div
      className={cn(
        "relative w-full h-full bg-slate-950 flex flex-col items-center justify-center transition-all duration-300 rounded-2xl overflow-hidden",
        hasVisualViolation
          ? "ring-2 ring-red-500 border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.55)] animate-pulse"
          : "border border-border/50 shadow-md"
      )}
    >
      {/* Video Stream Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={cn(
          "w-full h-full object-cover -scale-x-100",
          cameraReady ? "block" : "hidden"
        )}
      />

      {/* Subtle Mini Activity Indicator (Top-Left) */}
      {cameraReady && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md pointer-events-none">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              hasVisualViolation
                ? "bg-red-500 animate-ping"
                : "bg-emerald-500 animate-pulse"
            )}
          />
          <span className="text-[10px] font-medium text-white/80">
            {hasVisualViolation ? "تنبيه" : "مباشر"}
          </span>
        </div>
      )}

      {/* Loading / Idle State */}
      {!cameraReady && !cameraError && (
        <div className="flex flex-col items-center gap-2 text-slate-400 p-2 text-center">
          <Video className="w-6 h-6 animate-pulse text-primary" />
          <span className="text-[11px]">جاري تشغيل الكاميرا...</span>
        </div>
      )}

      {/* Error State */}
      {cameraError && (
        <div className="flex flex-col items-center gap-2 text-red-400 p-2 text-center">
          <VideoOff className="w-6 h-6" />
          <span className="text-[11px]">تعذر الاتصال بالكاميرا</span>
        </div>
      )}
    </div>
  );
};

export default CameraRoomFeed;
