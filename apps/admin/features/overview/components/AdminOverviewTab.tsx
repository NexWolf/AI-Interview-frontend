"use client";

import { AdminOverviewTabProps } from "../types/overview.types";
import { computeOverviewStats } from "../utils/overviewStats";
import { OverviewStatCard } from "./OverviewStatCard";
import { RecentInterviewsFeed } from "./RecentInterviewsFeed";
import { SecurityLogFeed } from "./SecurityLogFeed";

export function AdminOverviewTab({
  interviews,
  users,
  aiRequests,
  violations,
  totalInterviews,
  totalUsers,
  totalAiRequests,
  totalViolations,
  onSelectTab,
  onViewInterview,
}: AdminOverviewTabProps) {
  const stats = computeOverviewStats({
    interviews,
    users,
    aiRequests,
    violations,
    totalInterviews,
    totalUsers,
    totalAiRequests,
    totalViolations,
  });

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <OverviewStatCard
            key={stat.title}
            stat={stat}
            onClick={() => onSelectTab(stat.tab)}
          />
        ))}
      </div>

      {/* Main Content Grid: Recent Interviews & Security Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentInterviewsFeed
          interviews={interviews}
          onSelectTab={onSelectTab}
          onViewInterview={onViewInterview}
        />
        <SecurityLogFeed
          violations={violations}
          onSelectTab={onSelectTab}
        />
      </div>
    </div>
  );
}
