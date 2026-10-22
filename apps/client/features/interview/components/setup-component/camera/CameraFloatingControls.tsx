"use client";

import React from "react";
import { Video, VideoOff, Mic, MicOff, RotateCcw } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/shared/lib/utils";

export interface CameraFloatingControlsProps {
  isVideoMuted: boolean;
  isAudioMuted: boolean;
  isRequesting: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onRefresh: () => void;
}

/**
 * Floating action pill (Meet / Zoom style) positioned at the bottom of the active camera feed.
 * Allows quick toggling of video, audio, and hardware re-syncing.
 */
export const CameraFloatingControls: React.FC<CameraFloatingControlsProps> = ({
  isVideoMuted,
  isAudioMuted,
  isRequesting,
  onToggleVideo,
  onToggleAudio,
  onRefresh,
}) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center pointer-events-auto">
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 shadow-xl transition-all">
        {/* Video Toggle Button */}
        <button
          type="button"
          onClick={onToggleVideo}
          title={
            isVideoMuted
              ? isAr ? "تشغيل الكاميرا" : "Turn Video On"
              : isAr ? "إيقاف الكاميرا مؤقتاً" : "Turn Video Off"
          }
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90",
            isVideoMuted
              ? "bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/30"
              : "bg-white/10 hover:bg-white/20 text-white"
          )}
        >
          {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
        </button>

        {/* Audio Toggle Button */}
        <button
          type="button"
          onClick={onToggleAudio}
          title={
            isAudioMuted
              ? isAr ? "إلغاء كتم الصوت" : "Unmute Mic"
              : isAr ? "كتم الصوت" : "Mute Mic"
          }
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90",
            isAudioMuted
              ? "bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/30"
              : "bg-white/10 hover:bg-white/20 text-white"
          )}
        >
          {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Re-sync / Refresh Hardware Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRequesting}
          title={isAr ? "إعادة تهيئة الأجهزة" : "Refresh Devices"}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer active:scale-90 disabled:opacity-50"
        >
          <RotateCcw className={cn("w-4 h-4", isRequesting && "animate-spin")} />
        </button>
      </div>
    </div>
  );
};

export default CameraFloatingControls;
