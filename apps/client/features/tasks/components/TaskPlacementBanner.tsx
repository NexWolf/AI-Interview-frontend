"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Compass,
  ArrowRight,
  Target,
  Code2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { AgentProfile, AgentRoadmap } from "../types/task.types";

interface TaskPlacementBannerProps {
  profile: AgentProfile | null;
  roadmap: AgentRoadmap | null;
  onOpenRetake: () => void;
}

export function TaskPlacementBanner({
  profile,
  roadmap,
  onOpenRetake,
}: TaskPlacementBannerProps) {
  const [showReasoning, setShowReasoning] = useState(false);

  // If user has already completed career discovery and profile exists
  if (profile) {
    const confidenceBadge = {
      high: {
        text: "ثقة عالية بالمسار",
        className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      },
      medium: {
        text: "ثقة متوسطة - مسار واعد",
        className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
      },
      low: {
        text: "استكشاف وتجربة أولية",
        className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      },
    }[profile.careerDirectionConfidence?.toLowerCase()] || {
      text: "تم تحديد المسار",
      className: "bg-primary/15 text-primary border-primary/30",
    };

    return (
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-background to-card p-5 sm:p-7 mb-8 shadow-sm transition-all">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-3 max-w-3xl">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
                <Compass className="w-3.5 h-3.5" />
                <span>المسار المهني المستهدف</span>
              </span>

              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${confidenceBadge.className}`}
              >
                {confidenceBadge.text}
              </span>

              {roadmap?.projectName && (
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border">
                  المشروع: {roadmap.projectName}
                </span>
              )}
            </div>

            {/* Career Title & Summary */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {profile.careerDirection}
              </h2>
              {roadmap?.projectDescription && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  {roadmap.projectDescription}
                </p>
              )}
            </div>

            {/* Tech Stack, Strengths & Gaps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Strengths */}
              {profile.strengths?.length > 0 && (
                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>أبرز نقاط قوتك:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.strengths.map((str, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium"
                      >
                        {str}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Gaps */}
              {profile.skillGaps?.length > 0 && (
                <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Target className="w-3.5 h-3.5" />
                    <span>نقاط للتركيز والتطوير:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skillGaps.map((gap, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium"
                      >
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reasoning Toggle */}
            {profile.reasoning?.length > 0 && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowReasoning(!showReasoning)}
                  className="inline-flex items-center gap-1.5 text-xs text-primary/80 hover:text-primary font-semibold transition-colors"
                >
                  <span>تحليل المحاور الذكي لسبب اختيار هذا المسار</span>
                  {showReasoning ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showReasoning && (
                  <div className="mt-2 p-3.5 rounded-xl border border-border bg-card/60 text-xs text-muted-foreground space-y-1.5 animate-in fade-in duration-200">
                    {profile.reasoning.map((r, i) => (
                      <p key={i} className="leading-relaxed">
                        • {r}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Column: Retake Interview */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 w-full lg:w-auto shrink-0 self-stretch lg:self-center">
            <button
              type="button"
              onClick={onOpenRetake}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
              title="إعادة خوض المقابلة الاستكشافية"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة استكشاف المسار</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no analysis exists yet (New student who hasn't taken the career discovery interview)
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-card p-6 sm:p-8 mb-8 shadow-md">
      <div className="max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>الخطوة الأولى: تحديد المسار والمشروع التطبيقي</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          لم تقم بإجراء مقابلة استكشاف المسار بعد 🚀
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          خض مقابلة صوتية استكشافية سريعة (5 أسئلة ذكية) مع مرشدك التقني. سيحدد مستواك، ويكتشف شغفك، ثم يبني لك مشروعاً برمجياً كاملاً مع 3 إلى 5 مهام عملية موجهة خطوة بخطوة.
        </p>

        <div className="pt-2">
          <Link
            href="/interview/setup?mode=student_placement"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <span>ابدأ مقابلة استكشاف المسار الآن (5 أسئلة)</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
