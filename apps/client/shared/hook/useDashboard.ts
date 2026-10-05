import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/shared/services/dashboard.service";
import { defaultAuthRetry } from "@/shared/lib/queryUtils";

export const DASHBOARD_QUERY_KEY = ["dashboard", "me"] as const;

export const useDashboard = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: dashboardService.getDashboard,
    staleTime: 2 * 60 * 1000,
    retry: defaultAuthRetry,
  });
};