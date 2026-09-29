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
    <div className="bg-card border border-border rounded-2xl p-5 shadow-xl space-y-4 text-card-foreground">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
            Question #{currentQuestion?.questionOrder || questionList.length || 1}
          </span>
          {currentQuestion?.keyTopics && currentQuestion.keyTopics.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              {currentQuestion.keyTopics.map((topic: string, i: number) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={replayQuestion}
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Listen Again</span>
        </button>
      </div>

      <div className="min-h-[60px] flex items-center">
        {isGeneratingQuestion && !questionLiveText ? (
          <div className="flex items-center gap-3 text-muted-foreground py-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm">Sara is preparing the next question for you...</span>
          </div>
        ) : (
          <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
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
