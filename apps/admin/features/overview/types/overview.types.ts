import { LucideIcon } from "lucide-react";
import { AdminInterview, AdminUser, AdminAIRequest, AdminViolation } from "@repo/shared";

export interface OverviewStatItem {
  title: string;
  value: string | number;
  sub: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  tab: string;
}

export interface AdminOverviewTabProps {
  interviews: AdminInterview[];
  users: AdminUser[];
  aiRequests: AdminAIRequest[];
  violations: AdminViolation[];
  totalInterviews?: number;
  totalUsers?: number;
  totalAiRequests?: number;
  totalViolations?: number;
  onSelectTab: (tab: string) => void;
  onViewInterview: (id: string | number) => void;
}
