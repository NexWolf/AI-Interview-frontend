"use client";

import Link from "next/link";
import {
  BarChart3,
  Briefcase,
  Plus,
  Trophy,
  Clock,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/shared/hook/useDashboard";
import { useGetAllInterviews } from "@/features/interview/hooks/ReactQueryHooks/useGetAllInterviews";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import { cn } from "@/shared/lib/utils";

const statusStyles: Record<string, string> = {
  Running: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  Completed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  Paused: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Pending: "bg-slate-500/10 text-slate-300 border-slate-600/30",
  Failed: "bg-red-500/10 text-red-400 border-red-500/30",
};

const toNumber = (score: number | string | null | undefined): number =>
  typeof score === "number" ? score : Number(score ?? 0);

const formatDate = (iso?: string | null) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-muted/50", className)} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-11 w-44" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[120px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-72" />
        <div className="lg:col-span-2 space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: user } = useUserInfo();
  const {
    data: dashboard,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useDashboard();
  const {
    data: interviews,
    isLoading: interviewsLoading,
    isError: interviewsError,
  } = useGetAllInterviews();

  const averageScore = dashboard?.averageScore;

  if (dashboardLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardError) {
    return (
      <div className="max-w-md mx-auto my-20 rounded-2xl border border-border bg-card/60 p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold">Profile setup required</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Complete your profile setup to unlock your dashboard, skills tracking and interview reports.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Complete Profile Setup
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center gap-2 border border-border px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            View My Profile
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Interviews",
      value: dashboard?.totalInterviews ?? 0,
      icon: Briefcase,
      accent: "from-indigo-500 to-violet-500",
    },
    {
      label: "Average Score",
      value:
        averageScore !== null && averageScore !== undefined
          ? `${Math.round(toNumber(averageScore))}%`
          : "—",
      icon: BarChart3,
      accent: "from-emerald-500 to-teal-500",
    },
    {
      label: "Assessed Skills",
      value: dashboard?.skillProgress?.length ?? 0,
      icon: Trophy,
      accent: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {greeting()}, {user?.firstName || "Candidate"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your progress, review reports, and sharpen your interview skills with AI.
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm"
          >
            <div className={cn("absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-tr opacity-15 blur-2xl", accent)} />
            <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-tr flex items-center justify-center text-white mb-3 shadow-md", accent)}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill progress */}
        <div className="lg:col-span-1 rounded-2xl border border-border/70 bg-card/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm">Skill Progress</h2>
            <Link href="/dashboard/setting" className="text-xs text-primary hover:underline">
              Manage
            </Link>
          </div>

          {!dashboard?.skillProgress?.length ? (
            <p className="text-xs text-muted-foreground italic">
              No assessed skills yet. Complete an AI interview to build your skill profile.
            </p>
          ) : (
            <div className="space-y-4">
              {dashboard.skillProgress.map((skill) => {
                const score = toNumber(skill.score);
                return (
                  <div key={skill.skillId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {skill.score !== null && skill.score !== undefined
                          ? `${Math.round(score)}%`
                          : skill.proficiencyLevel || "Assessed"}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          score >= 75
                            ? "bg-emerald-500"
                            : score >= 50
                              ? "bg-amber-500"
                              : "bg-rose-500",
                        )}
                        style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent interviews */}
        <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Recent Interviews
            </h2>
          </div>

          {interviewsLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-6">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading interviews...
            </div>
          )}

          {interviewsError && (
            <p className="text-xs text-red-400 italic py-6">Failed to load interviews.</p>
          )}

          {!interviewsLoading && !interviewsError && interviews?.length === 0 && (
            <div className="py-10 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-muted-foreground/50 mx-auto" />
              <p className="text-sm text-muted-foreground">
                No interviews yet — take your first AI interview!
              </p>
              <Link
                href="/interview/setup"
                className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                Start now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {(interviews || []).slice(0, 6).map((interview) => {
              const inProgress = interview.status === "Running" || interview.status === "Paused";
              return (
                <button
                  key={interview.id}
                  onClick={() =>
                    router.push(
                      inProgress
                        ? `/interview/${interview.id}`
                        : `/dashboard/interviewDetails?id=${interview.id}`,
                    )
                  }
                  className="w-full flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/40 hover:border-border px-4 py-3.5 text-left transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border font-semibold",
                          statusStyles[interview.status] || statusStyles.Pending,
                        )}
                      >
                        {interview.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {interview.difficultyLevel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {interview.interviewLanguage}
                      </span>
                    </div>
                    <p className="text-sm font-medium mt-1.5 truncate">
                      {interview.skills?.map((s) => s.name).join(", ") || "General Technical Evaluation"}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {inProgress ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Resume
                      </span>
                    ) : (
                      <>
                        <p className="text-xs font-semibold">{interview.totalQuestions} Qs</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {formatDate(interview.createdAt)}
                        </p>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}