export interface CompanyOverviewStats {
  company: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
  totalCandidates: number;
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  recentInterviews: Array<{
    id: string;
    candidateName: string;
    candidateEmail: string | null;
    status: string;
    difficultyLevel: string;
    score: number | null;
    createdAt: string;
  }>;
}

export interface CompanyCandidateItem {
  id: string;
  externalId: string;
  name: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  interviewsCount: number;
  latestInterview: {
    id: string;
    status: string;
    difficultyLevel: string;
    score: number | null;
    createdAt: string;
  } | null;
}

export interface CreatePortalCandidatePayload {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  externalId?: string;
}

export interface CompanyInterviewItem {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string | null;
  candidatePhone: string | null;
  status: string;
  difficultyLevel: string;
  duration?: number;
  jobDescription: string | null;
  createdAt: string;
  skills: Array<{
    id: string;
    nameEn: string;
    nameAr: string;
  }>;
  score: number | null;
  invitationUrl?: string;
  report: {
    id: string;
    overallScore: number;
    currentLevel?: string;
    recommendedNextLevel?: string;
    strengths?: string;
    weaknesses?: string;
    improvementPlan?: string;
    recommendations?: string;
  } | null;
}

export interface CreatePortalInterviewPayload {
  candidateId?: string;
  difficultyLevel?: string;
  duration?: number;
  skillIds?: number[];
  interviewLanguage?: string;
  jobDescription?: string;
}

export interface CompanyApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  key?: string; // only available immediately after creation
  expiresAt: string | null;
  revokedAt: string | null;
  isRevoked: boolean;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface CreatePortalApiKeyPayload {
  name: string;
  expiresAt?: string | null;
}

export interface CompanyProfileData {
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    companyId?: string;
  };
  company: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
}
