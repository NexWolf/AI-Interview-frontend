import { AxiosAPI } from "../lib/AxiosAPI";
import {
  AdminAIRequest,
  AdminFilterParams,
  AdminInterview,
  AdminPagination,
  AdminReport,
  AdminUser,
  AdminViolation,
  AdminCompany,
  AdminApiKey,
  AdminCandidate,
  AdminQuestion,
  AdminFeedback,
} from "../types/admin";

export interface AdminApiResponse<T> {
  status: "success" | "error";
  data: T;
  pagination?: AdminPagination;
  message?: string;
}

export const adminService = {
  // 1. Interviews
  getInterviews: async (
    params?: AdminFilterParams,
  ): Promise<{ interviews: AdminInterview[]; pagination: AdminPagination }> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminInterview[]>>("/api/v1/admin/interviews", {
      params,
    });
    return {
      interviews: response.data.data || [],
      pagination: response.data.pagination || {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: response.data.data?.length || 0,
        totalPages: 1,
      },
    };
  },

  getInterviewById: async (id: string | number): Promise<AdminInterview | null> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminInterview>>(`/api/v1/admin/interviews/${id}`);
    return response.data.data;
  },

  // 2. Users
  getUsers: async (
    params?: AdminFilterParams,
  ): Promise<{ users: AdminUser[]; pagination: AdminPagination }> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminUser[]>>("/api/v1/admin/users", {
      params,
    });
    return {
      users: response.data.data || [],
      pagination: response.data.pagination || {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: response.data.data?.length || 0,
        totalPages: 1,
      },
    };
  },

  getUserById: async (id: string): Promise<AdminUser | null> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminUser>>(`/api/v1/admin/users/${id}`);
    return response.data.data;
  },

  createUser: async (data: Partial<AdminUser>): Promise<AdminUser> => {
    const response = await AxiosAPI.post<AdminApiResponse<AdminUser>>("/api/v1/admin/users", data);
    return response.data.data;
  },

  updateUser: async (id: string, data: Partial<AdminUser>): Promise<AdminUser> => {
    const response = await AxiosAPI.patch<AdminApiResponse<AdminUser>>(`/api/v1/admin/users/${id}`, data);
    return response.data.data;
  },

  updateUserStatus: async (id: string, isActive: boolean): Promise<{ id: string; isActive: boolean }> => {
    const response = await AxiosAPI.patch<AdminApiResponse<{ id: string; isActive: boolean }>>(
      `/api/v1/admin/users/${id}/status`,
      { isActive },
    );
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await AxiosAPI.delete(`/api/v1/admin/users/${id}`);
  },

  // 3. AI Requests
  getAIRequests: async (
    params?: AdminFilterParams,
  ): Promise<{ aiRequests: AdminAIRequest[]; pagination: AdminPagination; metrics?: any }> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminAIRequest[]>>("/api/v1/admin/ai-requests", {
      params,
    });
    return {
      aiRequests: response.data.data || [],
      pagination: response.data.pagination || {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: response.data.data?.length || 0,
        totalPages: 1,
      },
      metrics: (response.data as any).metrics,
    };
  },

  getAIRequestById: async (id: string | number): Promise<AdminAIRequest | null> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminAIRequest>>(`/api/v1/admin/ai-requests/${id}`);
    return response.data.data;
  },

  // 4. Violations
  getViolations: async (
    params?: AdminFilterParams,
  ): Promise<{ violations: AdminViolation[]; pagination: AdminPagination }> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminViolation[]>>("/api/v1/admin/violations", {
      params,
    });
    return {
      violations: response.data.data || [],
      pagination: response.data.pagination || {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: response.data.data?.length || 0,
        totalPages: 1,
      },
    };
  },

  getViolationById: async (id: string | number): Promise<AdminViolation | null> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminViolation>>(`/api/v1/admin/violations/${id}`);
    return response.data.data;
  },

  // 5. Reports
  getReports: async (
    params?: AdminFilterParams,
  ): Promise<{ reports: AdminReport[]; pagination: AdminPagination }> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminReport[]>>("/api/v1/admin/reports", {
      params,
    });
    return {
      reports: response.data.data || [],
      pagination: response.data.pagination || {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: response.data.data?.length || 0,
        totalPages: 1,
      },
    };
  },

  getReportById: async (id: string | number): Promise<AdminReport | null> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminReport>>(`/api/v1/admin/reports/${id}`);
    return response.data.data;
  },

  // 6. Companies & B2B
  getCompanies: async (): Promise<AdminCompany[]> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminCompany[]>>("/api/v1/admin/companies");
    return response.data.data || [];
  },

  getCompanyById: async (id: string): Promise<AdminCompany | null> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminCompany>>(`/api/v1/admin/companies/${id}`);
    return response.data.data;
  },

  createCompany: async (data: { name: string; slug: string }): Promise<AdminCompany> => {
    const response = await AxiosAPI.post<AdminApiResponse<AdminCompany>>("/api/v1/admin/companies", data);
    return response.data.data;
  },

  updateCompanyStatus: async (id: string, isActive: boolean): Promise<AdminCompany> => {
    const response = await AxiosAPI.patch<AdminApiResponse<AdminCompany>>(
      `/api/v1/admin/companies/${id}/status`,
      { isActive },
    );
    return response.data.data;
  },

  // API Keys
  getCompanyApiKeys: async (companyId: string): Promise<AdminApiKey[]> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminApiKey[]>>(
      `/api/v1/admin/companies/${companyId}/api-keys`,
    );
    return response.data.data || [];
  },

  createCompanyApiKey: async (
    companyId: string,
    data: { name?: string; expiresAt?: string | null },
  ): Promise<AdminApiKey> => {
    const response = await AxiosAPI.post<AdminApiResponse<AdminApiKey>>(
      `/api/v1/admin/companies/${companyId}/api-keys`,
      data,
    );
    return response.data.data;
  },

  revokeCompanyApiKey: async (companyId: string, apiKeyId: string): Promise<AdminApiKey> => {
    const response = await AxiosAPI.patch<AdminApiResponse<AdminApiKey>>(
      `/api/v1/admin/companies/${companyId}/api-keys/${apiKeyId}/revoke`,
    );
    return response.data.data;
  },

  // Candidates
  getCompanyCandidates: async (companyId: string): Promise<AdminCandidate[]> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminCandidate[]>>(
      `/api/v1/admin/companies/${companyId}/candidates`,
    );
    return response.data.data || [];
  },

  createCompanyCandidate: async (
    companyId: string,
    data: {
      externalId: string;
      firstName: string;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
    },
  ): Promise<AdminCandidate> => {
    const response = await AxiosAPI.post<AdminApiResponse<AdminCandidate>>(
      `/api/v1/admin/companies/${companyId}/candidates`,
      data,
    );
    return response.data.data;
  },

  getCompanyCandidateById: async (companyId: string, candidateId: string): Promise<AdminCandidate | null> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminCandidate>>(
      `/api/v1/admin/companies/${companyId}/candidates/${candidateId}`,
    );
    return response.data.data;
  },

  // 7. Questions
  getQuestions: async (
    params?: any,
  ): Promise<{ questions: AdminQuestion[]; pagination?: AdminPagination }> => {
    const response = await AxiosAPI.get<any>("/api/v1/questions/admin/all", {
      params,
    });
    const raw = response.data?.data;
    const questionsList: AdminQuestion[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(response.data)
      ? response.data
      : [];
    const pagination = raw?.pagination || response.data?.pagination;

    return {
      questions: questionsList,
      pagination,
    };
  },

  getQuestionById: async (id: string | number): Promise<AdminQuestion | null> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminQuestion>>(`/api/v1/questions/admin/${id}`);
    return response.data.data;
  },

  createQuestion: async (data: {
    questionTextAr: string;
    questionTextEn: string;
    technicalField: string;
    difficultyLevel: string;
    skillIds?: Array<string | number>;
  }): Promise<AdminQuestion> => {
    const response = await AxiosAPI.post<AdminApiResponse<AdminQuestion>>("/api/v1/questions/admin/create", data);
    return response.data.data;
  },

  updateQuestion: async (
    id: string | number,
    data: Partial<{
      questionTextAr: string;
      questionTextEn: string;
      technicalField: string;
      difficultyLevel: string;
      skillIds?: Array<string | number>;
      isActive?: boolean;
    }>,
  ): Promise<AdminQuestion> => {
    const response = await AxiosAPI.patch<AdminApiResponse<AdminQuestion>>(
      `/api/v1/questions/admin/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteQuestion: async (id: string | number): Promise<void> => {
    await AxiosAPI.delete(`/api/v1/questions/admin/${id}`);
  },

  // 8. Feedbacks
  getFeedbacks: async (
    params?: AdminFilterParams,
  ): Promise<{ feedbacks: AdminFeedback[]; pagination: AdminPagination }> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminFeedback[]>>("/api/v1/admin/feedbacks", {
      params,
    });
    return {
      feedbacks: response.data.data || [],
      pagination: response.data.pagination || {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: response.data.data?.length || 0,
        totalPages: 1,
      },
    };
  },

  getFeedbackById: async (id: string | number): Promise<AdminFeedback | null> => {
    const response = await AxiosAPI.get<AdminApiResponse<AdminFeedback>>(`/api/v1/admin/feedbacks/${id}`);
    return response.data.data;
  },

  deleteFeedback: async (id: string | number): Promise<void> => {
    await AxiosAPI.delete(`/api/v1/admin/feedbacks/delete/${id}`);
  },
};

