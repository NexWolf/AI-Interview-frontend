import type { DifficultyLevelType } from "./allSkills";
import type { ProficiencyLevel } from "./userSkills";

export interface DashboardSkillProgress {
  skillId: string;
  name: string;
  difficultyLevel: DifficultyLevelType;
  proficiencyLevel: ProficiencyLevel | null;
  score: number | string | null;
  isSelfAssessed: boolean;
  assessedByAi: boolean;
  lastAssessedAt: string | null;
}

export interface DashboardApi {
  totalInterviews: number;
  averageScore: number | string | null;
  skillProgress: DashboardSkillProgress[];
}

/* Response envelope of GET /api/v1/users/me/dashboard → data.dashboard */
export interface DashboardResponse {
  dashboard: DashboardApi;
}