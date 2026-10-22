import { useQuery } from "@tanstack/react-query";
import { interviewService } from "../../services/interview.service";
import { defaultAuthRetry } from "@/shared/lib/queryUtils";
import { InterviewRoom } from "../../types/interviewRoom";

const INTERVIEW_USERS_KEY_QUERY = ["interview"] as const;

export const useGetInterveiwRoom = (interviewId: string | number) => {
  const cleanId = String(interviewId ?? "").trim();
  const isValidId = Boolean(cleanId && cleanId !== "undefined" && cleanId !== "null");

  return useQuery<InterviewRoom, Error>({
    queryKey: [...INTERVIEW_USERS_KEY_QUERY, cleanId] as const,
    queryFn: () => interviewService.getById(cleanId),
    enabled: isValidId,
    retry: defaultAuthRetry,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll while report is not generated yet (whether status is Completed or in final transition)
      if (data && !data.report) {
        const timeStr = data.endTime || data.updatedAt || data.startTime;
        if (timeStr) {
          const time = new Date(timeStr).getTime();
          const elapsed = Date.now() - time;
          // If interview completed or created more than 4 minutes ago, stop polling
          if (!isNaN(time) && elapsed > 4 * 60 * 1000) {
            return false;
          }
          // Smart Backoff: AI report generation takes ~18-25s.
          // In the first 18s, wait 14s before checking to avoid spamming the database.
          if (!isNaN(time) && elapsed < 18000) {
            return 14000;
          }
        }
        // Check once every 12s instead of 7s (drastically cuts request count by ~60%)
        return 12000;
      }
      return false;
    },
  });
};