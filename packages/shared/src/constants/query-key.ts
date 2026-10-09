export const skillsKey = {
  All: ["skills"] as const,
  details: () => [...skillsKey.All, "detail"] as const,
  detail: (id: string) => [...skillsKey.details(), id] as const,
};

export const USER_INFO_QUERY_KEY = ["user", "me"] as const;

export const adminQueryKeys = {
  interviews: (params?: any) => ["admin", "interviews", params] as const,
  interview: (id: string | number) => ["admin", "interview", id] as const,
  users: (params?: any) => ["admin", "users", params] as const,
  user: (id: string) => ["admin", "user", id] as const,
  aiRequests: (params?: any) => ["admin", "ai-requests", params] as const,
  aiRequest: (id: string | number) => ["admin", "ai-request", id] as const,
  violations: (params?: any) => ["admin", "violations", params] as const,
  violation: (id: string | number) => ["admin", "violation", id] as const,
  reports: (params?: any) => ["admin", "reports", params] as const,
  report: (id: string | number) => ["admin", "report", id] as const,
  companies: () => ["admin", "companies"] as const,
  company: (id: string) => ["admin", "company", id] as const,
  companyApiKeys: (companyId: string) => ["admin", "company", companyId, "api-keys"] as const,
  companyCandidates: (companyId: string) => ["admin", "company", companyId, "candidates"] as const,
  questions: (params?: any) => ["admin", "questions", params] as const,
  question: (id: string | number) => ["admin", "question", id] as const,
  feedbacks: (params?: any) => ["admin", "feedbacks", params] as const,
  feedback: (id: string | number) => ["admin", "feedback", id] as const,
};
