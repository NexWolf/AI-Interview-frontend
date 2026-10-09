"use client";

import { useMemo } from "react";
import { Brain, MessageSquare, Star, Target } from "lucide-react";
import { useGetInterveiwRoom } from "@/features/interview/hooks/ReactQueryHooks/useGetInterviewRoom";
import {
  parseDetailedAnalysis,
  parseRecommendations,
  toNumber,
} from "../utils/interviewDetails.utils";

export function useInterviewReportData(interviewId: string) {
  const {
    data: interview,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetInterveiwRoom(interviewId);

  const report = interview?.report ?? null;

  const dimensionScores = useMemo(() => {
    if (!report) return [];
    return [
      {
        label: "Technical Knowledge",
        value: toNumber(report.technicalKnowledgeScore),
        icon: Brain,
      },
      {
        label: "Communication",
        value: toNumber(report.communicationScore),
        icon: MessageSquare,
      },
      {
        label: "Confidence",
        value: toNumber(report.confidenceScore),
        icon: Star,
      },
      {
        label: "Problem Solving",
        value: toNumber(report.problemSolvingScore),
        icon: Target,
      },
    ];
  }, [report]);

  const detailedEvaluation = useMemo(() => parseDetailedAnalysis(report), [report]);
  const recommendations = useMemo(() => parseRecommendations(report), [report]);

  const questionsWithEvaluation = useMemo(() => {
    const questions = interview?.questions ?? [];
    if (!questions.length) {
      return detailedEvaluation.map((item, idx) => ({
        id: item.questionId ?? String(idx + 1),
        questionOrder: item.questionOrder ?? idx + 1,
        questionText:
          (typeof item.question === "string" && item.question) ||
          `Question ${idx + 1}`,
        answerText: item.answer || null,
        isAnswered: Boolean(item.answer),
        isSkipped: !item.answer && !item.score,
        score:
          item.score !== undefined && item.score !== null
            ? toNumber(item.score as number | string)
            : null,
        feedback: item.feedback,
        improvement: item.improvement as string | undefined,
        modelAnswer: (item.modelAnswer as string) || undefined,
      }));
    }

    return questions.map((q) => {
      const evalItem = detailedEvaluation.find(
        (item) =>
          String(item.questionId) === String(q.id) ||
          Number(item.questionOrder) === Number(q.questionOrder)
      );

      const latestAnswer = q.answers?.length
        ? q.answers[q.answers.length - 1].answerText
        : null;

      return {
        id: q.id,
        questionOrder: q.questionOrder,
        questionText:
          q.questionText || (evalItem?.question as string) || `Question ${q.questionOrder}`,
        answerText: latestAnswer || (evalItem?.answer as string) || null,
        isAnswered: q.isAnswered,
        isSkipped: q.isSkipped,
        score:
          evalItem?.score !== undefined && evalItem?.score !== null
            ? toNumber(evalItem.score as number | string)
            : null,
        feedback: evalItem?.feedback,
        improvement: evalItem?.improvement as string | undefined,
        modelAnswer: (evalItem?.modelAnswer as string) || undefined,
      };
    });
  }, [interview?.questions, detailedEvaluation]);

  const answeredQuestions = useMemo(() => {
    return (interview?.questions ?? []).filter((q) => q.isAnswered);
  }, [interview?.questions]);

  const isGeneratingReport = Boolean(interview?.status === "Completed" && !report);
  const overall = toNumber(report?.overallScore);

  return {
    interview,
    report,
    isLoading,
    isError,
    error,
    refetch,
    dimensionScores,
    detailedEvaluation,
    recommendations,
    questionsWithEvaluation,
    answeredQuestions,
    isGeneratingReport,
    overall,
  };
}
