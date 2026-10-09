import { ViolationFilterOption } from "../types/violations.types";

export const VIOLATION_CATEGORY_OPTIONS: ViolationFilterOption[] = [
  { label: "All Categories", value: "ALL" },
  { label: "Tab Switch", value: "TAB_SWITCH" },
  { label: "Multiple Faces", value: "MULTIPLE_FACES" },
  { label: "No Face Detected", value: "NO_FACE" },
  { label: "Audio Anomaly", value: "AUDIO_ANOMALY" },
  { label: "Fullscreen Exit", value: "FULLSCREEN_EXIT" },
];

export const VIOLATION_TYPE_OPTIONS: ViolationFilterOption[] = [
  { label: "All Incident Types", value: "ALL" },
  { label: "Cheating Risk Only", value: "CHEATING" },
  { label: "Technical Issue Only", value: "TECHNICAL" },
];
