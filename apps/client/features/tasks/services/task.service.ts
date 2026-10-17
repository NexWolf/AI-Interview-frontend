import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import {
  AgentAnalysis,
  DevelopmentTask,
  DevelopmentTaskStatus,
} from "../types/task.types";

interface ApiResponse<T> {
  success: boolean;
  created?: boolean;
  data: T;
  message?: string;
}

export const taskService = {
  // Analyze a completed interview and generate tasks/roadmap/profile
  async analyzeInterview(
    interviewId: string | number
  ): Promise<{ analysis: AgentAnalysis; created: boolean }> {
    const cleanId = String(interviewId).trim();
    const res = await AxiosAPI.post<ApiResponse<AgentAnalysis>>(
      `/api/agent/interviews/${cleanId}/analyze`
    );
    return {
      analysis: res.data.data,
      created: Boolean(res.data.created),
    };
  },

  // Get user's latest analysis
  async getLatestAnalysis(): Promise<AgentAnalysis | null> {
    const res = await AxiosAPI.get<ApiResponse<AgentAnalysis | null>>(
      `/api/agent/analyses/latest`
    );
    return res.data.data ?? null;
  },

  // Get a specific analysis by id
  async getAnalysisById(analysisId: string | number): Promise<AgentAnalysis> {
    const cleanId = String(analysisId).trim();
    const res = await AxiosAPI.get<ApiResponse<AgentAnalysis>>(
      `/api/agent/analyses/${cleanId}`
    );
    return res.data.data;
  },

  // Update a task (e.g. submit github solution or update status)
  async updateTask(
    taskId: string | number,
    payload: { submission?: string; status?: DevelopmentTaskStatus }
  ): Promise<DevelopmentTask> {
    const cleanId = String(taskId).trim();
    const res = await AxiosAPI.patch<ApiResponse<DevelopmentTask>>(
      `/api/agent/tasks/${cleanId}`,
      payload
    );
    return res.data.data;
  },

  // Start a task code defense interview
  async startTaskDefenseInterview(
    taskId: string | number,
    payload?: { interviewLanguage?: string }
  ): Promise<{
    taskId: string;
    taskTitle: string;
    interview: { id: string | number; [key: string]: any };
    [key: string]: any;
  }> {
    const cleanId = String(taskId).trim();
    const res = await AxiosAPI.post<ApiResponse<any>>(
      `/api/agent/tasks/${cleanId}/interview`,
      payload || { interviewLanguage: "Arabic" }
    );
    return res.data.data;
  },

  // Evaluate a completed code defense interview
  async evaluateTaskDefense(
    taskIdOrInterviewId: string | number,
    type: "task" | "interview" = "task"
  ): Promise<{
    passed: boolean;
    score: number;
    congratulatoryMessage: string;
    feedbackSummary: string;
    masteredConcepts: string[];
    gapsIdentified: string[];
    completedTask: any;
    nextTask: any;
  }> {
    const cleanId = String(taskIdOrInterviewId).trim();
    const endpoint =
      type === "interview"
        ? `/api/agent/interviews/${cleanId}/evaluate-defense`
        : `/api/agent/tasks/${cleanId}/evaluate-defense`;
    const res = await AxiosAPI.post<ApiResponse<any>>(endpoint);
    return res.data.data;
  },
};
