"use client";

import { useDashboard } from "@/shared/hook/useDashboard";
import { useGetAllInterviews } from "@/features/interview/hooks/ReactQueryHooks/useGetAllInterviews";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import { useLanguage } from "@/shared/context/LanguageContext";

import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import DashboardSkillProgress from "./DashboardSkillProgress";
import DashboardRecentInterviews from "./DashboardRecentInterviews";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardProfileRequired from "./DashboardProfileRequired";

export default function DashboardClient() {
  const { data: user } = useUserInfo();
  const { language } = useLanguage();
  const isAr = language === "ar";

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

  if (dashboardLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardError) {
    return <DashboardProfileRequired isAr={isAr} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome greeting & new interview CTA */}
      <DashboardHeader firstName={user?.firstName} isAr={isAr} />

      {/* High-level metrics */}
      <DashboardStats
        totalInterviews={dashboard?.totalInterviews}
        averageScore={dashboard?.averageScore}
        assessedSkillsCount={dashboard?.skillProgress?.length}
        isAr={isAr}
      />

      {/* Main dashboard grid: skills breakdown & recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardSkillProgress
          skillProgress={dashboard?.skillProgress}
          isAr={isAr}
        />
        <DashboardRecentInterviews
          interviews={interviews?.interviews}
          isLoading={interviewsLoading}
          isError={interviewsError}
          isAr={isAr}
        />
      </div>
    </div>
  );
}
