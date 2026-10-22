"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
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

  // 1. Seamless loading & generation state: Display modern Skeleton immediately upon leaving room
  if (isLoading || isGeneratingReport || !report) {
    return (
      <ReportSkeleton
        isGenerating={true}
        title="جاري تحليل إجاباتك وإنشاء التقرير المدعوم بالذكاء الاصطناعي..."
        subtitle="الرجاء الانتظار، نقوم بفحص مهاراتك الفنية وبناء التقرير التقييمي وخطة التحسين."
      />
    );
  }

  // 2. Fatal load or interview not found error
  if (isError || !interview) {
    return (
      <div className="max-w-md mx-auto my-20 rounded-2xl border border-border bg-card/60 p-8 text-center shadow-lg">
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

  // 3. Complete Report Evaluation View
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Overview Card */}
      <ReportHeader
        interview={interview}
        answeredCount={answeredQuestions.length}
      />

      {/* 2. Overall Score & Dimension Performance */}
      <ReportScoreOverview
        overall={overall}
        currentLevel={report.currentLevel}
        recommendedNextLevel={report.recommendedNextLevel}
        dimensionScores={dimensionScores}
      />

      {/* 3. Strengths and Weaknesses */}
      <ReportStrengthsWeaknesses
        strengths={report.strengths}
        weaknesses={report.weaknesses}
      />

      {/* 4. Improvement Plan */}
      {report.improvementPlan && (
        <ReportImprovementPlan plan={report.improvementPlan} />
      )}

      {/* 5. Recommendations */}
      <ReportRecommendations recommendations={recommendations} />

      {/* 6. Skills Assessment */}
      <ReportSkillsAssessment skills={interview.skills} />

      {/* 5. Detailed Questions Analysis */}
      <ReportQuestionsAnalysis
        questions={questionsWithEvaluation}
      />
    </div>
  );
};

export default InterviewReportView;
