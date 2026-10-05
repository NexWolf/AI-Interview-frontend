import React from 'react';
import { Volume2, Loader2 } from 'lucide-react';

interface QuestionDisplayCardProps {
  currentQuestion: any;
  questionList: any[];
  replayQuestion: () => void;
  isGeneratingQuestion: boolean;
  questionLiveText: string;
  displayedQuestion: string;
  isTyping: boolean;
}

export const QuestionDisplayCard: React.FC<QuestionDisplayCardProps> = ({
  currentQuestion,
  questionList,
  replayQuestion,
  isGeneratingQuestion,
  questionLiveText,
  displayedQuestion,
  isTyping,
}) => {
  return (
    <div className="relative bg-card border border-border rounded-2xl p-3.5 sm:p-4 shadow-lg space-y-3 flex-1 flex flex-col justify-between min-h-0 text-foreground overflow-hidden">
      {/* Subtle glow effect behind the card */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            Question {currentQuestion?.questionOrder || questionList.length || 1}
          </span>
          {currentQuestion?.keyTopics && currentQuestion.keyTopics.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5">
              {currentQuestion.keyTopics.map((topic: string, i: number) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/50">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={replayQuestion}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-primary/10 text-xs font-medium text-primary transition-all duration-200 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Listen Again</span>
        </button>
      </div>

      <div className="flex-1 min-h-[90px] max-h-[150px] sm:max-h-[170px] overflow-y-auto flex items-start relative z-10 pr-1">
        {isGeneratingQuestion && !questionLiveText ? (
          <div className="flex items-center gap-3 text-muted-foreground py-2 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Sara is preparing your next question...</span>
          </div>
        ) : (
          <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed tracking-wide">
            {isGeneratingQuestion ? (
              <>
                {questionLiveText}
                <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
              </>
            ) : (
              <>
                {displayedQuestion || "Waiting for Sara to start the conversation..."}
                {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};
