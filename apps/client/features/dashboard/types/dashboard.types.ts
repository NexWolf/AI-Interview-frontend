import type { DashboardSkillProgress } from "@/shared/types/dashboard";
import type { InterviewListItem } from "@/features/interview/types/interviewRoom";

export interface DashboardHeaderProps {
  firstName?: string | null;
  isAr: boolean;
}

export interface DashboardStatsProps {
  totalInterviews?: number;
  averageScore?: number | string | null;
  assessedSkillsCount?: number;
  isAr: boolean;
}

export interface DashboardSkillProgressProps {
  skillProgress?: DashboardSkillProgress[];
  isAr: boolean;
}

export interface DashboardRecentInterviewsProps {
  interviews?: InterviewListItem[];
  isLoading: boolean;
  isError: boolean;
  isAr: boolean;
}

export interface DashboardProfileRequiredProps {
  isAr: boolean;
}
