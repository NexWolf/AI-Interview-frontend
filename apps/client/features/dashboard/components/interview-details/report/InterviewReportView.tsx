"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useInterviewReportData } from "../../../hooks/useInterviewReportData";
import { ReportSkeleton } from "../shared/ReportSkeleton";
import { ReportHeader } from "./ReportHeader";
import { ReportScoreOverview } from "./ReportScoreOverview";
import { ReportStrengthsWeaknesses } from "./ReportStrengthsWeaknesses";
import { ReportImprovementPlan } from "./ReportImprovementPlan";
import { ReportRecommendations } from "./ReportRecommendations";
import { ReportSkillsAssessment } from "./ReportSkillsAssessment";
import { ReportQuestionsAnalysis } from "./ReportQuestionsAnalysis";

interface InterviewReportViewProps {
  interviewId: string;
}

export const InterviewReportView: React.FC<InterviewReportViewProps> = ({
  interviewId,
}) => {
  const {
    interview,
    report,
    isLoading,
    isError,
    error,
    refetch,
    dimensionScores,
    recommendations,
    questionsWithEvaluation,
    answeredQuestions,
    isGeneratingReport,
    overall,
  } = useInterviewReportData(interviewId);

  if (isLoading || isGeneratingReport) {
    return (
      <div className="space-y-4">
        {isGeneratingReport && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <div>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                جاري تحليل إجاباتك وإنشاء التقرير المدعوم بالذكاء الاصطناعي...
              </p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                الرجاء الانتظار، سيتم عرض التقرير فور جهوزه.
              </p>
            </div>
          </div>
        )}
        <ReportSkeleton />
      </div>
    );
  }

  if (isError || !interview) {
    return (
      <div className="max-w-md mx-auto my-20 rounded-2xl border border-border bg-card/60 p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold">Failed to load interview</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {error?.message || "Interview not found."}
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => refetch()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/dashboard/interviewDetails"
            className="border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted/50"
          >
            Back to All Interviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Overview Card */}
      <ReportHeader
        interview={interview}
        answeredCount={answeredQuestions.length}
      />

      {!report ? (
        <div className="rounded-2xl border border-border bg-card/50 p-8 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="font-bold text-lg">No report generated yet</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The AI report is generated when the interview is finished. If your interview
            is still running, return to the interview room and end it to generate your
            evaluation.
          </p>
        </div>
      ) : (
        <>
          {/* 2. Overall Score & Dimension Performance */}
          <ReportScoreOverview
            overall={overall}
            currentLevel={report.currentLevel}
            recommendedNextLevel={report.recommendedNextLevel}
            dimensionScores={dimensionScores}
          />

          {/* 3. Strengths & Improvement Areas */}
          <ReportStrengthsWeaknesses
            strengths={report.strengths}
            weaknesses={report.weaknesses}
          />

          {/* 4. Personalized AI Improvement Plan */}
          {report.improvementPlan && (
            <ReportImprovementPlan plan={report.improvementPlan} />
          )}

          {/* 5. General Recommendations */}
          <ReportRecommendations recommendations={recommendations} />

          {/* 6. Skill-Level Breakdown */}
          <ReportSkillsAssessment skills={interview.skills} />

          {/* 7. Detailed Question-by-Question Analysis */}
          <ReportQuestionsAnalysis questions={questionsWithEvaluation} />
        </>
      )}
    </div>
  );
};

export default InterviewReportView;
