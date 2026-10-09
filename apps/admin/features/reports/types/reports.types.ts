import { AdminReport } from "@repo/shared";

export interface AdminReportsTabProps {
  onViewInterview: (id: string | number) => void;
}

export interface ReportCardProps {
  report: AdminReport;
  onViewInterview: (id: string | number) => void;
}
