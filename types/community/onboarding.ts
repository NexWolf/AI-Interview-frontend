export interface BioInfoApi {
    avatar: string,
    headline: string,
    bio: string,
}

export interface SkillApi {
    id: number,
    name: string;            // اسم المهارة (مثل: TypeScript)
    level?: 'Beginner' | 'Intermediate' | 'Expert'; // المستوى (اختياري)
};

export type RoleStatus = "ADMIN" | "USER"

export interface EducationApi {
    institution: string;     // اسم الجامعة
    degree: number | null;          // الدرجة العلمية
    fieldOfStudy: string;    // التخصص
    startDate: string;       // ISO Date or "YYYY-MM"
    endDate?: string;        // ISO Date or "YYYY-MM" (Optional if isCurrent)
    isCurrent: boolean;      // يدرس حالياً
    description?: string;    // الوصف (اختياري)
};

export interface BasicApi {
    email: string,
    firstName: string,
    lastName: string,
    userName: string,
    phoneNumber?: string | null,
}

export interface BioApi {
    avatar: File | null,
    bio: string | null,
    socialLink : string | null,
}
export interface profileSetup {
    id: number | null,
    basicData  : BasicApi,
    bioData : BioApi
    education: EducationApi[],
    skills: string[],
    isVerified: boolean,
    lang: string | null,
    role: RoleStatus,
    authProvider: string,
    createdAt: string,
    updatedAt: string,
}

export interface UserInfoApi {
    id : string,
    email : string,
    firstName : string,
    lastName : string,
    userName : string,
    phoneNumber : string | null,
    bio : string | null,
    avatarUrl : string | null,
    socialLinks : string | null,
    isVerified : boolean,
    lang : string | null,
    authProvier : "LOCAL",
    createdAt : string,
    updatedAt : string,
}