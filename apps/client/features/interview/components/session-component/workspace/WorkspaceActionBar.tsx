import React from "react";
import { SkipForward, Send, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface WorkspaceActionBarProps {
  onSkip: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isGenerating: boolean;
  hasText: boolean;
  wordCount: number;
  isListening?: boolean;
}

/**
 * Bottom action bar containing Skip, Word Count, and Submit Answer buttons.
 */
export const WorkspaceActionBar: React.FC<WorkspaceActionBarProps> = ({
  onSkip,
  onSubmit,
  isSubmitting,
  isGenerating,
  hasText,
  wordCount,
  isListening = false,
}) => {
  const canSubmit = hasText || isListening;
  const isSubmitDisabled = isSubmitting || isGenerating || !canSubmit;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      {/* Skip Question Button */}
      <button
        type="button"
        onClick={onSkip}
        disabled={isGenerating || isSubmitting}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted border border-border/70 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        <SkipForward className="w-3.5 h-3.5" />
        <span>تخطي السؤال</span>
      </button>

      {/* Word Count & Submit Button */}
      <div className="flex items-center gap-3">
        {hasText && (
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground px-2.5 py-1 rounded-lg bg-muted/60 border border-border/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {wordCount} {wordCount === 1 ? "كلمة" : "كلمات"}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className={cn(
            "group relative inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 select-none shadow-md",
            canSubmit && !isSubmitting && !isGenerating
              ? "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-primary-foreground shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 active:scale-[0.98] cursor-pointer"
              : "bg-muted text-muted-foreground border border-border/60 opacity-60 cursor-not-allowed shadow-none"
          )}
          title={
            !canSubmit
              ? "قم بالتحدث أو كتابة الإجابة أولاً لتتمكن من الإرسال"
              : "إرسال الإجابة فوراً"
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-foreground" />
              <span>جاري الإرسال...</span>
            </>
          ) : (
            <>
              <span>إرسال الإجابة</span>
              <Send className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
