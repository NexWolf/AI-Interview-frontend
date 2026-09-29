export type ViolationCategory = "Intentional" | "Unintentional" | "System_Issue";

export type SpecificViolationType = 
  | "FACE_NOT_DETECTED"
  | "MULTIPLE_FACES_DETECTED"
  | "TAB_SWITCH"
  | "CAMERA_DISCONNECTED"
  | "MICROPHONE_DISCONNECTED"
  | "SUSPICIOUS_VOICE_DETECTED"
  | "FULLSCREEN_EXITED";

export interface InterviewViolation {
  violationType: SpecificViolationType;
  category: ViolationCategory;
  details: string;
  description: string;
  systemResponse: string; // e.g., "Logged violation and warned user"
  occurredAt: string; // ISO 8601 Date string
  
  // Optional / Defaulted fields
  warningCount?: number;
  isCheating?: boolean;
  isTechnicalIssue?: boolean;
  affectedInterview?: boolean;
  durationSeconds?: number | null;
}

export interface BatchViolationsPayload {
  interviewId: string;
  violations: InterviewViolation[];
}
