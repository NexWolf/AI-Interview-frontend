// Enums الخاصة بالمهارات والتقييم — aligned with backend Prisma enums
export type ProficiencyLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

// المهارة الأساسية المرتبطة
export interface BaseSkill {
  id: string;
  name: string; // تم ربطها بـ nameEn من الباك إند
  difficultyLevel: DifficultyLevel;
}

// عنصر مهارة المستخدم المعادة من الـ API
export interface UserSkillItem {
  skillId: string;
  proficiencyLevel: ProficiencyLevel;
  isSelfAssessed: boolean;
  assessedByAi: boolean;
  aiAssessmentScore: number | null; // قد تكون null في حال عدم وجود تقييم
  lastAssessedAt: string | null; // تاريخ ISO String
  skill: BaseSkill;
}

// الهيكل الكامل للاستجابة القادمة من Axios (API Response Envelope)
export interface GetUserSkillsApiResponse {
  status: string;
  data: {
    skills: UserSkillItem[];
  };
}