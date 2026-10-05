"use client";

import Link from "next/link";
import { Sparkles, Trophy, Target, ArrowRight, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { useDashboard } from "@/shared/hook/useDashboard";
import { cn } from "@/shared/lib/utils";
import { SkillsApiData } from "../types/profile.types";

interface ProfileAIReadinessCardProps {
  skills?: SkillsApiData[];
  editable?: boolean;
}

export function ProfileAIReadinessCard({ skills, editable = false }: ProfileAIReadinessCardProps) {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const { data: dashboard } = useDashboard();

  // Calculate readiness score
  const totalInterviews = dashboard?.totalInterviews ?? 0;
  const avgScoreRaw = dashboard?.averageScore;
  const avgScore = avgScoreRaw !== null && avgScoreRaw !== undefined ? Math.round(Number(avgScoreRaw)) : null;

  // Skills assessed by AI
  const aiSkills = (skills || []).filter((s) => s.assessedByAi && s.aiAssessmentScore !== null);
  const assessedSkillsCount = aiSkills.length > 0 ? aiSkills.length : (dashboard?.skillProgress?.filter((s) => s.assessedByAi).length ?? 0);

  // Compute readiness percentage
  let readinessScore = 0;
  if (avgScore !== null && avgScore > 0) {
    readinessScore = avgScore;
  } else if (aiSkills.length > 0) {
    const sum = aiSkills.reduce((acc, curr) => acc + Number(curr.aiAssessmentScore || 0), 0);
    readinessScore = Math.round(sum / aiSkills.length);
  }

  // Determine readiness level
  let statusBadge = {
    label: t("profile.readiness.status.starter"),
    color: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    ringColor: "stroke-amber-500",
  };

  if (readinessScore >= 80) {
    statusBadge = {
      label: t("profile.readiness.status.ready"),
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
      ringColor: "stroke-emerald-500",
    };
  } else if (readinessScore >= 60) {
    statusBadge = {
      label: t("profile.readiness.status.practicing"),
      color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      ringColor: "stroke-indigo-500",
    };
  }

  // Top strengths (highest scores)
  const strengths = [...aiSkills]
    .sort((a, b) => Number(b.aiAssessmentScore || 0) - Number(a.aiAssessmentScore || 0))
    .slice(0, 3);

  // Focus areas (lowest scores or beginner)
  const focusAreas = [...aiSkills]
    .sort((a, b) => Number(a.aiAssessmentScore || 0) - Number(b.aiAssessmentScore || 0))
    .filter((s) => Number(s.aiAssessmentScore || 0) < 70)
    .slice(0, 3);

  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 shadow-sm">
      {/* Background ambient decorative glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left / Main info */}
        <div className="flex items-start gap-4">
          {/* Circular Score Gauge */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="38"
                className="stroke-muted/40"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                className={cn("transition-all duration-1000 ease-out", statusBadge.ringColor)}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={readinessScore > 0 ? strokeDashoffset : circumference}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold tracking-tight">
                {readinessScore > 0 ? `${readinessScore}%` : "—"}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase">
                {isAr ? "الجاهزية" : "Ready"}
              </span>
            </div>
          </div>

          {/* Heading & description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {t("profile.readiness.title")}
              </h2>
              <span className={cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full border", statusBadge.color)}>
                {statusBadge.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-lg">
              {t("profile.readiness.desc")}
            </p>

            {/* Quick stats pills */}
            <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold text-foreground">{totalInterviews}</span>
                <span>{t("profile.readiness.totalInterviews")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold text-foreground">{assessedSkillsCount}</span>
                <span>{t("profile.readiness.assessedSkills")}</span>
              </div>
              {avgScore !== null && (
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-semibold text-foreground">{avgScore}%</span>
                  <span>{t("profile.readiness.avgScore")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right CTA */}
        {editable && (
          <div className="shrink-0 w-full sm:w-auto">
            <Link
              href="/interview/setup"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              <span>{t("profile.readiness.practiceCta")}</span>
              <ArrowRight className={cn("w-4 h-4", isAr && "rotate-180")} />
            </Link>
          </div>
        )}
      </div>

      {/* Strengths and Focus areas pills */}
      {(strengths.length > 0 || focusAreas.length > 0) && (
        <div className="mt-5 pt-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {strengths.length > 0 && (
            <div className="space-y-1.5">
              <p className="font-semibold text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t("profile.readiness.strengths")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {strengths.map((s) => (
                  <span
                    key={s.skillId}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] opacity-80">({Math.round(Number(s.aiAssessmentScore))}%)</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {focusAreas.length > 0 && (
            <div className="space-y-1.5">
              <p className="font-semibold text-amber-500 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {t("profile.readiness.focusAreas")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {focusAreas.map((s) => (
                  <span
                    key={s.skillId}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] opacity-80">({Math.round(Number(s.aiAssessmentScore))}%)</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileAIReadinessCard;
