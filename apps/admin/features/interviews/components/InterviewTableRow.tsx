"use client";

import { Eye, Clock } from "lucide-react";
import { AdminInterview, cn } from "@repo/shared";
import {
  getInterviewScoreColor,
  getInterviewStatusBadgeClass,
  formatInterviewDuration,
  getCandidateDisplayName,
  getCandidateInitials,
} from "../utils/interviewHelpers";

interface InterviewTableRowProps {
  interview: AdminInterview;
  onViewDetails: (id: string | number) => void;
}

export function InterviewTableRow({ interview, onViewDetails }: InterviewTableRowProps) {
  const score = interview.reports?.[0]?.overallScore;
  const displayName = getCandidateDisplayName(interview.user);
  const initials = getCandidateInitials(interview.user);

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0 text-xs">
            {initials}
          </div>
          <div>
            <div className="font-medium text-foreground">{displayName}</div>
            <div className="text-xs text-muted-foreground">{interview.user?.email}</div>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="text-xs font-medium text-foreground">{interview.interviewLanguage}</div>
        <div className="text-[11px] text-muted-foreground">{interview.difficultyLevel}</div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
          {interview.interviewSkills && interview.interviewSkills.length > 0 ? (
            interview.interviewSkills.map((s, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border/50"
              >
                {s.skill?.nameEn || s.skill?.nameAr}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">General</span>
          )}
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{formatInterviewDuration(interview.duration)}</span>
        </div>
        <div className="text-[10px] text-muted-foreground/80 mt-0.5">
          {new Date(interview.createdAt).toLocaleDateString()}
        </div>
      </td>

      <td className="px-5 py-4">
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5",
            getInterviewStatusBadgeClass(interview.status),
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {interview.status}
        </span>
      </td>

      <td className="px-5 py-4">
        {score !== undefined && score !== null ? (
          <div className={cn("font-bold text-sm", getInterviewScoreColor(score))}>
            {score}%
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>

      <td className="px-5 py-4 text-right">
        <button
          onClick={() => onViewDetails(interview.id)}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          title="View Full Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
