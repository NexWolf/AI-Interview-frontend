import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { interviewService } from "../../services/interview.service";
import { defaultAuthRetry } from "@/shared/lib/queryUtils";
import type { GetAllInterviewsParams } from "../../types/interviewRoom";

export const INTERVIEWS_QUERY_KEY = ["interviews"] as const;

// Maximum time window to poll for newly completed interviews (3 minutes)
const RECENT_COMPLETED_THRESHOLD_MS = 3 * 60 * 1000;

const isRecentlyCompletedWithoutReport = (inv: any): boolean => {
  if (inv?.status !== "Completed" || Boolean(inv?.report)) return false;

  const timestampStr = inv.endTime || inv.updatedAt || inv.createdAt;
  if (!timestampStr) return false;

  const time = new Date(timestampStr).getTime();
  if (isNaN(time)) return false;

  const diff = Date.now() - time;
  return diff >= 0 && diff < RECENT_COMPLETED_THRESHOLD_MS;
};

export const useGetAllInterviews = (params?: GetAllInterviewsParams) => {
  return useQuery({
    queryKey: params ? [INTERVIEWS_QUERY_KEY[0], params] : INTERVIEWS_QUERY_KEY,
    queryFn: () => interviewService.getAll(params),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
    retry: defaultAuthRetry,
    refetchInterval: (query) => {
      const data = query.state.data;
      const list = Array.isArray(data) ? data : data?.interviews;
      const isAnyGenerating = list?.some(isRecentlyCompletedWithoutReport);
      return isAnyGenerating ? 5000 : false;
    },
  });
};