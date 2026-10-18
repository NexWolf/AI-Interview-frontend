import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { interviewService } from "../../services/interview.service";
import { defaultAuthRetry } from "@/shared/lib/queryUtils";
import { InterviewRoom } from "../../types/interviewRoom";

const INTERVIEW_USERS_KEY_QUERY = ["interview"] as const;

export const useGetInterveiwRoom = (interviewId: string | number) => {
  const cleanId = String(interviewId ?? "").trim();
  const isValidId = Boolean(cleanId && cleanId !== "undefined" && cleanId !== "null");

  const queryClient = useQueryClient();
  const query = useQuery<InterviewRoom, Error>({
    queryKey: [...INTERVIEW_USERS_KEY_QUERY, cleanId] as const,
    queryFn: () => interviewService.getById(cleanId),
    enabled: isValidId,
    retry: defaultAuthRetry,
  });
  const data = query.data;
  const needsReport = () => {
    if (!data || data.status !== "Completed" || data.report) return false;
    const timestamp = new Date(data.endTime || data.updatedAt || data.startTime).getTime();
    return isNaN(timestamp) || Date.now() - timestamp <= 5 * 60 * 1000;
  };
  const status = useQuery({
    queryKey: ["interview-report-status", cleanId],
    queryFn: () => interviewService.getStatus(cleanId),
    enabled: isValidId && needsReport(),
    refetchInterval: () => needsReport() ? 5000 : false,
    retry: defaultAuthRetry,
  });
  useEffect(() => {
    if (status.data?.reportReady && !data?.report) {
      void queryClient.invalidateQueries({ queryKey: [...INTERVIEW_USERS_KEY_QUERY, cleanId], exact: true });
    }
  }, [status.data, data?.report, queryClient, cleanId]);
  return query;
};
