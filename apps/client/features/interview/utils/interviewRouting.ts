import { getCandidateToken } from "@/shared/lib/AxiosAPI";

export interface InterviewModeInfo {
  isCandidateSession: boolean;
  isTaskDefense: boolean;
  isCareerDiscovery: boolean;
  defenseTaskId: string | null;
}

/**
 * Detects the interview mode and session type from room data and session storage.
 * Consolidates previously duplicated heuristics across InterviewSessionClient and useInterviewFlow.
 */
export function detectInterviewMode(roomData?: any): InterviewModeInfo {
  const isCandidateSession = Boolean(
    getCandidateToken() ||
      roomData?.isCandidateInterview ||
      roomData?.candidateId
  );

  const isTaskDefense = Boolean(
    roomData?.jobDescription?.includes("TASK_DISCUSSION") ||
      (typeof window !== "undefined" &&
        sessionStorage.getItem("is_task_defense") === "true")
  );

  const isCareerDiscovery =
    !isTaskDefense &&
    Boolean(
      roomData?.jobDescription?.includes("CAREER_DISCOVERY") ||
        roomData?.jobDescription?.includes("STUDENT") ||
        roomData?.jobDescription?.includes("استكشاف وتحديد مسار") ||
        roomData?.mode === "CAREER_DISCOVERY" ||
        roomData?.title?.includes("Career Discovery") ||
        roomData?.title?.includes("استكشاف وتحديد مسار") ||
        (typeof window !== "undefined" &&
          (sessionStorage.getItem("interview_mode") === "career_discovery" ||
            sessionStorage.getItem("interview_mode") === "student_placement"))
    );

  const defenseTaskId =
    typeof window !== "undefined"
      ? sessionStorage.getItem("defense_task_id")
      : null;

  return {
    isCandidateSession,
    isTaskDefense,
    isCareerDiscovery,
    defenseTaskId,
  };
}

/**
 * Generates the unified destination URL for an interview upon completion or premature navigation.
 */
export function getInterviewRedirectUrl(
  modeInfo: InterviewModeInfo,
  interviewId: string,
  defenseOptions?: {
    defenseCompleted?: boolean;
    passed?: boolean;
    score?: string | number;
  }
): string {
  if (modeInfo.isTaskDefense) {
    const isCompleted = defenseOptions?.defenseCompleted ?? false;
    const passed = defenseOptions?.passed ?? true;
    const score = defenseOptions?.score ?? "";
    const taskId = modeInfo.defenseTaskId || "";

    if (isCompleted) {
      return `/dashboard/tasks?defenseCompleted=true&passed=${passed}&defenseScore=${score}&taskId=${taskId}`;
    }
    return `/dashboard/tasks?defenseCompleted=true&interviewId=${interviewId}`;
  }

  if (modeInfo.isCareerDiscovery) {
    return `/dashboard/tasks?interviewId=${interviewId}`;
  }

  return `/dashboard/interviewDetails?id=${interviewId}`;
}

/**
 * Cleans up temporary task defense keys from sessionStorage once completed.
 */
export function clearTaskDefenseSession(): void {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("is_task_defense");
      sessionStorage.removeItem("defense_task_id");
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }
}
