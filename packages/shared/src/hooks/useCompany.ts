import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companyService } from "../services/company.service";
import { companyQueryKeys } from "../constants/query-key";
import {
  CreatePortalCandidatePayload,
  CreatePortalInterviewPayload,
  CreatePortalApiKeyPayload,
} from "../types/company";
import { toast } from "sonner";

export { companyQueryKeys };

// 1. Company Profile
export function useCompanyProfile() {
  return useQuery({
    queryKey: companyQueryKeys.profile,
    queryFn: () => companyService.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
}

// 2. Overview Stats
export function useCompanyOverview() {
  return useQuery({
    queryKey: companyQueryKeys.overview,
    queryFn: () => companyService.getOverview(),
    staleTime: 30 * 1000,
  });
}

// 3. Candidates (Portal)
export function usePortalCandidates() {
  return useQuery({
    queryKey: companyQueryKeys.candidates(),
    queryFn: () => companyService.getCandidates(),
    staleTime: 30 * 1000,
  });
}

export function useCreatePortalCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePortalCandidatePayload) =>
      companyService.createCandidate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.candidates() });
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.overview });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create candidate");
    },
  });
}

// 4. Interviews & Assessments (Portal)
export function usePortalInterviews() {
  return useQuery({
    queryKey: companyQueryKeys.interviews(),
    queryFn: () => companyService.getInterviews(),
    staleTime: 30 * 1000,
  });
}

export function useCreatePortalInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePortalInterviewPayload) =>
      companyService.createInterview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.interviews() });
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.candidates() });
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.overview });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create interview invitation");
    },
  });
}

export function usePortalInterviewResult(id: string | number | null) {
  return useQuery({
    queryKey: companyQueryKeys.interviewResult(id || ""),
    queryFn: () => (id ? companyService.getInterviewResult(id) : null),
    enabled: Boolean(id),
  });
}

// 5. API Keys (Portal)
export function usePortalApiKeys() {
  return useQuery({
    queryKey: companyQueryKeys.apiKeys(),
    queryFn: () => companyService.listApiKeys(),
    staleTime: 30 * 1000,
  });
}

export function useCreatePortalApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePortalApiKeyPayload) =>
      companyService.createApiKey(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.apiKeys() });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to generate API key");
    },
  });
}

export function useRevokePortalApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => companyService.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.apiKeys() });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to revoke API key");
    },
  });
}
