import { AxiosAPI } from "@/shared/lib/AxiosAPI";
import {
  AdminAIRequest,
  AdminFilterParams,
  AdminInterview,
  AdminPagination,
  AdminReport,
  AdminUser,
  AdminViolation,
} from "@/shared/types/admin";

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
};
