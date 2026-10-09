export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminUserRef {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  email: string;
}

export interface AdminUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  email: string;
  phoneNumber?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
  isVerified: boolean;
  onboardingDone?: boolean;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    interviews: number;
    payments: number;
  };
  interviews?: Array<{
    id: string | number;
    status: string;
    difficultyLevel: string;
    interviewLanguage: string;
    startTime: string | null;
    endTime: string | null;
    duration: number | null;
    createdAt: string;
    reports?: Array<{
      id: string | number;
      overallScore: number | null;
      currentLevel: string | null;
    }>;
  }>;
  payments?: Array<{
    id: string | number;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    paidAt: string | null;
    createdAt: string;
  }>;
}

export interface AdminSkillRef {
  skill: {
    id: string | number;
    nameEn: string;
    nameAr: string;
    difficultyLevel?: string;
    descriptionEn?: string;
    descriptionAr?: string;
  };
}

export interface AdminQuestionRef {
  id: string | number;
  questionOrder: number;
  question?: {
    id: string | number;
    contentEn?: string;
    contentAr?: string;
    type?: string;
    difficultyLevel?: string;
  } | null;
  aiQuestionTextEn?: string | null;
  aiQuestionTextAr?: string | null;
  answers?: Array<{
    id: string | number;
    answerText?: string;
    candidateAnswer?: string;
    score?: number | null;
    feedback?: string | null;
    feedbackEn?: string | null;
    feedbackAr?: string | null;
    durationSeconds?: number | null;
  }>;
}

export interface AdminInterview {
  id: string | number;
  status: "Pending" | "Running" | "Completed" | "Paused" | "Failed" | string;
  interviewLanguage: string;
  difficultyLevel: string;
  startTime: string | null;
  endTime: string | null;
  duration: number | null;
  createdAt: string;
  user: AdminUserRef;
  interviewSkills?: AdminSkillRef[];
  reports?: Array<{
    id: string | number;
    overallScore: number | null;
    currentLevel?: string | null;
    summaryEn?: string | null;
    summaryAr?: string | null;
  }>;
  interviewQuestions?: AdminQuestionRef[];
  requests?: Array<{
    id: string | number;
    requestType: string;
    status: string;
    promptTokens: number | null;
    completionTokens: number | null;
    totalTokens: number | null;
    latencyMs: number | null;
    createdAt: string;
  }>;
}

export interface AdminReport {
  id: string | number;
  overallScore: number | null;
  technicalKnowledgeScore?: number | null;
  communicationScore?: number | null;
  confidenceScore?: number | null;
  problemSolvingScore?: number | null;
  currentLevel?: string | null;
  recommendedNextLevel?: string | null;
  summaryEn?: string | null;
  summaryAr?: string | null;
  strengths?: string | string[] | null;
  weaknesses?: string | string[] | null;
  improvementPlan?: string | null;
  areasForImprovement?: string | string[] | null;
  createdAt: string;
  user: AdminUserRef;
  interview: {
    id: string | number;
    status: string;
    interviewLanguage: string;
    difficultyLevel: string;
    startTime: string | null;
    endTime: string | null;
    duration: number | null;
  };
}

export interface AdminAIRequest {
  id: string | number;
  requestType: string;
  status: "SUCCESS" | "FAILED" | "PENDING" | string;
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
  latencyMs: number | null;
  createdAt: string;
  errorMessage?: string | null;
  promptPayload?: string | null;
  responsePayload?: string | null;
  conversation?: {
    provider: string;
    model: string;
  };
  interview?: {
    id: string | number;
    user: AdminUserRef;
  };
}

export interface AdminViolation {
  id: string | number;
  userId: string;
  interviewId: string | number;
  category: "TAB_SWITCH" | "MULTIPLE_FACES" | "NO_FACE" | "AUDIO_ANOMALY" | "FULLSCREEN_EXIT" | string;
  violationType: string;
  details?: string | null;
  isCheating: boolean;
  isTechnicalIssue: boolean;
  occurredAt: string;
  user: AdminUserRef;
  interview: {
    id: string | number;
    status: string;
    interviewLanguage: string;
    difficultyLevel: string;
    startTime: string | null;
    endTime: string | null;
    duration?: number | null;
  };
}

export interface AdminFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  user?: string;
  status?: string;
  language?: string;
  skill?: string;
  date?: string;
  role?: string;
  provider?: string;
  requestType?: string;
  category?: string;
  violationType?: string;
  isCheating?: string | boolean;
  isTechnicalIssue?: string | boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// 6. Companies & B2B Integration
export interface AdminCompany {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    apiKeys?: number;
    candidates?: number;
    interviews?: number;
  };
}

export interface AdminApiKey {
  id: string;
  companyId: string;
  name: string;
  keyPrefix: string;
  expiresAt: string | null;
  revokedAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt?: string;
  rawKey?: string; // returned only upon creation
}

export interface AdminCandidate {
  id: string;
  companyId: string;
  externalId: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// 7. Questions
export interface AdminQuestion {
  id: string | number;
  questionTextAr: string;
  questionTextEn: string;
  technicalField: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
  isActive: boolean;
  source: "AI" | "Admin";
  primarySkillId?: string | number | null;
  primarySkill?: {
    id: string | number;
    nameEn: string;
    nameAr: string;
  } | null;
  questionSkills?: Array<{
    skillId: string | number;
    skill: {
      id: string | number;
      nameEn: string;
      nameAr: string;
    };
  }>;
  createdAt: string;
  updatedAt?: string;
}

// 8. Feedbacks
export interface AdminFeedback {
  id: string | number;
  userId: string;
  interviewId: string | number;
  rating: number;
  commentAr?: string | null;
  commentEn?: string | null;
  category: "General" | "Interview_Quality" | "AI_Accuracy" | string;
  status: "Pending" | "Reviewed" | "Resolved";
  adminId?: string | null;
  createdAt: string;
  respondedAt?: string | null;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    userName: string | null;
    email: string;
    avatarUrl?: string | null;
  } | null;
  interview?: {
    id: string | number;
    difficultyLevel: string;
    status: string;
    interviewLanguage: string;
  } | null;
}
