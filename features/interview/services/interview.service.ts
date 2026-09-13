import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { StandardApiResponse } from "@/shared/types/api";
import {
  InterviewListItem,
  InterviewRoom,
  InterviewRoomResponse,
  StartInterviewResponse,
} from "../types/interviewRoom";
import { StartInterviewPayload } from "../types/setup";

const unwrap = async <T>(promise: Promise<{ data: StandardApiResponse<T> }>) => {
  const response = await promise;
  return response.data.data;
};

export const interviewService = {
  create: async (data: StartInterviewPayload): Promise<StartInterviewResponse> => {
    return unwrap(AxiosAPI.post(`/api/interviews/start`, data));
  },

  getById: async (interviewId: string | number): Promise<InterviewRoom> => {
    const response = await AxiosAPI.get<StandardApiResponse<InterviewRoomResponse>>(
      `/api/interviews/${interviewId}`,
    );
    return response.data.data.interview;
  },

  getAll: async (): Promise<InterviewListItem[]> => {
    const response = await AxiosAPI.get<StandardApiResponse<{ interviews: InterviewListItem[] }>>(
      `/api/interviews/`,
    );
    return response.data.data.interviews;
  },

  generateSummary: async (interviewId: string | number) => {
    const response = await AxiosAPI.post(`/api/interviews/${interviewId}/summary`);
    return response.data;
  },
};