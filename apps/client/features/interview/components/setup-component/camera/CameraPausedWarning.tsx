"use client";

import React from "react";
import { Video, VideoOff } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { AppButton } from "@/shared/components/ui/AppButton";

export interface CameraPausedWarningProps {
  onResume: () => void;
}

/**
 * Anti-Cheating & Security warning overlay displayed when camera stream is paused by candidate.
 * Informs the candidate that the interview cannot be started without continuous video feed.
 */
export const CameraPausedWarning: React.FC<CameraPausedWarningProps> = ({ onResume }) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-neutral-950/90 backdrop-blur-xs space-y-3 animate-in fade-in duration-200">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
        <VideoOff className="w-6 h-6" />
      </div>

      <div className="space-y-1 max-w-xs">
        <h3 className="text-sm font-bold text-amber-300">
          {isAr ? "الكاميرا متوقفة مؤقتاً" : "Camera Feed Paused"}
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          {isAr
            ? "تنبيه أمني: نظام المقابلة يتطلب بقاء الكاميرا قيد التشغيل للتحقق من الهوية ومنع الغش، ولن يتم تفعيل زر البدء بدونها."
            : "Security Notice: Continuous camera feed is strictly required for identity verification. The start button remains locked until enabled."}
        </p>
      </div>

      <AppButton
        variant="primary"
        size="md"
        onClick={onResume}
        icon={<Video className="w-4 h-4" />}
        iconPosition="start"
        className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold border-none"
      >
        {isAr ? "إعادة تشغيل الكاميرا الآن" : "Resume Camera Now"}
      </AppButton>
    </div>
  );
};

export default CameraPausedWarning;
