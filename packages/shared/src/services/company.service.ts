import { AxiosAPI } from "../lib/AxiosAPI";
import {
  CompanyOverviewStats,
  CompanyCandidateItem,
  CreatePortalCandidatePayload,
  CompanyInterviewItem,
  CreatePortalInterviewPayload,
  CompanyApiKeyItem,
  CreatePortalApiKeyPayload,
  CompanyProfileData,
} from "../types/company";

export interface CompanyApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}

export const companyService = {
  // 1. Profile / Me
  getProfile: async (): Promise<CompanyProfileData> => {
    const response = await AxiosAPI.get<CompanyApiResponse<CompanyProfileData>>(
      "/api/v1/company/profile",
    );
    return response.data.data;
  },

  // 2. Overview Stats
  getOverview: async (): Promise<CompanyOverviewStats> => {
    const response = await AxiosAPI.get<CompanyApiResponse<CompanyOverviewStats>>(
      "/api/v1/company/overview",
    );
    return response.data.data;
  },

  // 3. Candidates
  getCandidates: async (): Promise<CompanyCandidateItem[]> => {
    const response = await AxiosAPI.get<CompanyApiResponse<CompanyCandidateItem[]>>(
      "/api/v1/company/candidates",
    );
    return response.data.data || [];
  },

  createCandidate: async (
    payload: CreatePortalCandidatePayload,
  ): Promise<CompanyCandidateItem> => {
    const response = await AxiosAPI.post<CompanyApiResponse<CompanyCandidateItem>>(
      "/api/v1/company/candidates",
      payload,
    );
    return response.data.data;
  },

  // 4. Interviews & Assessments
  getInterviews: async (): Promise<CompanyInterviewItem[]> => {
    const response = await AxiosAPI.get<CompanyApiResponse<CompanyInterviewItem[]>>(
      "/api/v1/company/interviews",
    );
    return response.data.data || [];
  },

  createInterview: async (
    payload: CreatePortalInterviewPayload,
  ): Promise<CompanyInterviewItem> => {
    const response = await AxiosAPI.post<CompanyApiResponse<CompanyInterviewItem>>(
      "/api/v1/company/interviews",
      payload,
    );
    return response.data.data;
  },

  getInterviewById: async (
    id: string | number,
  ): Promise<CompanyInterviewItem> => {
    const response = await AxiosAPI.get<CompanyApiResponse<CompanyInterviewItem>>(
      `/api/v1/company/interviews/${id}`,
    );
    return response.data.data;
  },

  getInterviewResult: async (id: string | number): Promise<any> => {
    const response = await AxiosAPI.get<CompanyApiResponse<any>>(
      `/api/v1/company/interviews/${id}/result`,
    );
    return response.data.data;
  },

  // 5. API Keys
  listApiKeys: async (): Promise<CompanyApiKeyItem[]> => {
    const response = await AxiosAPI.get<CompanyApiResponse<CompanyApiKeyItem[]>>(
      "/api/v1/company/api-keys",
    );
    return response.data.data || [];
  },

  createApiKey: async (
    payload: CreatePortalApiKeyPayload,
  ): Promise<CompanyApiKeyItem> => {
    const response = await AxiosAPI.post<CompanyApiResponse<CompanyApiKeyItem>>(
      "/api/v1/company/api-keys",
      payload,
    );
    return response.data.data;
  },

  revokeApiKey: async (id: string): Promise<CompanyApiKeyItem> => {
    const response = await AxiosAPI.patch<CompanyApiResponse<CompanyApiKeyItem>>(
      `/api/v1/company/api-keys/${id}/revoke`,
    );
    return response.data.data;
  },
};
