import { FilterOption } from "../types/interviews.types";

export const INTERVIEW_STATUS_OPTIONS: FilterOption[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Completed", value: "Completed" },
  { label: "Running", value: "Running" },
  { label: "Pending", value: "Pending" },
  { label: "Paused", value: "Paused" },
  { label: "Failed", value: "Failed" },
];

export const INTERVIEW_LANGUAGE_OPTIONS: FilterOption[] = [
  { label: "All Languages", value: "ALL" },
  { label: "English", value: "English" },
  { label: "Arabic", value: "Arabic" },
];
