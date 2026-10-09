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
      if (data && data.status === "Completed" && !data.report) {
        const timeStr = data.endTime || data.updatedAt || data.startTime;
        if (timeStr) {
          const time = new Date(timeStr).getTime();
          // If interview completed more than 5 minutes ago, stop polling
          if (!isNaN(time) && Date.now() - time > 5 * 60 * 1000) {
            return false;
          }
        }
        return 5000;
      }
      return false;
    },
  });
};