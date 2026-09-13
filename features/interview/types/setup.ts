import type { DifficultyLevelType } from "@/shared/types/allSkills";

export type InterviewLevel = "Beginner" | "Intermediate" | "Advanced";
export type InterviewLanguage = "English" | "Arabic";
export type ModeType = "skills_only" | "job_description";
export type DifficultyLevel = DifficultyLevelType;

export type SkillsType = {
  id: string;
  name: string;
  difficultyLevel: DifficultyLevel;
};

export interface setupInterview {
  interviewLanguage: InterviewLanguage;
  mode: ModeType;
  job_description?: string;
  skillsIds: string[];
  difficultyLevel: InterviewLevel;
  duration: number;
}

/**********************************/
/* DATA MUST SEND TO BACKEND */
export interface StartInterviewPayload {
  difficultyLevel: InterviewLevel;
  interviewLanguage: InterviewLanguage;
  mode: ModeType;
  duration: number;
  job_description?: string;
  skillIds: string[];
}
/**********************************/