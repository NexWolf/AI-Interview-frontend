import React from "react";
import { CheckCircle2, X } from "lucide-react";

export const CandidateCompletedState: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4 shadow-sm animate-in zoom-in-75 duration-300">
        <CheckCircle2 className="w-9 h-9" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
        تم الانتهاء من المقابلة بنجاح
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mt-2 leading-relaxed">
        شكراً لك! تم استلام جميع إجاباتك وإرسال تقرير المقابلة مباشرة إلى فريق التوظيف. يمكنك إغلاق هذه الصفحة بأمان الآن.
      </p>
      <p className="text-xs text-muted-foreground/80 max-w-md mt-1">
        Thank you! Your interview has been submitted directly to the hiring team. You can safely close this page.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => window.close()}
          className="px-5 py-2.5 rounded-xl border border-border/80 hover:bg-muted text-xs font-semibold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
        >
          <X className="w-3.5 h-3.5" />
          <span>إغلاق الصفحة (Close Tab)</span>
        </button>
      </div>
    </div>
  );
};
