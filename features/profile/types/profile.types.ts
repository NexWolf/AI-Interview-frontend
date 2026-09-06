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

export interface ProfileApi {
  id : string,
  email : string,
  firstName : string,
  lastName : string,
  userName : string,
  phoneNumber : string,
  bio : string,
  avatarUrl : string,
  avatarPublicId : string,
  socialLinks : string,
  onboardingDone : boolean,
  skills : string[],
  isVerified : boolean,
  lang : string,
  role : "USER" | "ADMIN",
  authProvider : "LOCAL" | "GOOGLE" | "FACEBOOK" | "GITHUB",
  createdAt : string,
  updatedAt : string,
  educations : EducationApi[]
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