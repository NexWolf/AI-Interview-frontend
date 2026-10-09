"use client";

import { Sparkles } from "lucide-react";
import { AdminInterview, cn } from "@repo/shared";
import { getInterviewScoreColor } from "../utils/interviewHelpers";

type InterviewQuestion = NonNullable<AdminInterview["interviewQuestions"]>[number];

interface InterviewQuestionItemProps {
  question: InterviewQuestion;
  index: number;
}

export function InterviewQuestionItem({ question: q, index }: InterviewQuestionItemProps) {
  const answer = q.answers?.[0];
  const questionText =
    q.question?.contentEn ||
    q.question?.contentAr ||
    q.aiQuestionTextEn ||
    q.aiQuestionTextAr ||
    `Question #${q.questionOrder || index + 1}`;
  const answerText = answer?.answerText || answer?.candidateAnswer;
  const feedbackText = answer?.feedback || answer?.feedbackEn || answer?.feedbackAr;

  return (
    <div className="p-4 rounded-xl border border-border/60 bg-card space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
            {q.questionOrder || index + 1}
          </span>
          <div className="text-xs font-semibold text-foreground">{questionText}</div>
        </div>
        {answer?.score !== undefined && answer?.score !== null && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0",
              getInterviewScoreColor(answer.score),
              answer.score >= 80
                ? "bg-emerald-500/10"
                : answer.score >= 60
                  ? "bg-amber-500/10"
                  : "bg-rose-500/10",
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
          <span>
            {typeof feedbackText === "object" ? JSON.stringify(feedbackText, null, 2) : String(feedbackText)}
          </span>
        </div>
      )}
    </div>
  );
}
