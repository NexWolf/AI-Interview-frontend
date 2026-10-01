import React from 'react';
import Image from 'next/image';

interface AIAvatarStageProps {
  aiPersonaName: string;
  selectedVoice: string;
  isAISpeaking: boolean;
  currentQuestion: any;
  isGeneratingQuestion: boolean;
  isListening: boolean;
  isSubmittingAnswer: boolean;
  stopSpeaking: () => void;
  replayQuestion: () => void;
}

export const AIAvatarStage: React.FC<AIAvatarStageProps> = ({
  aiPersonaName,
  isAISpeaking,
  isGeneratingQuestion,
  isListening,
  isSubmittingAnswer,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-end w-full h-full min-h-[320px] overflow-hidden rounded-[2rem] group">
      
      {/* Background Full-bleed Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/sara_avatar.jpg" 
          alt={`AI Interviewer ${aiPersonaName}`} 
          fill 
          className="object-cover transition-transform duration-[20s] group-hover:scale-105"
          priority
        />
        {/* Cinematic dark gradients for text readability and depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        
        {/* Dynamic color overlay based on status */}
        <div className={`absolute inset-0 mix-blend-overlay transition-colors duration-1000 ${
          isAISpeaking ? "bg-primary/40" : isListening ? "bg-red-500/10" : "bg-transparent"
        }`} />
      </div>

      {/* Speaking Pulse Overlay (Edges) */}
      {isAISpeaking && (
        <div className="absolute inset-0 z-10 border-[4px] border-primary/60 rounded-[2rem] shadow-[inset_0_0_50px_rgba(var(--primary),0.3)] animate-pulse pointer-events-none" />
      )}
      
      {/* Listening Border Overlay */}
      {isListening && (
        <div className="absolute inset-0 z-10 border-[2px] border-red-500/50 rounded-[2rem] pointer-events-none" />
      )}

      {/* Minimal Status Text (Bottom of the image) */}
      <div className="relative z-20 pb-4 text-sm sm:text-base font-semibold tracking-wide w-full text-center">
        {isAISpeaking ? (
          <span className="text-white flex items-center gap-2 justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            {aiPersonaName} is speaking...
          </span>
        ) : isGeneratingQuestion ? (
          <span className="text-white/80 flex items-center gap-2 justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-pulse" />
            {aiPersonaName} is preparing...
          </span>
        ) : isListening ? (
          <span className="text-red-400 flex items-center gap-2 justify-center font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            Listening to you...
          </span>
        ) : isSubmittingAnswer ? (
          <span className="text-emerald-400 flex items-center gap-2 justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Analyzing response...
          </span>
        ) : (
          <span className="text-white/60 flex items-center gap-2 justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Ready
          </span>
        )}
      </div>
    </div>
  );
};
