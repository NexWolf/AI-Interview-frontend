"use client";

import { BarChart3, Briefcase, Trophy } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { toNumber } from "../utils/dashboard.utils";
import type { DashboardStatsProps } from "../types/dashboard.types";

export default function DashboardStats({
  totalInterviews = 0,
  averageScore,
  assessedSkillsCount = 0,
  isAr,
}: DashboardStatsProps) {
  const { t } = useLanguage();

  const formattedScore =
    averageScore !== null && averageScore !== undefined
      ? `${Math.round(toNumber(averageScore))}%`
      : "—";

  const stats = [
    {
      label: t("dashboard.stats.total"),
      value: totalInterviews,
      icon: Briefcase,
      accent: "from-indigo-500 to-violet-500",
    },
    {
      label: t("dashboard.stats.avgScore"),
      value: formattedScore,
      icon: BarChart3,
      accent: "from-emerald-500 to-teal-500",
    },
    {
      label: isAr ? "المهارات المقيمة" : "Assessed Skills",
      value: assessedSkillsCount,
      icon: Trophy,
      accent: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(({ label, value, icon: Icon, accent }) => (
        <div
          key={label}
          className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm hover:border-border transition-colors"
        >
          <div
            className={cn(
              "absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-tr opacity-15 blur-2xl pointer-events-none",
              accent,
            )}
          />
          <div
            className={cn(
              "w-10 h-10 rounded-xl bg-gradient-to-tr flex items-center justify-center text-white mb-3 shadow-md",
              accent,
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}
