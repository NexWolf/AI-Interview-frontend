import React from "react";
import Image from "next/image";
import { Mic, Sparkles } from "lucide-react";

interface AIAvatarStageProps {
  aiPersonaName: string;
  selectedVoice?: string;
  isAISpeaking: boolean;
  isGeneratingQuestion: boolean;
  isListening: boolean;
  isSubmittingAnswer: boolean;
}

/**
 * Circular AI Avatar Stage with concentric audio-reactive wave rings.
 * Focuses candidate attention on a centered circular AI orb with voice animations.
 */
export const AIAvatarStage: React.FC<AIAvatarStageProps> = ({
  aiPersonaName,
  isAISpeaking,
  isGeneratingQuestion,
  isListening,
  isSubmittingAnswer,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center py-2 sm:py-4 select-none">
      {/* Outer Soundwave Pulse Rings (Active when AI is speaking) */}
      <div className="relative flex items-center justify-center">
        {isAISpeaking && (
          <>
            <div className="absolute -inset-8 sm:-inset-10 rounded-full border border-primary/30 animate-ping opacity-40 pointer-events-none duration-1000" />
            <div className="absolute -inset-5 sm:-inset-6 rounded-full border-2 border-primary/50 animate-pulse opacity-60 pointer-events-none duration-700" />
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-primary/30 to-indigo-500/30 blur-xl opacity-70 -z-10 animate-pulse" />
          </>
        )}

        {/* Listening Ring (Active when listening to candidate) */}
        {isListening && (
          <>
            <div className="absolute -inset-4 rounded-full border border-red-500/40 animate-pulse opacity-75 pointer-events-none" />
            <div className="absolute -inset-2 rounded-full bg-red-500/10 blur-lg opacity-60 -z-10" />
          </>
        )}

        {/* Center Circular Avatar */}
        <div
          className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden shadow-2xl transition-all duration-500 z-10 ${
            isAISpeaking
              ? "ring-4 ring-primary shadow-primary/30 scale-105"
              : isListening
              ? "ring-2 ring-red-500/60 shadow-red-500/20"
              : "ring-2 ring-border/60 shadow-black/20"
          }`}
        >
          <Image
            src="/sara_avatar.jpg"
            alt={`AI Interviewer ${aiPersonaName}`}
            fill
            className="object-cover object-center"
            priority
          />
          {/* Subtle dark gradient overlay at base for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Dynamic Status Label beneath circle */}
      <div className="mt-3.5 flex items-center justify-center">
        {isAISpeaking ? (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold animate-pulse shadow-sm shadow-primary/10">
            <span className="flex gap-0.5 items-end h-3">
              <span className="w-0.5 bg-primary h-2 animate-[bounce_0.8s_infinite_100ms]" />
              <span className="w-0.5 bg-primary h-3 animate-[bounce_0.8s_infinite_200ms]" />
              <span className="w-0.5 bg-primary h-1.5 animate-[bounce_0.8s_infinite_300ms]" />
            </span>
            <span>{aiPersonaName} تتحدث الآن...</span>
          </span>
        ) : isGeneratingQuestion ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border/50 text-muted-foreground text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
            <span>{aiPersonaName} تفكر في السؤال القادم...</span>
          </span>
        ) : isListening ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium animate-pulse">
            <Mic className="w-3 h-3 text-red-500 animate-pulse" />
            <span>تستمع لإجابتك...</span>
          </span>
        ) : isSubmittingAnswer ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>جاري تحليل الإجابة...</span>
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground/70 font-medium">
            {aiPersonaName} جاهزة
          </span>
        )}
      </div>
    </div>
  );
};
