"use client";

import React from "react";
import { Check, Mic, MicOff, AlertCircle } from "lucide-react";
import { AppButton } from "@/shared/components/ui/AppButton";
import { cn } from "@/shared/lib/utils";
import { useMicrophoneTest } from "@/features/interview/hooks/useMicrophoneTest";

export interface PropsMic {
  language: "Arabic" | "English";
  onReady: (value: boolean) => void;
}

/**
 * Microphone Test Component for Interview Preparation.
 * Strictly verifies that the microphone is connected, granted, and UNMUTED.
 * Decoupled presentation: All hardware, AudioContext, and SpeechRecognition
 * logic is cleanly abstracted inside `useMicrophoneTest`.
 */
export const MicorphoneTest: React.FC<PropsMic> = ({
  language: interviewLanguage,
  onReady,
}) => {
  const {
    isAr,
    microphoneReady,
    isAudioMuted,
    microphoneError,
    isListening,
    volume,
    spokenText,
    expectedText,
    startVoiceTest,
    setMicEnabled,
  } = useMicrophoneTest({
    interviewLanguage,
    onReady,
  });

  return (
    <div className="w-full md:w-1/2 p-5 sm:p-6 rounded-2xl border border-border bg-card/60 shadow-sm transition-all flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border">
        <div className="flex items-center gap-2.5">
          {microphoneReady ? (
            <Mic className="h-5 w-5 text-primary" />
          ) : (
            <MicOff className="h-5 w-5 text-rose-500" />
          )}
          <h2 className="font-semibold text-foreground text-base">
            {isAr ? "فحص الميكروفون والصوت" : "Microphone & Audio Check"}
          </h2>
        </div>

        {microphoneReady && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
            {isAr ? "متصل ويعمل" : "Working"}
          </div>
        )}

        {isAudioMuted && !microphoneError && (
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <MicOff className="h-3.5 w-3.5" />
            {isAr ? "الميكروفون مكتوم ✗" : "Muted ✗"}
          </div>
        )}

        {microphoneError && (
          <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            {isAr ? "الميكروفون غير متاح" : "Unavailable"}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="mt-4 rounded-xl bg-muted/30 border border-border p-5 flex-1 flex flex-col justify-between gap-4">
        {/* Anti-Cheating & Security Mute Warning Banner */}
        {isAudioMuted && !microphoneError && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {isAr
                  ? "تنبيه: الميكروفون مغلق حالياً. يلزم تفعيل الصوت لبدء المقابلة."
                  : "Notice: Microphone is muted. Audio input is required to start."}
              </span>
            </div>
            <AppButton
              variant="primary"
              size="sm"
              onClick={() => setMicEnabled(true, "MicrophoneTestBannerUnmute")}
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold border-none shrink-0"
            >
              {isAr ? "تشغيل المايك" : "Unmute"}
            </AppButton>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              {isAr
                ? "يرجى قراءة الجملة التالية لاختبار حساسية الصوت:"
                : "Please read the following sentence to test clarity:"}
            </p>
            <p className="mt-2 text-base font-semibold text-foreground leading-relaxed p-3 rounded-xl bg-card border border-border">
              &quot;{expectedText}&quot;
            </p>
          </div>

          {spokenText && (
            <div className="p-3 rounded-xl bg-card border border-border shadow-sm animate-in fade-in">
              <p className="text-xs font-semibold text-muted-foreground">
                {isAr ? "ما تم التقاطه: " : "YOU SAID: "}
                <span className="text-foreground font-medium">{spokenText}</span>
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Wave Visualizer */}
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <div className="relative flex items-center justify-center w-16 h-16">
            <div
              style={{
                transform: `scale(${1 + Math.min(volume / 30, 1.2)})`,
                opacity: isListening ? Math.min(0.2 + volume / 50, 0.8) : 0,
              }}
              className="absolute inset-0 rounded-full bg-primary transition-all duration-75 ease-out"
            />

            <div
              className={cn(
                "relative z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-colors",
                microphoneReady
                  ? "bg-primary text-primary-foreground shadow-primary/30"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {microphoneReady ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </div>
          </div>

          <span className="text-xs text-muted-foreground">
            {isListening
              ? isAr ? "جاري الاستماع لصوتك الآن..." : "Listening to your voice..."
              : isAr ? "مؤشر حساسية الصوت" : "Voice Level Indicator"}
          </span>
        </div>

        {/* Action Button */}
        {!isListening && (
          <AppButton
            variant="primary"
            size="md"
            className="w-full"
            disabled={!microphoneReady}
            onClick={startVoiceTest}
          >
            {isAr ? "بدء اختبار الصوت" : "Start Voice Test"}
          </AppButton>
        )}
      </div>
    </div>
  );
};

export default MicorphoneTest;