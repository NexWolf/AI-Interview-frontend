import React from 'react';
import { MicOff, AlertTriangle, Loader2, SkipForward, Send, Clock } from 'lucide-react';
import { useInterviewStore } from '../../store/useInterviewStore';

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

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-xl space-y-4">
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

      {/* Answer Textarea */}
      <textarea
        value={answerText}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Speak using the microphone or type your detailed response here..."
        rows={5}
        className="w-full p-4 rounded-xl border border-input bg-background/70 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none placeholder:text-muted-foreground"
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
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition cursor-pointer disabled:opacity-50"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span>تخطي السؤال</span>
        </button>

        <div className="flex items-center gap-2">
          {!isListening && (
            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={isSubmittingAnswer || isGeneratingQuestion || !answerText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/25 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingAnswer ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <span>إرسال نصي</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
