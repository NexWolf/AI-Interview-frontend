"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Play, Plus } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatDate } from "../../../utils/interviewDetails.utils";

interface ReportHeaderProps {
  interview: any;
  answeredCount: number;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  interview,
  answeredCount,
}) => {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/interviewDetails"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Interviews
      </Link>

      <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Interview Report
              </h1>
              <span className="text-xs text-muted-foreground">#{interview.id}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">
              {interview.difficultyLevel} • {interview.interviewLanguage} •{" "}
              {interview.duration} min • {formatDate(interview.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border font-semibold w-fit",
                interview.status === "Completed"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                  : interview.status === "Running"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              )}
            >
              {interview.status}
            </span>

            {(interview.status === "Running" || interview.status === "Paused") && (
              <Link
                href={`/interview/${interview.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
              >
                <Play className="w-3 h-3" />
                Resume Interview
              </Link>
            )}

            {interview.status === "Completed" && (
              <Link
                href="/interview/setup"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-3 h-3" />
                New Interview
              </Link>
            )}
          </div>
        </div>

        {interview.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {interview.skills.map((skill: any) => (
              <span
                key={skill.id}
                className="px-3 py-1 rounded-lg bg-muted/60 border border-border text-xs font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {interview.totalQuestions > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {[
              { label: "Questions", value: interview.totalQuestions },
              { label: "Answered", value: answeredCount },
              { label: "Skipped", value: interview.skippedQuestions },
              { label: "Duration", value: `${interview.duration} min` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-background/60 border border-border/50 p-3 text-center"
              >
                <p className="text-lg font-bold">{item.value}</p>
                <p className="text-[11px] text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportHeader;
