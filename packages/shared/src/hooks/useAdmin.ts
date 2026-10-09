import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/admin.service";
import { AdminFilterParams, AdminUser } from "../types/admin";
import { adminQueryKeys } from "../constants/query-key";
import { toast } from "sonner";

export { adminQueryKeys };

// 1. Interviews Hooks
export function useAdminInterviews(params?: AdminFilterParams) {
  return useQuery({
    queryKey: adminQueryKeys.interviews(params),
    queryFn: () => adminService.getInterviews(params),
    staleTime: 60 * 1000,
  });
}

export function useAdminInterviewDetails(id: string | number | null) {
  return useQuery({
    queryKey: adminQueryKeys.interview(id || ""),
    queryFn: () => (id ? adminService.getInterviewById(id) : null),
    enabled: Boolean(id),
  });
}

// 2. Users Hooks
export function useAdminUsers(params?: AdminFilterParams) {
  return useQuery({
    queryKey: adminQueryKeys.users(params),
    queryFn: () => adminService.getUsers(params),
    staleTime: 60 * 1000,
  });
}

export function useAdminUserDetails(id: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.user(id || ""),
    queryFn: () => (id ? adminService.getUserById(id) : null),
    enabled: Boolean(id),
  });
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.updateUserStatus(id, isActive),
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success(isActive ? "User account activated" : "User account suspended");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update user status");
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete user");
    },
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdminUser>) => adminService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create user");
    },
  });
}

// 3. AI Requests Hooks
export function useAdminAIRequests(params?: AdminFilterParams) {
  return useQuery({
    queryKey: adminQueryKeys.aiRequests(params),
    queryFn: () => adminService.getAIRequests(params),
    staleTime: 60 * 1000,
  });
}

export function useAdminAIRequestDetails(id: string | number | null) {
  return useQuery({
    queryKey: adminQueryKeys.aiRequest(id || ""),
    queryFn: () => (id ? adminService.getAIRequestById(id) : null),
    enabled: Boolean(id),
  });
}

// 4. Violations Hooks
export function useAdminViolations(params?: AdminFilterParams) {
  return useQuery({
    queryKey: adminQueryKeys.violations(params),
    queryFn: () => adminService.getViolations(params),
    staleTime: 60 * 1000,
  });
}

export function useAdminViolationDetails(id: string | number | null) {
  return useQuery({
    queryKey: adminQueryKeys.violation(id || ""),
    queryFn: () => (id ? adminService.getViolationById(id) : null),
    enabled: Boolean(id),
  });
}

// 5. Reports Hooks
export function useAdminReports(params?: AdminFilterParams) {
  return useQuery({
    queryKey: adminQueryKeys.reports(params),
    queryFn: () => adminService.getReports(params),
    staleTime: 60 * 1000,
  });
}

export function useAdminReportDetails(id: string | number | null) {
  return useQuery({
    queryKey: adminQueryKeys.report(id || ""),
    queryFn: () => (id ? adminService.getReportById(id) : null),
    enabled: Boolean(id),
  });
}

// 6. Companies Hooks
export function useAdminCompanies() {
  return useQuery({
    queryKey: adminQueryKeys.companies(),
    queryFn: () => adminService.getCompanies(),
    staleTime: 60 * 1000,
  });
}

export function useAdminCompanyDetails(id: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.company(id || ""),
    queryFn: () => (id ? adminService.getCompanyById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; slug: string }) => adminService.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      toast.success("Company created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create company");
    },
  });
}

export function useUpdateCompanyStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.updateCompanyStatus(id, isActive),
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      toast.success(isActive ? "Company activated" : "Company deactivated");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update company status");
    },
  });
}

// API Keys Hooks
export function useCompanyApiKeys(companyId: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.companyApiKeys(companyId || ""),
    queryFn: () => (companyId ? adminService.getCompanyApiKeys(companyId) : []),
    enabled: Boolean(companyId),
  });
}

export function useCreateApiKeyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      companyId,
      data,
    }: {
      companyId: string;
      data: { name?: string; expiresAt?: string | null };
    }) => adminService.createCompanyApiKey(companyId, data),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "company", companyId, "api-keys"],
      });
      toast.success("API key generated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create API key");
    },
  });
}

export function useRevokeApiKeyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      companyId,
      apiKeyId,
    }: {
      companyId: string;
      apiKeyId: string;
    }) => adminService.revokeCompanyApiKey(companyId, apiKeyId),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "company", companyId, "api-keys"],
      });
      toast.success("API key revoked");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to revoke API key");
    },
  });
}

// Candidates Hooks
export function useCompanyCandidates(companyId: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.companyCandidates(companyId || ""),
    queryFn: () => (companyId ? adminService.getCompanyCandidates(companyId) : []),
    enabled: Boolean(companyId),
  });
}

export function useCreateCandidateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      companyId,
      data,
    }: {
      companyId: string;
      data: {
        externalId: string;
        firstName: string;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
      };
    }) => adminService.createCompanyCandidate(companyId, data),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "company", companyId, "candidates"],
      });
      toast.success("Candidate added successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add candidate");
    },
  });
}

// 7. Questions Hooks
export function useAdminQuestions(params?: any) {
  return useQuery({
    queryKey: adminQueryKeys.questions(params),
    queryFn: () => adminService.getQuestions(params),
    staleTime: 60 * 1000,
  });
}

export function useAdminQuestionDetails(id: string | number | null) {
  return useQuery({
    queryKey: adminQueryKeys.question(id || ""),
    queryFn: () => (id ? adminService.getQuestionById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      questionTextAr: string;
      questionTextEn: string;
      technicalField: string;
      difficultyLevel: string;
      skillIds?: Array<string | number>;
    }) => adminService.createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "questions"] });
      toast.success("Question created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create question");
    },
  });
}

export function useUpdateQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: any;
    }) => adminService.updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "questions"] });
      toast.success("Question updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update question");
    },
  });
}

export function useDeleteQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => adminService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "questions"] });
      toast.success("Question deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete question");
    },
  });
}

// 8. Feedbacks Hooks
export function useAdminFeedbacks(params?: AdminFilterParams) {
  return useQuery({
    queryKey: adminQueryKeys.feedbacks(params),
    queryFn: () => adminService.getFeedbacks(params),
    staleTime: 60 * 1000,
  });
}

export function useAdminFeedbackDetails(id: string | number | null) {
  return useQuery({
    queryKey: adminQueryKeys.feedback(id || ""),
    queryFn: () => (id ? adminService.getFeedbackById(id) : null),
    enabled: Boolean(id),
  });
}

export function useDeleteFeedbackMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => adminService.deleteFeedback(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "feedbacks"] });
      toast.success("Feedback deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete feedback");
    },
  });
}

