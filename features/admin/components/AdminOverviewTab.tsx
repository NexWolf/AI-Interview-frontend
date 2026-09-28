"use client";

import {
  Users,
  Briefcase,
  Sparkles,
  ShieldAlert,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { AdminInterview, AdminViolation, AdminAIRequest, AdminUser } from "@/shared/types/admin";
import { cn } from "@/shared/lib/utils";

interface AdminOverviewTabProps {
  interviews: AdminInterview[];
  users: AdminUser[];
  aiRequests: AdminAIRequest[];
  violations: AdminViolation[];
  onSelectTab: (tab: string) => void;
  onViewInterview: (id: string | number) => void;
}

export function AdminOverviewTab({
  interviews,
  users,
  aiRequests,
  violations,
  onSelectTab,
  onViewInterview,
}: AdminOverviewTabProps) {
  const completedCount = interviews.filter((i) => i.status?.toLowerCase() === "completed").length;
  const runningCount = interviews.filter((i) => i.status?.toLowerCase() === "running").length;
  const activeUsersCount = users.filter((u) => u.isActive).length;
  const cheatingViolationsCount = violations.filter((v) => v.isCheating).length;

  const totalTokens = aiRequests.reduce((acc, curr) => acc + (curr.totalTokens || 0), 0);
  const avgLatency = aiRequests.length
    ? Math.round(aiRequests.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0) / aiRequests.length)
    : 0;

  const stats = [
    {
      title: "Total Interviews",
      value: interviews.length,
      sub: `${completedCount} completed · ${runningCount} active`,
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
      tab: "interviews",
    },
    {
      title: "Registered Users",
      value: users.length,
      sub: `${activeUsersCount} active accounts`,
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      tab: "users",
    },
    {
      title: "AI Token Usage",
      value: totalTokens > 1000 ? `${(totalTokens / 1000).toFixed(1)}k` : totalTokens,
      sub: `Avg latency: ${avgLatency}ms`,
      icon: Sparkles,
      color: "text-violet-500",
      bg: "bg-violet-500/10 border-violet-500/20",
      tab: "ai",
    },
    {
      title: "Proctoring Alerts",
      value: violations.length,
      sub: `${cheatingViolationsCount} cheating flags detected`,
      icon: ShieldAlert,
      color: "text-rose-500",
      bg: "bg-rose-500/10 border-rose-500/20",
      tab: "violations",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              onClick={() => onSelectTab(item.tab)}
              className={cn(
                "relative group p-5 rounded-2xl border bg-card/60 backdrop-blur-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
                item.bg,
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {item.title}
                </span>
                <div className={cn("p-2 rounded-xl bg-background/80 shadow-xs", item.color)}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-foreground">{item.value}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
                <span>{item.sub}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Interviews & Live Violations Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Interviews Feed (2 columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Recent Candidate Interviews
              </h3>
              <p className="text-xs text-muted-foreground">Latest interview sessions and performance scores</p>
            </div>
            <button
              onClick={() => onSelectTab("interviews")}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              View all ({interviews.length})
            </button>
          </div>

          <div className="divide-y divide-border/40">
            {interviews.slice(0, 5).map((interview) => {
              const score = interview.reports?.[0]?.overallScore;
              return (
                <div
                  key={interview.id}
                  onClick={() => onViewInterview(interview.id)}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-muted/40 px-3 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0 text-sm">
                      {interview.user.firstName?.[0] || interview.user.email[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground truncate">
                          {interview.user.firstName ? `${interview.user.firstName} ${interview.user.lastName || ""}` : interview.user.email}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase",
                            interview.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : interview.status === "Running"
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse"
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                          )}
                        >
                          {interview.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{interview.difficultyLevel}</span>
                        <span>•</span>
                        <span>{interview.interviewLanguage}</span>
                        <span>•</span>
                        <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {score !== undefined && score !== null ? (
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground font-medium">Score</div>
                        <div
                          className={cn(
                            "text-sm font-bold",
                            score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500",
                          )}
                        >
                          {score}%
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">In progress</span>
                    )}
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Proctoring & Integrity Feed (1 column) */}
        <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" /> Security Log
              </h3>
              <p className="text-xs text-muted-foreground">Real-time anti-cheating detections</p>
            </div>
            <button
              onClick={() => onSelectTab("violations")}
              className="text-xs font-medium text-rose-500 hover:underline"
            >
              All Alerts
            </button>
          </div>

          <div className="space-y-3">
            {violations.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                No security violations detected.
              </div>
            ) : (
              violations.slice(0, 4).map((violation) => (
                <div
                  key={violation.id}
                  className="p-3.5 rounded-xl border border-border/40 bg-background/50 hover:bg-muted/40 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full font-semibold text-[10px]",
                        violation.isCheating
                          ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                          : "bg-amber-500/15 text-amber-500 border border-amber-500/30",
                      )}
                    >
                      {violation.category.replace("_", " ")}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {new Date(violation.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-foreground">{violation.violationType}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1">
                    <span>
                      User: {violation.user.firstName ? `${violation.user.firstName}` : violation.user.email}
                    </span>
                    <span className="font-mono text-[10px]">#{violation.interviewId}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
