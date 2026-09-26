import { DifficultyLevelType } from "@/shared/types/allSkills";
import { ProficiencyLevel } from "@/shared/types/userSkills";

export interface SkillApi {
    id: number,
    name: string;            // اسم المهارة (مثل: TypeScript)
    level?: 'Beginner' | 'Intermediate' | 'Expert' | "Not Assessed"; // المستوى (اختياري)
};

export type EducationItem = {
  institution: string;
  fieldOfStudy: string;
  degree?: number | string | null;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
};

export type BasicData = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
};

export type BioData = {
  avatar?: File | null;
  bio?: string;
  socialLink?: string;
};

export type ProfileData = {
  basicData: BasicData;
  bioData: BioData;
  education: EducationItem[];
  skills: string[];
  isVerified?: boolean;
};



/******************************** */
/* DATAA TYPE FROM API */
export interface EducationApi {
  id : string,
  userId : string,
  institution : string,
  degree : string,
  fieldOfStudy : string,
  endDate : string,
  startDate : string,
  isCurrent : boolean,
  description : string,
  createdAt : string,
  updatedAt : string,
}

export interface socialLinksApi  {
  value : string
}

export interface SkillsApiData {
  skillId : string,
  name : string,
  proficiencyLevel : ProficiencyLevel | null,
  isSelfAssessed : boolean,
  assessedByAi : boolean,
  aiAssessmentScore : number | string | null,
  lastAssessedAt : string | null,
}

export interface ProfileApi {
  id : string,
  email : string,
  firstName : string,
  lastName : string,
  userName : string,
  phoneNumber : string | null,
  bio : string | null,
  avatarUrl : string | null,
  avatarPublicId : string | null,
  socialLinks : string[],
  onboardingDone : boolean,
  skills : SkillsApiData[],
  isVerified : boolean,
  lang : string | null,
  role : "USER" | "ADMIN",
  authProvider : "LOCAL" | "GOOGLE" | "FACEBOOK" | "GITHUB",
  createdAt : string,
  updatedAt : string,
  educations : EducationApi[],
  learningJourney?: {
    specializationName: string | null,
    currentLevel: number,
    xp: number,
    levels: {
      levelNumber: number,
      title: string,
      tasks: {
        id: string,
        title: string,
        description: string,
        submissionUrl: string | null,
        defenseScore: number | null,
        completedAt: string | null,
        aiEvaluation?: { feedback?: string } | null,
      }[],
    }[],
  } | null,
}

export interface defaultProfile {
  id : string,
  email : string,
  firstName : string,
  lastName : string,
  userName : string,
  phoneNumber : string,
  bio : string,
  avatarUrl : string,
  avatarPublicId : string,
  socialLinks : socialLinksApi[],
  onboardingDone : boolean,
  skills : string[],
  isVerified : boolean,
  lang : string,
  role : "USER" | "ADMIN",
  authProvider : "LOCAL" | "GOOGLE" | "FACEBOOK" | "GITHUB",
  createdAt : string,
  updatedAt : string,
  education : EducationApi[]
}
/******************************** */

/* PROFILE BIO DATA TYPE */
export interface ProfileBasicType {
  email : string,
  firstName : string,
  lastName : string,
  userName : string,
  phoneNumber : string,
}

export interface ProfileBioType {
  bio : string,
  avatarUrl : string,
  avatarPublicId : string,
  socialLinks : string,
}


/******************************* */
/* PROFIEL UPDATE */
export interface ProfileHeaderUpdate {
  firstName : string,
  lastName : string,
  userName : string,
  bio : string,
  phoneNumber : string,
  socialLinks : string[]
}
/******************************* */
