import React from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface LiveReportOverlayProps {
  isFinishing: boolean;
  liveConnected?: boolean;
  reportLiveText?: string;
}

/**
 * Unified Transition Screen displayed when the interview is ended.
 * Replaces the raw terminal box with an elegant, branded full-screen state.
 */
export const LiveReportOverlay: React.FC<LiveReportOverlayProps> = ({
  isFinishing,
}) => {
  if (!isFinishing) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      {/* Glow icon backdrop */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-xl shadow-primary/15 animate-in zoom-in-75 duration-300">
          <Sparkles className="w-10 h-10 animate-pulse text-primary" />
        </div>
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 to-indigo-500/30 blur-xl opacity-60 -z-10 animate-pulse" />
      </div>

      {/* Primary Status Text */}
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
        تم إنهاء المقابلة بنجاح
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mt-2.5 leading-relaxed">
        تم توثيق جميع إجاباتك وإيقاف أجهزة التسجيل بأمان. جاري جلب البيانات وإعداد تقرير التقييم الشامل...
      </p>

      {/* Unified Progress Indicator */}
      <div className="mt-8 flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/90 border border-border/80 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span className="text-xs font-semibold text-foreground">
          جاري معالجة البيانات والتحويل لصفحة التقرير...
        </span>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>تم حفظ الجلسة على السيرفر بأمان</span>
      </div>
    </div>
  );
};
