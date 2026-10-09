"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, FileText, Loader2, Play } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatDate, statusStyles } from "../../../utils/interviewDetails.utils";

interface InterviewListItemProps {
  interview: any;
}

export const InterviewListItem: React.FC<InterviewListItemProps> = ({
  interview,
}) => {
  const router = useRouter();
  const inProgress = interview.status === "Running" || interview.status === "Paused";

  return (
    <div className="group relative rounded-2xl border border-border/70 bg-card/70 hover:bg-card hover:border-primary/40 p-5 sm:p-6 transition-all duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div className="min-w-0 space-y-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className={cn(
              "text-xs px-2.5 py-0.5 rounded-full border font-semibold",
              statusStyles[interview.status] || statusStyles.Pending
            )}
          >
            {interview.status}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {interview.difficultyLevel}
          </span>
          <span className="text-xs text-muted-foreground">
            • {interview.interviewLanguage}
          </span>
          <span className="text-xs text-muted-foreground">
            • {interview.duration} mins
          </span>
          <span className="text-xs text-muted-foreground">
            • {interview.totalQuestions} Questions
          </span>
        </div>

        <p className="text-base font-semibold tracking-tight text-foreground">
          {interview.skills?.map((s: any) => s.name).join(", ") ||
            "General Technical Evaluation"}
        </p>

        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Created: {formatDate(interview.createdAt)}
        </p>
      </div>

      <div className="shrink-0 flex items-center gap-3">
        {inProgress ? (
          <button
            onClick={() => router.push(`/interview/${interview.id}`)}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Resume Interview
          </button>
        ) : interview.status === "Completed" && !interview.report ? (
          <button
            disabled
            className="inline-flex items-center justify-center gap-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing Report...
          </button>
        ) : (
          <button
            onClick={() =>
              router.push(`/dashboard/interviewDetails?id=${interview.id}`)
            }
            className="inline-flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            View Report
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewListItem;
