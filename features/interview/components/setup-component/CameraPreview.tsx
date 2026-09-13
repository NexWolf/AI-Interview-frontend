"use client";

import { useMediaStream } from "@/shared/components/provider/MediaStermProvider";
import { Check, Video, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CameraProps = {
  onReady?: (value: boolean) => void;
  isRoomInterview?: boolean;
};

const CameraPreview = ({ onReady, isRoomInterview = false }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, videoStatus } = useMediaStream();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const cameraReady = videoStatus === "ready";
  const cameraError = videoStatus === "error";

  useEffect(() => {
    if (onReady) {
      onReady(cameraReady);
    }
  }, [cameraReady, onReady]);

  if (isRoomInterview) {
    return (
      <div className="relative w-full h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-xl">
        <span className="absolute top-3 left-3 z-10 text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full">
          Candidate (You)
        </span>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover -scale-x-100 ${
            cameraReady ? "block" : "hidden"
          }`}
        />
        {!cameraReady && !cameraError && (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Video className="w-8 h-8 animate-pulse text-indigo-400" />
            <span className="text-xs">Initializing camera feed...</span>
          </div>
        )}
        {cameraError && (
          <div className="flex flex-col items-center gap-2 text-red-400">
            <VideoOff className="w-8 h-8" />
            <span className="text-xs">Camera connection failed</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 p-5 sm:p-6 rounded-2xl border border-border bg-card/60 shadow-sm transition-all flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Video className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground text-base">
            Camera Check
          </h2>
        </div>

        {cameraReady && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
            Working
          </div>
        )}

        {cameraError && (
          <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            Camera unavailable
          </div>
        )}
      </div>

      {/* Camera Preview Container */}
      <div className="mt-4 rounded-xl bg-muted/30 border border-border p-4 flex-1 flex flex-col justify-between gap-4">
        {/* شاشة العرض - تبقى داكنة مثل كاميرات Google Meet و Zoom لتباين أوضح للفيديو */}
        <div className="relative w-full flex-1 min-h-[220px] rounded-lg overflow-hidden bg-neutral-950 border border-border/80 flex items-center justify-center shadow-inner">
          {/* Dynamic Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover -scale-x-100 ${
              cameraReady ? "block" : "hidden"
            }`}
          />

          {/* Fallback state when camera is loading / idle */}
          {!cameraReady && !cameraError && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Video className="w-8 h-8 animate-pulse text-primary" />
              <span className="text-xs">Initializing camera...</span>
            </div>
          )}

          {/* Fallback state when camera has error */}
          {cameraError && (
            <div className="flex flex-col items-center gap-2 text-rose-500">
              <VideoOff className="w-8 h-8" />
              <span className="text-xs">Unable to access camera</span>
            </div>
          )}
        </div>

        {/* Bottom Status / Footer */}
        <div className="p-3 rounded-xl bg-card border border-border text-center shadow-sm">
          <p className="text-xs text-muted-foreground">
            Status:{" "}
            <span className="text-foreground font-semibold">
              {cameraReady
                ? "Video stream active"
                : cameraError
                ? "Device error"
                : "Connecting..."}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CameraPreview;