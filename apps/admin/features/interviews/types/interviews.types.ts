import { AdminInterview } from "@repo/shared";

export interface AdminInterviewsTabProps {
  onViewDetails: (id: string | number) => void;
}

export interface InterviewDetailModalProps {
  interview: AdminInterview | null;
  onClose: () => void;
}

export interface FilterOption {
  label: string;
  value: string;
}
