import { useQuery } from "@tanstack/react-query";
import { interviewService } from "../../services/interview.service";
import { defaultAuthRetry } from "@/shared/lib/queryUtils";
import { InterviewRoom } from "../../types/interviewRoom";

const INTERVIEW_USERS_KEY_QUERY = ["interview"] as const;

export const useGetInterveiwRoom = (interviewId: string | number) => {
  return useQuery<InterviewRoom, Error>({
    queryKey: [...INTERVIEW_USERS_KEY_QUERY, String(interviewId)] as const,
    queryFn: () => interviewService.getById(interviewId),
    enabled: !!interviewId,
    retry: defaultAuthRetry,
  });
};