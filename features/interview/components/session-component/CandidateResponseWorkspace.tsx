import React from 'react';
import { MicOff, AlertTriangle, Loader2, SkipForward, Send, Clock } from 'lucide-react';
import { useInterviewStore } from '../../store/useInterviewStore';
import { cn } from '@/shared/lib/utils';

interface CandidateResponseWorkspaceProps {
  isListening: boolean;
  isSubmittingAnswer: boolean;
  toggleListening: () => void;
  answerText: string;
  setAnswer: (val: string) => void;
  submissionError: string | null;
  handleSubmitAnswer: () => void;
  handleSkipQuestion: () => void;
  isGeneratingQuestion: boolean;
}

export const CandidateResponseWorkspace: React.FC<CandidateResponseWorkspaceProps> = ({
  isListening,
  isSubmittingAnswer,
  toggleListening,
  answerText,
  setAnswer,
  submissionError,
  handleSubmitAnswer,
  handleSkipQuestion,
  isGeneratingQuestion,
}) => {
  const autoSubmitCountdown = useInterviewStore(state => state.autoSubmitCountdown);
  const trimmed = answerText.trim();
  const hasText = trimmed.length > 0;
  const wordCount = hasText ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [answerText]);

  return (
    <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-4 shadow-lg space-y-3 flex-1 flex flex-col justify-between min-h-0">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-card-foreground uppercase tracking-wider flex items-center gap-2">
          <span>Your Answer</span>
          {isListening && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Listening - auto-submits when you stop speaking
            </span>
          )}
          {isSubmittingAnswer && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Answer submitted - Sara is thinking...
            </span>
          )}
          {autoSubmitCountdown !== null && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] flex items-center gap-1 animate-pulse ml-2 font-bold shadow-sm shadow-amber-500/20">
              <Clock className="w-3 h-3" />
              Auto-submitting in {autoSubmitCountdown}...
            </span>
          )}
        </label>

        {/* Voice visualizer (automated) */}
        {isListening ? (
          <div
            onClick={toggleListening}
            className="flex items-center gap-1 h-6 px-4 bg-red-500/10 rounded-lg border border-red-500/20 cursor-pointer hover:bg-red-500/20 transition"
            title="جاري الاستماع... (انقر للإيقاف والإرسال يدوياً)"
          >
            <div className="w-1 bg-red-500 h-2/6 animate-[bounce_1s_infinite_0ms]" />
            <div className="w-1 bg-red-500 h-4/6 animate-[bounce_1s_infinite_200ms]" />
            <div className="w-1 bg-red-500 h-full animate-[bounce_1s_infinite_400ms]" />
            <div className="w-1 bg-red-500 h-3/6 animate-[bounce_1s_infinite_600ms]" />
            <div className="w-1 bg-red-500 h-5/6 animate-[bounce_1s_infinite_800ms]" />
            <div className="w-1 bg-red-500 h-2/6 animate-[bounce_1s_infinite_100ms]" />
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleListening}
            disabled={isGeneratingQuestion || isSubmittingAnswer}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border-border cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="الميكروفون مغلق (انقر للتشغيل يدوياً)"
          >
            <MicOff className="w-3.5 h-3.5" />
            <span>الميكروفون مغلق</span>
          </button>
        )}
      </div>

      {/* Answer Textarea with internal scroll and responsive bounded height */}
      <textarea
        ref={textareaRef}
        value={answerText}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Speak using the microphone or type your detailed response here..."
        className="w-full flex-1 min-h-[90px] max-h-[130px] sm:max-h-[145px] overflow-y-auto p-3.5 rounded-xl border border-input bg-background/70 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none placeholder:text-muted-foreground leading-relaxed"
      />

      {/* Submission Error Banner & Retry Button */}
      {submissionError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>تعذر إرسال الإجابة بسبب انقطاع الاتصال. إجابتك محفوظة ويمكنك إعادة المحاولة: ({submissionError})</span>
          </div>
          <button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={isSubmittingAnswer}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-primary-foreground font-bold transition cursor-pointer flex items-center gap-1.5 self-end sm:self-auto shrink-0"
          >
            {isSubmittingAnswer ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>إعادة المحاولة (Retry)</span>
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleSkipQuestion}
          disabled={isGeneratingQuestion || isSubmittingAnswer}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted border border-border/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span>تخطي السؤال</span>
        </button>

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
            onClick={handleSubmitAnswer}
            disabled={isSubmittingAnswer || isGeneratingQuestion || !hasText}
            className={cn(
              "group relative inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 select-none shadow-md",
              hasText && !isSubmittingAnswer && !isGeneratingQuestion
                ? "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-primary-foreground shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 active:scale-[0.98] cursor-pointer"
                : "bg-muted text-muted-foreground border border-border/60 opacity-60 cursor-not-allowed shadow-none"
            )}
            title={
              !hasText
                ? "قم بالتحدث أو كتابة الإجابة أولاً لتتمكن من الإرسال"
                : "إرسال الإجابة فوراً"
            }
          >
            {isSubmittingAnswer ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-foreground" />
                <span>جاري إرسال الإجابة...</span>
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
    </div>
  );
};
