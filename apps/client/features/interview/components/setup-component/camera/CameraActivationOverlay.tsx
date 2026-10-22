"use client";

import React from "react";
import { Video, VideoOff, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { AppButton } from "@/shared/components/ui/AppButton";

export interface CameraActivationOverlayProps {
  cameraError: boolean;
  isRequesting: boolean;
  onActivate: () => void;
}

/**
 * Interactive glassmorphic overlay displayed when camera stream is not yet acquired or permission is blocked.
 * Prompts user to grant browser permissions with a glowing CTA button and clear instructions.
 */
export const CameraActivationOverlay: React.FC<CameraActivationOverlayProps> = ({
  cameraError,
  isRequesting,
  onActivate,
}) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-neutral-950/80 backdrop-blur-xs space-y-3">
      {/* Icon Badge */}
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform",
          cameraError
            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            : "bg-primary/20 text-primary border border-primary/30"
        )}
      >
        {cameraError ? (
          <VideoOff className="w-6 h-6" />
        ) : isRequesting ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        ) : (
          <Video className="w-6 h-6 animate-pulse" />
        )}
      </div>

      {/* Title & Guidance */}
      <div className="space-y-1 max-w-xs">
        <h3 className="text-sm font-bold text-white">
          {cameraError
            ? isAr
              ? "تم حظر إذن الكاميرا أو الجهاز غير متصل"
              : "Permission Blocked or Device Not Found"
            : isAr
              ? "الكاميرا والمايكروفون بانتظار التفعيل"
              : "Camera & Mic Ready to Activate"}
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          {cameraError
            ? isAr
              ? "يرجى الضغط على علامة القفل بجانب شريط الرابط في متصفحك والسماح بالكاميرا والصوت."
              : "Please check your browser permissions icon in the address bar and allow camera access."
            : isAr
              ? "اضغط أدناه لفتح إذن المتصفح وتأكيد وضوح الصوت والصورة."
              : "Click below to request browser permission and test your hardware stream."}
        </p>
      </div>

      {/* Main Activation Call to Action Button */}
      <AppButton
        variant="gradient"
        size="md"
        onClick={onActivate}
        isLoading={isRequesting}
        icon={!isRequesting ? <Sparkles className="w-4 h-4 text-amber-300 shrink-0" /> : undefined}
        iconPosition="start"
      >
        {isRequesting
          ? isAr
            ? "جاري تفعيل الأجهزة..."
            : "Activating hardware..."
          : isAr
            ? "تفعيل الكاميرا والمايكروفون الآن"
            : "Enable Camera & Microphone Now"}
      </AppButton>
    </div>
  );
};

export default CameraActivationOverlay;
