import React from "react";
import { Volume2, ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface QuestionTopBarProps {
  currentQuestion: any;
  questionList: any[];
  replayQuestion: () => void;
  isAISpeaking?: boolean;
  proctoringStatus?: {
    hasViolation: boolean;
    message?: string;
  };
  isCareerDiscovery?: boolean;
  interviewLanguage?: string;
}

/**
 * Ultra-slim top bar displaying question count, progress dots, topics, proctoring status, and replay audio button.
 * Designed with a minimal height (h-11) to maximize vertical space for the central stage.
 */
export const QuestionTopBar: React.FC<QuestionTopBarProps> = ({
  currentQuestion,
  questionList,
  replayQuestion,
  isAISpeaking,
  proctoringStatus,
  isCareerDiscovery = false,
  interviewLanguage = "Arabic",
}) => {
  const isArabic = interviewLanguage === "Arabic";
  const currentOrder = currentQuestion?.questionOrder || 1;
  const standardQuestionsCount = Math.max(questionList.length, currentOrder);
  const totalQuestions = isCareerDiscovery ? 5 : standardQuestionsCount;

  const questionLabel = isCareerDiscovery
    ? isArabic
      ? `سؤال ${currentOrder} من 5`
      : `Question ${currentOrder} of 5`
    : isArabic
    ? `السؤال ${currentOrder}`
    : `Question ${currentOrder}`;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between gap-3 text-xs border-b border-border/40 bg-background/50 backdrop-blur-md">
      {/* 1. Question Number & Progress Dots */}
      <div className="flex items-center gap-2.5">
        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[11px] uppercase tracking-wider">
          {questionLabel}
        </span>

        {/* Progress Stepper Dots */}
        <div className="hidden sm:flex items-center gap-1.5" title={isCareerDiscovery ? `Question ${currentOrder} of 5` : `Question ${currentOrder}`}>
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const stepNumber = idx + 1;
            const isCompleted = stepNumber < currentOrder;
            const isCurrent = stepNumber === currentOrder;

            return (
              <span
                key={idx}
                className={`transition-all duration-300 rounded-full ${
                  isCurrent
                    ? "w-4 h-1.5 bg-primary animate-pulse shadow-sm shadow-primary/50"
                    : isCompleted
                    ? "w-1.5 h-1.5 bg-emerald-500/80"
                    : "w-1.5 h-1.5 bg-muted-foreground/30"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Key Topics Tags (Center) */}
      <div className="hidden md:flex items-center gap-1.5 overflow-hidden">
        {currentQuestion?.keyTopics && currentQuestion.keyTopics.length > 0 ? (
          currentQuestion.keyTopics.slice(0, 3).map((topic: string, i: number) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground border border-border/40 font-medium"
            >
              {topic}
            </span>
          ))
        ) : (
          <span className="text-[11px] text-muted-foreground/60 font-medium">Technical Evaluation</span>
        )}
      </div>

      {/* 3. Proctoring Status Pill & Replay Audio Button */}
      <div className="flex items-center gap-2">
        {proctoringStatus && (
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all duration-300",
              proctoringStatus.hasViolation
                ? "bg-red-500/15 border border-red-500/40 text-red-400 animate-pulse shadow-sm shadow-red-500/20"
                : "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
            )}
            title={proctoringStatus.hasViolation ? proctoringStatus.message : "المراقبة الذكية موثقة ونشطة"}
          >
            {proctoringStatus.hasViolation ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 animate-bounce" />
                <span className="truncate max-w-[130px] sm:max-w-none">
                  {proctoringStatus.message || "انتبه للشاشة"}
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">الكاميرا موثقة</span>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={replayQuestion}
          disabled={isAISpeaking}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-primary hover:bg-primary/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20 shrink-0"
          title="إعادة الاستماع لصوت السؤال"
        >
          <Volume2 className={`w-3.5 h-3.5 ${isAISpeaking ? "animate-pulse text-primary" : ""}`} />
          <span className="hidden sm:inline">إعادة الاستماع</span>
        </button>
      </div>
    </div>
  );
};

export default QuestionTopBar;
