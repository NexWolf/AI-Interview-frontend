"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileText,
  Lightbulb,
  Loader2,
  MessageSquare,
  Mic,
  Play,
  Plus,
  Star,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useGetAllInterviews } from "@/features/interview/hooks/ReactQueryHooks/useGetAllInterviews";

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-muted/50", className)} />;
}

function ReportSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-40" />
      <div className="rounded-2xl border border-border/70 bg-card/70 p-6 sm:p-8 space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-56" />
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </div>
  );
}
import { useGetInterveiwRoom } from "@/features/interview/hooks/ReactQueryHooks/useGetInterviewRoom";
import { ReportApi } from "@/features/interview/types/interviewRoom";
import { cn } from "@/shared/lib/utils";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
};

const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusStyles: Record<string, string> = {
  Running: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  Completed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  Paused: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Pending: "bg-slate-500/10 text-slate-300 border-slate-600/30",
  Failed: "bg-red-500/10 text-red-400 border-red-500/30",
};

const scoreColor = (score: number) =>
  score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400";

const scoreRingColor = (score: number) =>
  score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#f43f5e";

function ScoreRing({ value, label }: { value: number; label?: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={scoreRingColor(value)}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-bold", scoreColor(value))}>
            {Math.round(value)}
          </span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      {label && <p className="text-xs font-medium text-muted-foreground">{label}</p>}
    </div>
  );
}

function scoreBar(value: number) {
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div
        className={cn("h-full rounded-full", value >= 75 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-rose-500")}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

interface DetailedEvaluation {
  questionId?: string;
  questionOrder?: number;
  question?: string;
  skill?: string;
  skillId?: string;
  difficulty?: string;
  score?: number | string;
  feedback?: string;
  answer?: string;
  strengths?: string[];
  weaknesses?: string[];
  [key: string]: unknown;
}

function parseDetailedAnalysis(report: ReportApi | null): DetailedEvaluation[] {
  const raw = report?.detailedAnalysis;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as DetailedEvaluation[];
  if (raw && typeof raw === "object") {
    const val = (raw as Record<string, unknown>).evaluations ?? (raw as Record<string, unknown>).questions;
    if (Array.isArray(val)) return val as DetailedEvaluation[];
  }
  return [];
}

function parseRecommendations(report: ReportApi | null): string[] {
  const raw = report?.recommendations;
  if (!raw) return [];
  if (typeof raw === "string") return [raw];
  if (Array.isArray(raw)) {
    return raw.map((r) => (typeof r === "string" ? r : JSON.stringify(r)));
  }
  const arr = (raw as Record<string, unknown>).list ?? (raw as Record<string, unknown>).recommendations;
  if (Array.isArray(arr)) return arr.map((r) => (typeof r === "string" ? r : JSON.stringify(r)));
  return [];
}

function MyInterviewsList() {
  const router = useRouter();
  const { data: interviews, isLoading, isError, refetch } = useGetAllInterviews();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto my-20 rounded-2xl border border-border bg-card/60 p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold">Failed to load interviews</h2>
        <p className="text-sm text-muted-foreground mt-2">Could not retrieve your interview list.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => refetch()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 cursor-pointer"
          >
            Try Again
          </button>
          <Link href="/dashboard" className="border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted/50">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const items = interviews || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Interviews</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review your previous AI technical interviews, view detailed performance evaluations, or resume ongoing sessions.
          </p>
        </div>
        <Link
          href="/interview/setup"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Start New Interview
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/60 p-12 text-center space-y-4">
          <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <h3 className="text-lg font-bold">No interviews yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Take your first realistic AI mock interview to practice your skills and get immediate actionable feedback.
          </p>
          <Link
            href="/interview/setup"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Start Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((interview) => {
            const inProgress = interview.status === "Running" || interview.status === "Paused";
            return (
              <div
                key={interview.id}
                className="group relative rounded-2xl border border-border/70 bg-card/70 hover:bg-card hover:border-primary/40 p-5 sm:p-6 transition-all duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={cn(
                        "text-xs px-2.5 py-0.5 rounded-full border font-semibold",
                        statusStyles[interview.status] || statusStyles.Pending,
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
                    {interview.skills?.map((s) => s.name).join(", ") || "General Technical Evaluation"}
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
                  ) : (
                    <button
                      onClick={() => router.push(`/dashboard/interviewDetails?id=${interview.id}`)}
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
          })}
        </div>
      )}
    </div>
  );
}

