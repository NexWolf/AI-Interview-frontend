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
    <div className="relative bg-background/40 backdrop-blur-2xl border border-border/50 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-6 text-foreground overflow-hidden">
      {/* Subtle glow effect behind the card */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            Question {currentQuestion?.questionOrder || questionList.length || 1}
          </span>
          {currentQuestion?.keyTopics && currentQuestion.keyTopics.length > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              {currentQuestion.keyTopics.map((topic: string, i: number) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border/50">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={replayQuestion}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-primary/10 text-xs font-medium text-primary transition-all duration-200 cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen Again</span>
        </button>
      </div>

      <div className="min-h-[100px] flex items-center relative z-10">
        {isGeneratingQuestion && !questionLiveText ? (
          <div className="flex items-center gap-4 text-muted-foreground py-4 animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-base font-medium">Sara is preparing your next question...</span>
          </div>
        ) : (
          <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed tracking-wide">
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
