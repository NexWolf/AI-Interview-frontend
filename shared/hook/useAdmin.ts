import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/shared/services/admin.service";
import { AdminFilterParams, AdminUser } from "@/shared/types/admin";
import { toast } from "sonner";

export const adminQueryKeys = {
  interviews: (params?: AdminFilterParams) => ["admin", "interviews", params] as const,
  interview: (id: string | number) => ["admin", "interview", id] as const,
  users: (params?: AdminFilterParams) => ["admin", "users", params] as const,
  user: (id: string) => ["admin", "user", id] as const,
  aiRequests: (params?: AdminFilterParams) => ["admin", "ai-requests", params] as const,
  aiRequest: (id: string | number) => ["admin", "ai-request", id] as const,
  violations: (params?: AdminFilterParams) => ["admin", "violations", params] as const,
  violation: (id: string | number) => ["admin", "violation", id] as const,
  reports: (params?: AdminFilterParams) => ["admin", "reports", params] as const,
  report: (id: string | number) => ["admin", "report", id] as const,
};

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
      toast.error(err?.response?.data?.message || "Failed to update user status");
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
      toast.error(err?.response?.data?.message || "Failed to delete user");
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
      toast.error(err?.response?.data?.message || "Failed to create user");
    },
  });
}

// 3. AI Requests Hooks
export function useAdminAIRequests(params?: AdminFilterParams) {
  return useQuery({
    queryKey: adminQueryKeys.aiRequests(params),
    queryFn: () => adminService.getAIRequests(params),
    staleTime: 45 * 1000,
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
    staleTime: 45 * 1000,
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
