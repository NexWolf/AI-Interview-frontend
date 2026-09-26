import { AxiosAPI } from "@/shared/lib/AxiosAPI";

export type PartnerOrganization = { id: string; name: string; websiteUrl?: string | null; apiKeyPrefix: string; isActive: boolean; createdAt: string; _count: { invitations: number } };
export type PartnerInvitation = { id: string; candidateName: string; candidateEmail: string; roleTitle: string; specialization: string; difficulty: string; status: string; overallScore?: number | null; feedback?: { summary?: string; strengths?: string[]; concerns?: string[]; recommendation?: string } | null; expiresAt: string; completedAt?: string | null; createdAt: string };

export const partnerService = {
  organizations: async (): Promise<PartnerOrganization[]> => (await AxiosAPI.get("/api/v1/partners/organizations")).data.data.organizations,
  create: async (data: { name: string; websiteUrl?: string }) => (await AxiosAPI.post("/api/v1/partners/organizations", data)).data.data as { organization: PartnerOrganization; apiKey: string },
  invitations: async (organizationId: string): Promise<PartnerInvitation[]> => (await AxiosAPI.get(`/api/v1/partners/organizations/${organizationId}/invitations`)).data.data.invitations,
};
