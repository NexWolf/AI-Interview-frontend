"use client";

import React from "react";
import {
  CheckCircle2,
  FileText,
  Lightbulb,
  Mic,
  SkipForward,
  Sparkles,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { scoreColor } from "../../../utils/interviewDetails.utils";

export interface EvaluatedQuestion {
  id?: string | number;
  questionOrder?: number;
  questionText: string;
  answerText?: string | null;
  modelAnswer?: string | null;
  isAnswered?: boolean;
  isSkipped?: boolean;
  score?: number | null;
  feedback?: string;
  improvement?: string;
}

interface ReportQuestionsAnalysisProps {
  questions: EvaluatedQuestion[];
}

export const ReportQuestionsAnalysis: React.FC<ReportQuestionsAnalysisProps> = ({
  questions,
}) => {
  if (!questions || questions.length === 0) return null;

  const answeredCount = questions.filter((q) => q.isAnswered || q.answerText).length;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-bold text-base sm:text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          Question-by-Question Analysis & Responses
        </h2>
        <span className="text-xs text-muted-foreground font-medium">
          {answeredCount} of {questions.length} Answered
        </span>
      </div>

      <div className="space-y-4">
        {questions.map((item, idx) => {
          const hasAnswer = Boolean(item.answerText);
          const isSkipped = item.isSkipped || (!hasAnswer && item.score === 0);
          const score = item.score;

          return (
            <div
              key={item.id ?? idx}
              className="rounded-2xl border border-border/60 bg-background/50 p-5 sm:p-6 space-y-4 transition-all hover:border-primary/30"
            >
              {/* Question Header & Score */}
              <div className="flex items-center justify-between gap-3 flex-wrap border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                    Question {item.questionOrder ?? idx + 1}
                  </span>
                  {isSkipped && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[11px] font-medium flex items-center gap-1">
                      <SkipForward className="w-3 h-3" />
                      Skipped
                    </span>
                  )}
                </div>

                {score !== null && score !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-medium">
                      Evaluation:
                    </span>
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-md border",
                        scoreColor(score)
                      )}
                    >
                      {score > 0 ? `${Math.round(score)}%` : "0%"}
                    </span>
                  </div>
                )}
              </div>

              {/* AI Question Text */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Question
                </span>
                <p className="text-sm sm:text-base font-medium leading-relaxed text-foreground">
                  {item.questionText}
                </p>
              </div>

              {/* Candidate Answer */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-indigo-400" />
                  Your Answer
                </span>
                {hasAnswer ? (
                  <div className="rounded-xl bg-muted/40 border border-border/60 p-4 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {item.answerText}
                  </div>
                ) : (
                  <div className="rounded-xl bg-muted/20 border border-dashed border-border/60 p-3.5 text-xs text-muted-foreground italic flex items-center gap-2">
                    <SkipForward className="w-3.5 h-3.5 text-muted-foreground/70" />
                    This question was skipped without an answer.
                  </div>
                )}
              </div>

              {/* Model / Correct Answer (الإجابة النموذجية الصحيحة) */}
              {item.modelAnswer && (
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-1.5 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Model Answer (الإجابة النموذجية)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                      Expected Response
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {item.modelAnswer}
                  </p>
                </div>
              )}

              {/* AI Evaluation & Feedback */}
              {item.feedback && (
                <div className="rounded-xl bg-primary/5 border border-primary/15 p-4 space-y-1.5">
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    AI Feedback & Assessment
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-foreground/85">
                    {item.feedback}
                  </p>
                </div>
              )}

              {/* Improvement Suggestion */}
              {item.improvement && (
                <div className="text-xs text-muted-foreground flex items-start gap-2 pt-2 border-t border-border/30">
                  <span className="font-semibold text-foreground shrink-0">
                    Recommendation:
                  </span>
                  <span className="text-foreground/80 leading-relaxed">
                    {item.improvement}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportQuestionsAnalysis;
