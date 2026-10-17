import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/task.service";
import {
  AgentAnalysis,
  DevelopmentTask,
  DevelopmentTaskStatus,
} from "../types/task.types";

export const STUDENT_DEVELOPMENT_KEY = ["student-development"] as const;

export function useLatestAnalysis() {
  return useQuery<AgentAnalysis | null, Error>({
    queryKey: [...STUDENT_DEVELOPMENT_KEY, "latest"],
    queryFn: () => taskService.getLatestAnalysis(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAnalyzeInterview() {
  const queryClient = useQueryClient();
  return useMutation<
    { analysis: AgentAnalysis; created: boolean },
    Error,
    string | number
  >({
    mutationFn: (interviewId: string | number) =>
      taskService.analyzeInterview(interviewId),
    onSuccess: (data) => {
      queryClient.setQueryData(
        [...STUDENT_DEVELOPMENT_KEY, "latest"],
        data.analysis
      );
      queryClient.invalidateQueries({ queryKey: STUDENT_DEVELOPMENT_KEY });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation<
    DevelopmentTask,
    Error,
    {
      taskId: string | number;
      submission?: string;
      status?: DevelopmentTaskStatus;
    }
  >({
    mutationFn: ({ taskId, submission, status }) =>
      taskService.updateTask(taskId, { submission, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_DEVELOPMENT_KEY });
    },
  });
}
