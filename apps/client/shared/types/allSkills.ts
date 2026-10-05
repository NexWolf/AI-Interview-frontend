export type DifficultyLevelType = "Beginner" | "Intermediate" | "Advanced";

export interface AllSkills {
   id : string,
   name : string,
   difficultyLevel : DifficultyLevelType,
   isActive : boolean,
   createdAt : string,
}

export interface AdminSkill {
  id: string;
  nameAr: string;
  nameEn: string;
  difficultyLevel: DifficultyLevelType;
  descriptionAr: string | null;
  descriptionEn: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSkillPayload {
  nameAr: string;
  nameEn: string;
  difficultyLevel: DifficultyLevelType;
  descriptionAr?: string;
  descriptionEn?: string;
}