import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import { StandardApiResponse } from "@/shared/types/api";
import {
  GetAllInterviewsParams,
  GetAllInterviewsResponse,
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
    return unwrap(AxiosAPI.post(`/api/v1/interviews/start`, data));
  },

  getById: async (interviewId: string | number): Promise<InterviewRoom> => {
    const cleanId = String(interviewId ?? "").trim();
    if (!cleanId || cleanId === "undefined" || cleanId === "null") {
      throw new Error("Valid interview ID is required");
    }
    const response = await AxiosAPI.get<StandardApiResponse<InterviewRoomResponse>>(
      `/api/interviews/${cleanId}`,
    );
    if (!response?.data?.data?.interview) {
      throw new Error("Interview not found");
    }
    return response.data.data.interview;
  },

  getAll: async (
    params?: GetAllInterviewsParams,
  ): Promise<GetAllInterviewsResponse> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const url = `/api/interviews/${qs ? `?${qs}` : ""}`;

    const response = await AxiosAPI.get<
      StandardApiResponse<{
        interviews: InterviewListItem[];
        pagination?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>
    >(url);

    const rawData = response?.data?.data as any;
    if (Array.isArray(rawData)) {
      return { interviews: rawData };
    }

    return {
      interviews: rawData?.interviews || [],
      pagination: rawData?.pagination || (response?.data as any)?.pagination,
    };
  },

  generateSummary: async (interviewId: string | number) => {
    const response = await AxiosAPI.post(`/api/interviews/${interviewId}/summary`);
    return response.data;
  },
};