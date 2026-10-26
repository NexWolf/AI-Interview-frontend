import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useInterviewStore } from "../../store/useInterviewStore";
import {
  RadialMicCountdown,
  CareerDiscoveryOptions,
  WorkspaceErrorBanner,
  WorkspaceActionBar,
} from "./workspace";

export interface CandidateResponseWorkspaceProps {
  toggleListening: () => void;
  handleSubmitAnswer: () => void;
  handleSkipQuestion: () => void;
  isCareerDiscovery?: boolean;
  currentVolume?: number;
  // Optional overrides (for testing, storybook, or controlled mode)
  isListening?: boolean;
  isSubmittingAnswer?: boolean;
  answerText?: string;
  setAnswer?: (val: string) => void;
  submissionError?: string | null;
  isGeneratingQuestion?: boolean;
  currentQuestion?: any;
}

/**
 * CandidateResponseWorkspace
 * Clean orchestrator component adhering to Single Responsibility and Separation of Concerns.
 * Consumes Zustand selectors directly for optimal rendering performance (preventing parent re-renders).
 * Sub-responsibilities are delegated to dedicated workspace components:
 * - RadialMicCountdown: Animated SVG countdown around the mic
 * - CareerDiscoveryOptions: Multiple-choice selector with answer prefixing
 * - WorkspaceErrorBanner: Failure recovery & retry banner
 * - WorkspaceActionBar: Skip, Word counter, and Submit button
 */
