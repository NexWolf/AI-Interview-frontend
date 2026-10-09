import { Briefcase, Users, Sparkles, ShieldAlert } from "lucide-react";
import { AdminInterview, AdminUser, AdminAIRequest, AdminViolation } from "@repo/shared";
import { OverviewStatItem } from "../types/overview.types";

interface ComputeOverviewStatsParams {
  interviews: AdminInterview[];
  users: AdminUser[];
  aiRequests: AdminAIRequest[];
  violations: AdminViolation[];
  totalInterviews?: number;
  totalUsers?: number;
  totalAiRequests?: number;
  totalViolations?: number;
}

export function computeOverviewStats({
  interviews,
  users,
  aiRequests,
  violations,
  totalInterviews,
  totalUsers,
  totalViolations,
}: ComputeOverviewStatsParams): OverviewStatItem[] {
  const completedCount = interviews.filter((i) => i.status?.toLowerCase() === "completed").length;
  const runningCount = interviews.filter((i) => i.status?.toLowerCase() === "running").length;
  const activeUsersCount = users.filter((u) => u.isActive).length;
  const cheatingViolationsCount = violations.filter((v) => v.isCheating).length;

  const totalTokens = aiRequests.reduce((acc, curr) => acc + (curr.totalTokens || 0), 0);
  const avgLatency = aiRequests.length
    ? Math.round(aiRequests.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0) / aiRequests.length)
    : 0;

  return [
    {
      title: "Total Interviews",
      value: totalInterviews ?? interviews.length,
      sub: `${completedCount} completed · ${runningCount} active`,
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
      tab: "interviews",
    },
    {
      title: "Registered Users",
      value: totalUsers ?? users.length,
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
      value: totalViolations ?? violations.length,
      sub: `${cheatingViolationsCount} cheating flags detected`,
      icon: ShieldAlert,
      color: "text-rose-500",
      bg: "bg-rose-500/10 border-rose-500/20",
      tab: "violations",
    },
  ];
}
