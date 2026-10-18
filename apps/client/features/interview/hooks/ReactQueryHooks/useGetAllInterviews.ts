import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
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
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => params ? [INTERVIEWS_QUERY_KEY[0], { page: params.page, limit: params.limit }] : INTERVIEWS_QUERY_KEY,
    [params?.page, params?.limit]);
  const query = useQuery({
    queryKey,
    queryFn: () => interviewService.getAll(params),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
    retry: defaultAuthRetry,
  });
  const pendingIds = query.data?.interviews.filter(isRecentlyCompletedWithoutReport).map(item => item.id) || [];
  const statuses = useQuery({
    queryKey: ["interview-report-statuses", pendingIds],
    queryFn: () => interviewService.getStatuses(pendingIds),
    enabled: pendingIds.length > 0,
    refetchInterval: 5000,
    retry: defaultAuthRetry,
  });
  useEffect(() => {
    if (statuses.data?.some(item => item.reportReady)) {
      void queryClient.invalidateQueries({ queryKey, exact: true });
    }
  }, [statuses.data, queryClient, queryKey]);
  return query;
};