export const CandidateResponseWorkspace: React.FC<CandidateResponseWorkspaceProps> = ({
  toggleListening,
  handleSubmitAnswer,
  handleSkipQuestion,
  isCareerDiscovery = false,
  currentVolume = 0,
  isListening: propIsListening,
  isSubmittingAnswer: propIsSubmittingAnswer,
  answerText: propAnswerText,
  setAnswer: propSetAnswer,
  submissionError: propSubmissionError,
  isGeneratingQuestion: propIsGeneratingQuestion,
  currentQuestion: propCurrentQuestion,
}) => {
  // Fine-grained Zustand selectors to guarantee surgical re-renders
  const storeAnswerText = useInterviewStore((state) => state.answerText);
  const storeSetAnswerText = useInterviewStore((state) => state.setAnswerText);
  const storeIsListening = useInterviewStore((state) => state.isListening);
  const storeIsSubmittingAnswer = useInterviewStore((state) => state.isSubmittingAnswer);
  const storeIsGeneratingQuestion = useInterviewStore((state) => state.isGeneratingQuestion);
  const storeSubmissionError = useInterviewStore((state) => state.submissionError);
  const autoSubmitCountdown = useInterviewStore((state) => state.autoSubmitCountdown);
  const storeCurrentQuestion = useInterviewStore((state) => state.currentQuestion);

  // Allow optional props to override store (useful for unit tests / previews)
  const answerText = propAnswerText !== undefined ? propAnswerText : storeAnswerText;
  const setAnswer = propSetAnswer || storeSetAnswerText;
  const isListening = propIsListening !== undefined ? propIsListening : storeIsListening;
  const isSubmittingAnswer = propIsSubmittingAnswer !== undefined ? propIsSubmittingAnswer : storeIsSubmittingAnswer;
  const isGeneratingQuestion = propIsGeneratingQuestion !== undefined ? propIsGeneratingQuestion : storeIsGeneratingQuestion;
  const submissionError = propSubmissionError !== undefined ? propSubmissionError : storeSubmissionError;
  const currentQuestion = propCurrentQuestion !== undefined ? propCurrentQuestion : storeCurrentQuestion;

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const trimmed = answerText.trim();
  const hasText = trimmed.length > 0;
  const wordCount = hasText ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  // Auto-scroll textarea as live speech transcription streams in
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [answerText]);

  return (
    <div className="bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl p-3 sm:p-4 shadow-xl space-y-3 w-full flex flex-col justify-between min-h-0">
      {/* Top Status Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-card-foreground uppercase tracking-wider flex items-center gap-2">
          <span>إجابتك (Your Answer)</span>
          {isListening && autoSubmitCountdown === null && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              المايك يستمع لصوتك
            </span>
          )}
          {isSubmittingAnswer && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              تم إرسال الإجابة..
            </span>
          )}
          {autoSubmitCountdown !== null && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-400 text-xs flex items-center gap-1.5 animate-pulse font-bold shadow-sm shadow-amber-500/20">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>إرسال تلقائي خلال {autoSubmitCountdown} ثوانٍ...</span>
            </span>
          )}
        </label>

        {/* Radial Countdown Mic & Voice Activity Waves */}
        <div className="flex items-center gap-3">
          {isListening && autoSubmitCountdown === null && (
            <div
              className="hidden sm:flex items-center gap-1 h-6 px-3 bg-red-500/10 rounded-lg border border-red-500/20"
              title="موجات التقاط الصوت الحية"
            >
              <div className="w-0.5 bg-red-500 h-2/6 animate-[bounce_0.8s_infinite_0ms]" />
              <div className="w-0.5 bg-red-500 h-4/6 animate-[bounce_0.8s_infinite_150ms]" />
              <div className="w-0.5 bg-red-500 h-full animate-[bounce_0.8s_infinite_300ms]" />
              <div className="w-0.5 bg-red-500 h-3/6 animate-[bounce_0.8s_infinite_450ms]" />
              <div className="w-0.5 bg-red-500 h-5/6 animate-[bounce_0.8s_infinite_600ms]" />
            </div>
          )}

          {/* Solution 2: Circular Mic with SVG Radial Countdown */}
          <RadialMicCountdown
            countdown={autoSubmitCountdown}
            isListening={isListening}
            onToggle={toggleListening}
            disabled={isGeneratingQuestion || isSubmittingAnswer}
          />
        </div>
      </div>

      {/* Career Discovery Options (if present) */}
      {isCareerDiscovery && currentQuestion?.options && currentQuestion.options.length > 0 && (
        <CareerDiscoveryOptions
          options={currentQuestion.options}
          answerText={answerText}
          onSelectOption={setAnswer}
          disabled={isSubmittingAnswer || isGeneratingQuestion}
          freeTextPrompt={currentQuestion.freeTextPrompt}
        />
      )}

      {/* Audio Visualizer for Standard Interview (or Textarea for Career Discovery) */}
      {!isCareerDiscovery ? (
        <div className="w-full min-h-[82px] py-3.5 px-4 rounded-xl border border-primary/20 bg-background/50 backdrop-blur flex flex-col justify-center items-center gap-2.5 transition-all">
          <div className="flex items-center gap-2 text-center">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                autoSubmitCountdown !== null
                  ? "bg-amber-400 animate-ping"
                  : isListening
                  ? "bg-red-500 animate-pulse"
                  : "bg-muted-foreground/40"
              )}
            />
            <span className="text-xs sm:text-sm font-medium text-foreground">
              {autoSubmitCountdown !== null
                ? `تم رصد التوقف عن الكلام — سيتم إرسال صوتك تلقائياً خلال ${autoSubmitCountdown} ثوانٍ`
                : isListening
                ? "جاري تسجيل صوتك بجودة عالية... تحدث بإجابتك بوضوح"
                : "الميكروفون جاهز — اضغط على زر المايك للتسجيل أو انتظر السؤال"}
            </span>
          </div>

          {/* Dynamic Voice Activity Waves */}
          {isListening && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center gap-1.5 h-6">
                {[35, 65, 100, 50, 90, 40, 80, 55, 95, 60, 30, 75].map((h, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1 rounded-full transition-all duration-150",
                      autoSubmitCountdown !== null
                        ? "bg-amber-400/70 h-2"
                        : "bg-gradient-to-t from-primary/70 to-primary animate-[bounce_0.8s_ease-in-out_infinite]"
                    )}
                    style={{
                      height: autoSubmitCountdown !== null ? "25%" : `${Math.max(20, Math.min(100, currentVolume ? currentVolume * 1.5 : h))}%`,
                      animationDelay: `${i * 65}ms`,
                    }}
                  />
                ))}
              </div>
              {currentVolume > 0 && autoSubmitCountdown === null && (
                <span className="text-[10px] text-muted-foreground/60 font-mono select-none">
                  التقاط الصوت: {currentVolume}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={answerText}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={currentQuestion?.freeTextPrompt || "تحدث بالميكروفون أو اكتب تفاصيل إضافية هنا..."}
          dir="auto"
          style={{ unicodeBidi: "plaintext" }}
          className="w-full min-h-[80px] max-h-[110px] sm:max-h-[125px] overflow-y-auto p-3 rounded-xl border border-input bg-background/60 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none placeholder:text-muted-foreground/70 leading-relaxed"
        />
      )}

      {/* Submission Error Banner & Retry Button */}
      <WorkspaceErrorBanner
        error={submissionError}
        onRetry={handleSubmitAnswer}
        isSubmitting={isSubmittingAnswer}
      />

      {/* Action Bar */}
      <WorkspaceActionBar
        onSkip={handleSkipQuestion}
        onSubmit={handleSubmitAnswer}
        isSubmitting={isSubmittingAnswer}
        isGenerating={isGeneratingQuestion}
        hasText={hasText}
        wordCount={wordCount}
        isListening={isListening}
      />
    </div>
  );
};
