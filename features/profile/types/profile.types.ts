export interface SkillApi {
    id: number,
    name: string;            // اسم المهارة (مثل: TypeScript)
    level?: 'Beginner' | 'Intermediate' | 'Expert'; // المستوى (اختياري)
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