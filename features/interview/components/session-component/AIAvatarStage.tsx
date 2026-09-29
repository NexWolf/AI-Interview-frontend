import React from 'react';
import { Cpu, VolumeX, Volume2 } from 'lucide-react';

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
  selectedVoice,
  isAISpeaking,
  currentQuestion,
  isGeneratingQuestion,
  isListening,
  isSubmittingAnswer,
  stopSpeaking,
  replayQuestion,
}) => {
  return (
    <div className="relative bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-between shadow-xl overflow-hidden text-card-foreground">
      <div className="w-full flex items-center justify-between z-10">
        <span className="text-xs text-primary bg-primary/10 border border-primary/30 px-2.5 py-1 rounded-full font-medium">
          AI Interviewer ({aiPersonaName} • {selectedVoice})
        </span>
        <button
          onClick={() => {
            if (isAISpeaking) stopSpeaking();
            else if (currentQuestion) replayQuestion();
          }}
          className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground border border-border transition"
          title={isAISpeaking ? "Mute AI" : "Read Question"}
        >
          {isAISpeaking ? <VolumeX className="w-4 h-4 text-primary" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Dynamic Sound Orb */}
      <div className="relative flex items-center justify-center my-auto">
        <div
          className={`w-28 h-28 rounded-full bg-gradient-to-tr from-primary/50 via-primary to-accent blur-md opacity-60 transition-all duration-300 ${
            isAISpeaking ? "animate-pulse scale-110 opacity-90" : "scale-95 opacity-30"
          }`}
        />
        <div className="w-20 h-20 rounded-full bg-background border-2 border-primary absolute flex items-center justify-center shadow-lg">
          <Cpu className={`w-8 h-8 text-primary transition-transform duration-300 ${isAISpeaking ? "scale-110" : ""}`} />
        </div>
      </div>

      <div className="text-xs text-muted-foreground z-10 text-center">
        {isAISpeaking ? (
          <span className="text-primary flex items-center gap-1.5 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            {aiPersonaName} is speaking...
          </span>
        ) : isGeneratingQuestion ? (
          <span className="text-primary flex items-center gap-1.5 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            {aiPersonaName} is preparing the next question...
          </span>
        ) : isListening ? (
          <span className="text-red-400 flex items-center gap-1.5 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Your turn - speak now. It submits when you stop.
          </span>
        ) : isSubmittingAnswer ? (
          <span className="text-emerald-400 flex items-center gap-1.5 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Analyzing your answer...
          </span>
        ) : (
          <span className="text-muted-foreground flex items-center gap-1.5 justify-center">
            Reviewing your answers...
          </span>
        )}
      </div>
    </div>
  );
};
