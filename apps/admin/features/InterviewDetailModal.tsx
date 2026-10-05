"use client";

import {
  X,
  User,
  Clock,
  Calendar,
  Sparkles,
  Trophy,
  CheckCircle,
  HelpCircle,
  Activity,
  Layers,
} from "lucide-react";
import { AdminInterview } from "@/shared/types/admin";
import { cn } from "@/shared/lib/utils";

interface InterviewDetailModalProps {
  interview: AdminInterview | null;
  onClose: () => void;
}

export function InterviewDetailModal({
  interview,
  onClose,
}: InterviewDetailModalProps) {
  if (!interview) return null;

  const report = interview.reports?.[0];
  const score = report?.overallScore;

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
                  interview.status === "Completed"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : interview.status === "Running"
                    ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                    : "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                )}
              >
                {interview.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Candidate: {interview.user?.firstName ? `${interview.user.firstName} ${interview.user.lastName || ""}` : interview.user?.email || "Candidate"} · {interview.user?.email || ""}
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
                {interview.duration ? `${Math.round(interview.duration / 60)} min` : "—"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border/40 bg-muted/30">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase">Overall Score</div>
              <div
                className={cn(
                  "text-sm font-bold mt-1",
                  score !== undefined && score !== null && score >= 80
                    ? "text-emerald-500"
                    : score !== undefined && score !== null && score >= 60
                    ? "text-amber-500"
                    : "text-rose-500",
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
              interview.interviewQuestions.map((q, idx) => {
                const answer = q.answers?.[0];
                const questionText =
                  q.question?.contentEn ||
                  q.question?.contentAr ||
                  q.aiQuestionTextEn ||
                  q.aiQuestionTextAr ||
                  `Question #${q.questionOrder || idx + 1}`;
                const answerText = answer?.answerText || answer?.candidateAnswer;
                const feedbackText = answer?.feedback || answer?.feedbackEn || answer?.feedbackAr;

                return (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-xl border border-border/60 bg-card space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                          {q.questionOrder || idx + 1}
                        </span>
                        <div className="text-xs font-semibold text-foreground">
                          {questionText}
                        </div>
                      </div>
                      {answer?.score !== undefined && answer?.score !== null && (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0",
                            answer.score >= 80
                              ? "bg-emerald-500/10 text-emerald-500"
                              : answer.score >= 60
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-rose-500/10 text-rose-500",
                          )}
                        >
                          Score: {answer.score}%
                        </span>
                      )}
                    </div>

                    {answerText && (
                      <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border-l-2 border-primary">
                        <span className="font-semibold text-foreground block mb-1">Candidate Answer:</span>
                        {typeof answerText === "object" ? JSON.stringify(answerText, null, 2) : String(answerText)}
                      </div>
                    )}

                    {feedbackText && (
                      <div className="text-[11px] text-muted-foreground bg-muted/20 p-2.5 rounded-lg flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{typeof feedbackText === "object" ? JSON.stringify(feedbackText, null, 2) : String(feedbackText)}</span>
                      </div>
                    )}
                  </div>
                );
              })
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
