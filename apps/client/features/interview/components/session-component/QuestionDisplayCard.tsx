import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';
import { useInterviewStore } from '../../store/useInterviewStore';

interface QuestionDisplayCardProps {
  currentQuestion: any;
  isGeneratingQuestion?: boolean;
  questionLiveText?: string;
  displayedQuestion?: string;
  isTyping?: boolean;
  isCareerDiscovery?: boolean;
  isGenerationLagging?: boolean;
  onRetryQuestion?: () => void;
  onSkipQuestion?: () => void;
  onTypingComplete?: () => void;
}

/**
 * Borderless Cinematic Question Display (Subtitles Style).
 * Displays AI speech/question text with world-class typography and zero box borders.
 */
export const QuestionDisplayCard: React.FC<QuestionDisplayCardProps> = ({
  currentQuestion,
  isGeneratingQuestion,
  questionLiveText,
  displayedQuestion,
  isTyping,
  isCareerDiscovery = false,
  isGenerationLagging,
  onRetryQuestion,
  onSkipQuestion,
  onTypingComplete,
}) => {
  const storeQuestionLiveText = useInterviewStore((s) => s.questionLiveText);
  const storeIsLagging = useInterviewStore((s) => s.isGenerationLagging);
  const storeIsGenerating = useInterviewStore((s) => s.isGeneratingQuestion);

  const activeQuestionLiveText = questionLiveText !== undefined ? questionLiveText : storeQuestionLiveText;
  const activeIsGenerating = isGeneratingQuestion !== undefined ? isGeneratingQuestion : storeIsGenerating;
  const activeIsLagging = isGenerationLagging !== undefined ? isGenerationLagging : storeIsLagging;

  // Typewriter effect (fallback only if displayedQuestion is not supplied by parent flow)
  const typewriter = useTypewriter({
    text: displayedQuestion === undefined ? currentQuestion?.question : null,
    speed: 35,
    enabled: displayedQuestion === undefined,
    onComplete: onTypingComplete,
  });

  const activeDisplayedQuestion = displayedQuestion !== undefined ? displayedQuestion : typewriter.displayedText;
  const activeIsTyping = isTyping !== undefined ? isTyping : typewriter.isTyping;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-2 flex flex-col items-center justify-center text-center">
      {/* Career Discovery Reaction (if present) */}
      {isCareerDiscovery && currentQuestion?.reaction && (
        <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold animate-in fade-in duration-200">
          <span>💬</span>
          <span>{currentQuestion.reaction}</span>
        </div>
      )}

      {/* Main Question Text (Borderless Cinematic Subtitle) */}
      <div className="min-h-[60px] max-h-[140px] sm:max-h-[170px] overflow-y-auto flex items-center justify-center w-full px-2">
        {activeIsGenerating && !activeQuestionLiveText ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse py-2">
            <div className="flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm font-medium">سارة تفكر في السؤال القادم...</span>
            </div>

            {/* Lagging Fallback Pill */}
            {activeIsLagging && (
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs animate-in fade-in">
                <span>تأخر الرد من السيرفر:</span>
                {onRetryQuestion && (
                  <button
                    type="button"
                    onClick={onRetryQuestion}
                    className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold cursor-pointer text-xs transition"
                  >
                    إعادة المحاولة
                  </button>
                )}
                {onSkipQuestion && (
                  <button
                    type="button"
                    onClick={onSkipQuestion}
                    className="px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/50 cursor-pointer text-xs transition"
                  >
                    تخطي
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-base sm:text-lg md:text-xl font-medium text-foreground/95 leading-relaxed tracking-wide select-none">
            {activeIsGenerating ? (
              <>
                {activeQuestionLiveText}
                <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
              </>
            ) : (
              <>
                {activeDisplayedQuestion || "في انتظار بدء المحادثة مع سارة..."}
                {activeIsTyping && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                )}
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};