function InterviewReportView({ interviewId }: { interviewId: string }) {
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
      { label: "Technical Knowledge", value: toNumber(report.technicalKnowledgeScore), icon: Brain },
      { label: "Communication", value: toNumber(report.communicationScore), icon: MessageSquare },
      { label: "Confidence", value: toNumber(report.confidenceScore), icon: Star },
      { label: "Problem Solving", value: toNumber(report.problemSolvingScore), icon: Target },
    ];
  }, [report]);

  const detailedEvaluation = useMemo(() => parseDetailedAnalysis(report), [report]);
  const recommendations = useMemo(() => parseRecommendations(report), [report]);

  const answeredQuestions = (interview?.questions ?? []).filter((q) => q.isAnswered);

  if (isLoading) {
    return <ReportSkeleton />;
  }

  if (isError || !interview) {
    return (
      <div className="max-w-md mx-auto my-20 rounded-2xl border border-border bg-card/60 p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold">Failed to load interview</h2>
        <p className="text-sm text-muted-foreground mt-2">{error?.message || "Interview not found."}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => refetch()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 cursor-pointer"
          >
            Try Again
          </button>
          <Link href="/dashboard/interviewDetails" className="border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted/50">
            Back to All Interviews
          </Link>
        </div>
      </div>
    );
  }

  const overall = toNumber(report?.overallScore);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Interview Report</h1>
              <span className="text-xs text-muted-foreground">#{interview.id}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">
              {interview.difficultyLevel} • {interview.interviewLanguage} • {interview.duration} min •{" "}
              {formatDate(interview.createdAt)}
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
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30",
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
            {interview.skills.map((skill) => (
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
              { label: "Answered", value: answeredQuestions.length },
              { label: "Skipped", value: interview.skippedQuestions },
              { label: "Duration", value: `${interview.duration} min` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-background/60 border border-border/50 p-3 text-center">
                <p className="text-lg font-bold">{item.value}</p>
                <p className="text-[11px] text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {!report ? (
        <div className="rounded-2xl border border-border bg-card/50 p-8 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="font-bold text-lg">No report generated yet</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The AI report is generated when the interview is finished. If your interview is still running,
            return to the interview room and end it to generate your evaluation.
          </p>
        </div>
      ) : (
        <>
          {/* Overall Score & Dimension Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border/70 bg-card/70 p-6 flex flex-col items-center justify-center gap-4">
              <ScoreRing value={overall} label="Overall Score" />
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">Current Level</span>
                <span className="font-semibold text-primary">{report.currentLevel || "—"}</span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Recommended Next: <span className="font-semibold text-foreground">{report.recommendedNextLevel || "—"}</span>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card/70 p-6 space-y-5">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Performance Dimensions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                {dimensionScores.map(({ label, value, icon: Icon }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        {label}
                      </span>
                      <span className={cn("text-xs font-bold", scoreColor(value))}>
                        {Math.round(value)}%
                      </span>
                    </div>
                    {scoreBar(value)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths / Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-3">
              <h2 className="font-bold text-sm text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Strengths
              </h2>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {report.strengths || "No strengths recorded."}
              </p>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-3">
              <h2 className="font-bold text-sm text-rose-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Areas for Improvement
              </h2>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {report.weaknesses || "No areas recorded."}
              </p>
            </div>
          </div>

          {/* Improvement plan */}
          {report.improvementPlan && (
            <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-3">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Improvement Plan
              </h2>
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                {report.improvementPlan}
              </p>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-3">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Recommendations
              </h2>
              <ul className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/90">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills assessment */}
          {interview.skills?.some((s) => s.evaluation) && (
            <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-4">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                Skill-Level Assessment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {interview.skills.map((skill) =>
                  skill.evaluation ? (
                    <div
                      key={skill.id}
                      className="rounded-xl border border-border/50 bg-background/50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{skill.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                          {skill.evaluation.proficiencyLevel || "Assessed"}
                        </span>
                      </div>
                      <div className="mt-3">
                        {scoreBar(toNumber(skill.evaluation.aiAssessmentScore))}
                        <p className="text-[11px] text-muted-foreground mt-1.5">
                          {skill.evaluation.aiAssessmentScore !== null &&
                          skill.evaluation.aiAssessmentScore !== undefined
                            ? `${Math.round(toNumber(skill.evaluation.aiAssessmentScore))}%`
                            : "Not scored"}
                        </p>
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}

          {/* Detailed question evaluation */}
          {detailedEvaluation.length > 0 && (
            <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-4">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Question-by-Question Evaluation
              </h2>
              <div className="space-y-3">
                {detailedEvaluation.map((item, idx) => {
                  const score = toNumber(item.score as number | string | null | undefined);
                  return (
                    <div
                      key={item.questionId ?? idx}
                      className="rounded-xl border border-border/50 bg-background/40 p-4 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <span className="text-xs font-semibold text-indigo-400">
                          Q{item.questionOrder ?? idx + 1}
                          {item.skill ? ` • ${item.skill}` : ""}
                        </span>
                        <span className={cn("text-xs font-bold", scoreColor(score))}>
                          {score > 0 ? `${Math.round(score)}%` : "—"}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {typeof item.question === "string" && item.question
                          ? item.question
                          : "Question"}
                      </p>
                      {item.answer && (
                        <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
                          <span className="font-semibold text-foreground">Your answer: </span>
                          {item.answer}
                        </p>
                      )}
                      {item.feedback && (
                        <p className="text-xs leading-relaxed text-foreground/85">{item.feedback}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Transcript fallback: answered Q&A */}
          {detailedEvaluation.length === 0 && answeredQuestions.length > 0 && (
            <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-4">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Mic className="w-4 h-4 text-indigo-400" />
                Interview Transcript
              </h2>
              <div className="space-y-3">
                {answeredQuestions.map((q) => (
                  <div key={q.id} className="rounded-xl border border-border/50 bg-background/40 p-4 space-y-2">
                    <p className="text-sm font-medium leading-relaxed">{q.questionText}</p>
                    {q.answers?.map((a) => (
                      <p key={a.id} className="text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
                        <span className="font-semibold text-foreground">Answer: </span>
                        {a.answerText}
                        {a.score !== null && a.score !== undefined && (
                          <span className="ml-2 text-indigo-400 font-semibold">
                            Score: {Math.round(toNumber(a.score))}%
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function InterviewDetails({ searchParams }: PageProps) {
  const params = use(searchParams);
  const interviewId = params?.id ? String(params.id).trim() : null;

  if (!interviewId) {
    return <MyInterviewsList />;
  }

  return <InterviewReportView interviewId={interviewId} />;
}