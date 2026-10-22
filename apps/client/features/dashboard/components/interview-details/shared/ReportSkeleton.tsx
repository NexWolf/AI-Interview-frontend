import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted/60 relative overflow-hidden after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-foreground/5 after:to-transparent",
        className
      )}
    />
  );
}

export interface ReportSkeletonProps {
  isGenerating?: boolean;
  title?: string;
  subtitle?: string;
}

/**
 * Modern, branded Report Loading Skeleton.
 * Displayed seamlessly upon exiting the interview while the AI generates and evaluates the final report.
 */
export const ReportSkeleton: React.FC<ReportSkeletonProps> = ({
  isGenerating = true,
  title = "جاري تحليل إجاباتك وإنشاء التقرير المدعوم بالذكاء الاصطناعي...",
  subtitle = "الرجاء الانتظار، نقوم بفحص مهاراتك الفنية وبناء التقرير التقييمي وخطة التحسين.",
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Branded AI Analysis Progress Card (if generating) */}
      {isGenerating && (
        <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-background to-indigo-500/10 p-5 sm:p-6 shadow-lg shadow-primary/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-sm">
                <Sparkles className="w-6 h-6 animate-pulse text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
                  <span>{title}</span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                </h3>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/80 border border-border/80 shadow-sm shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span className="text-xs font-semibold text-foreground">
                معالجة ذكية مستمرة...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Top Navigation Breadcrumb Skeleton */}
      <Skeleton className="h-4 w-40" />

      {/* 3. Main Header Overview Skeleton */}
      <div className="rounded-2xl border border-border/70 bg-card/70 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* 4 Score Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 pt-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2"
            >
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-14" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Detailed Dimension Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-40 w-40 rounded-full mx-auto" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-3">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSkeleton;
