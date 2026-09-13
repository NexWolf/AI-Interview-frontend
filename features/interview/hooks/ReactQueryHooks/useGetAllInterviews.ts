import { useQuery } from "@tanstack/react-query";
import { interviewService } from "../../services/interview.service";
import { defaultAuthRetry } from "@/shared/lib/queryUtils";

export const INTERVIEWS_QUERY_KEY = ["interviews"] as const;

export const useGetAllInterviews = () => {
  return useQuery({
    queryKey: INTERVIEWS_QUERY_KEY,
    queryFn: interviewService.getAll,
    staleTime: 2 * 60 * 1000,
    retry: defaultAuthRetry,
  });
};