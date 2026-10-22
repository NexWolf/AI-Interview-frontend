import React from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface RadialMicCountdownProps {
  countdown: number | null;
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

/**
 * Radial Circular Countdown Mic Button.
 * Renders an animated depleting SVG circular timer ring around the microphone
 * when a candidate silence countdown is active.
 */
export const RadialMicCountdown: React.FC<RadialMicCountdownProps> = ({
  countdown,
  isListening,
  onToggle,
  disabled,
}) => {
  const size = 46;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2; // ~21.25px
  const circumference = 2 * Math.PI * radius; // ~133.5px
  const progress = countdown !== null ? (countdown / 5) * circumference : circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* SVG Radial Countdown Ring */}
      {countdown !== null && (
        <svg
          className="absolute -rotate-90 pointer-events-none drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
          width={size}
          height={size}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-amber-500/20"
          />
          {/* Depleting Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="text-amber-400 transition-all duration-1000 ease-linear"
          />
        </svg>
      )}

      {/* Center Action Button */}
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        title={
          countdown !== null
            ? `جاري الإرسال التلقائي خلال ${countdown} ثوانٍ (انقر للإلغاء أو الإرسال)`
            : isListening
            ? "جاري الاستماع... (انقر للإيقاف)"
            : "الميكروفون مغلق (انقر للتشغيل)"
        }
        className={cn(
          "relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md select-none",
          countdown !== null
            ? "bg-amber-500 text-amber-950 font-black text-sm shadow-amber-500/40 animate-pulse scale-105"
            : isListening
            ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30"
            : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/60"
        )}
      >
        {countdown !== null ? (
          <span className="font-extrabold text-sm">{countdown}</span>
        ) : isListening ? (
          <Mic className="w-4 h-4 animate-pulse text-white" />
        ) : (
          <MicOff className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
