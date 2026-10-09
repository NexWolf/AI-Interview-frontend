"use client";

import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { toNumber } from "../utils/dashboard.utils";
import type { DashboardSkillProgressProps } from "../types/dashboard.types";

export default function DashboardSkillProgress({
  skillProgress,
  isAr,
}: DashboardSkillProgressProps) {
  const hasSkills = Boolean(skillProgress && skillProgress.length > 0);

  return (
    <div className="lg:col-span-1 rounded-2xl border border-border/70 bg-card/70 p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm">{isAr ? "تطور المهارات" : "Skill Progress"}</h2>
        <Link
          href="/dashboard/profile"
          className="text-xs text-primary hover:underline font-medium"
        >
          {isAr ? "إدارة" : "Manage"}
        </Link>
      </div>

      {!hasSkills ? (
        <p className="text-xs text-muted-foreground italic py-4">
          {isAr
            ? "لم يتم تقييم أي مهارات بعد. أكمل مقابلة بالذكاء الاصطناعي لبناء ملف مهاراتك."
            : "No assessed skills yet. Complete an AI interview to build your skill profile."}
        </p>
      ) : (
        <div className="space-y-4">
          {skillProgress!.map((skill) => {
            const score = toNumber(skill.score);
            return (
              <div key={skill.skillId}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium truncate max-w-[160px]">
                    {skill.name}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {skill.score !== null && skill.score !== undefined
                      ? `${Math.round(score)}%`
                      : skill.proficiencyLevel || "Assessed"}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      score >= 75
                        ? "bg-emerald-500"
                        : score >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500",
                    )}
                    style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
