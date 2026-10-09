"use client";

import { X, Trophy } from "lucide-react";
import { cn } from "@repo/shared";
import { InterviewDetailModalProps } from "../types/interviews.types";
import {
  getInterviewScoreColor,
  getInterviewStatusBadgeClass,
  formatInterviewDuration,
  getCandidateDisplayName,
} from "../utils/interviewHelpers";
import { InterviewQuestionItem } from "./InterviewQuestionItem";

export function InterviewDetailModal({
  interview,
  onClose,
}: InterviewDetailModalProps) {
  if (!interview) return null;

  const report = interview.reports?.[0];
  const score = report?.overallScore;
  const candidateName = getCandidateDisplayName(interview.user);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/60 bg-muted/20">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">
                Interview Session #{interview.id}
              </h3>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                  getInterviewStatusBadgeClass(interview.status),
                )}
              >
                {interview.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Candidate: {candidateName} · {interview.user?.email || ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-border/40 bg-muted/30">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase">Language</div>
              <div className="text-sm font-bold text-foreground mt-1">{interview.interviewLanguage}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-border/40 bg-muted/30">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase">Difficulty</div>
              <div className="text-sm font-bold text-foreground mt-1">{interview.difficultyLevel}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-border/40 bg-muted/30">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase">Duration</div>
              <div className="text-sm font-bold text-foreground mt-1">
                {formatInterviewDuration(interview.duration)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border/40 bg-muted/30">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase">Overall Score</div>
              <div
                className={cn(
                  "text-sm font-bold mt-1",
                  getInterviewScoreColor(score),
                )}
              >
                {score !== undefined && score !== null ? `${score}%` : "Pending"}
              </div>
            </div>
          </div>

          {/* Skills Assessed */}
          {interview.interviewSkills && interview.interviewSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Target Competencies
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {interview.interviewSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {s.skill?.nameEn} {s.skill?.nameAr ? `(${s.skill?.nameAr})` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evaluation Report Summary */}
          {report?.summaryEn && (
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2">
              <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" /> Evaluation Summary
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{report.summaryEn}</p>
            </div>
          )}

          {/* Questions & Candidate Answers */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Questions & Responses ({interview.interviewQuestions?.length || 0})
            </h4>

            {!interview.interviewQuestions || interview.interviewQuestions.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl">
                No question responses recorded for this interview session.
              </div>
            ) : (
              interview.interviewQuestions.map((q, idx) => (
                <InterviewQuestionItem
                  key={q.id || idx}
                  question={q}
                  index={idx}
                />
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border/60 bg-muted/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
