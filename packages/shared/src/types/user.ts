export type RoleStatus = "ADMIN" | "USER" | "SUPER_ADMIN";

export interface EducationApi {
  id?: string;
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSkillApi {
  skillId: string;
  name: string;
  proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert" | null;
  isSelfAssessed: boolean;
  assessedByAi: boolean;
  aiAssessmentScore: number | string | null;
  lastAssessedAt: string | null;
}

export interface UserSkillItem {
  id: string | number;
  skillId: number;
  userId: string;
  proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  isSelfAssessed: boolean;
  assessedByAi: boolean;
  aiAssessmentScore?: number | null;
  lastAssessedAt?: string | null;
  skill?: {
    id: number;
    name: string;
    difficultyLevel: string;
  };
}

export interface UserInfoApi {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  bio: string | null;
  socialLinks: string[];
  onboardingDone: boolean;
  educations: EducationApi[];
  skills: UserSkillApi[];
  isVerified: boolean;
  lang: string | null;
  role: RoleStatus;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
}
