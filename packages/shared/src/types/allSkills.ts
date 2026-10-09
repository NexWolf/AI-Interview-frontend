export type DifficultyLevelType = "Beginner" | "Intermediate" | "Advanced";

export interface AllSkills {
  id: string;
  name: string;
  nameEn?: string;
  nameAr?: string;
  difficultyLevel: DifficultyLevelType;
  isActive: boolean;
  createdAt: string;
}

export interface AdminSkill {
  id: string;
  name?: string;
  nameEn: string;
  nameAr?: string | null;
  difficultyLevel: DifficultyLevelType;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSkillPayload {
  nameEn: string;
  nameAr?: string;
  difficultyLevel?: DifficultyLevelType;
  descriptionAr?: string;
  descriptionEn?: string;
}
