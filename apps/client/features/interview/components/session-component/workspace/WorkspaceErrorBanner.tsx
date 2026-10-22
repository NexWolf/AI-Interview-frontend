import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface WorkspaceErrorBannerProps {
  error: string | null;
  onRetry: () => void;
  isSubmitting: boolean;
}

/**
 * Banner shown when answer submission fails due to network or server issues.
 * Displays error details and an immediate retry action.
 */
export const WorkspaceErrorBanner: React.FC<WorkspaceErrorBannerProps> = ({
  error,
  onRetry,
  isSubmitting,
}) => {
  if (!error) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs animate-in fade-in">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>تعذر إرسال الإجابة بسبب انقطاع الاتصال. إجابتك محفوظة: ({error})</span>
      </div>
      <button
        type="button"
        onClick={onRetry}
        disabled={isSubmitting}
        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-primary-foreground font-bold transition cursor-pointer flex items-center gap-1.5 self-end sm:self-auto shrink-0 text-xs active:scale-95 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
        <span>إعادة المحاولة</span>
      </button>
    </div>
  );
};
