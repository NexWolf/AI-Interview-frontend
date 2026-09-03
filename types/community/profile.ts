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
    degree: string;          // الدرجة العلمية
    fieldOfStudy: string;    // التخصص
    startDate: string;       // ISO Date or "YYYY-MM"
    endDate?: string;        // ISO Date or "YYYY-MM" (Optional if isCurrent)
    isCurrent: boolean;      // يدرس حالياً
    description?: string;    // الوصف (اختياري)
};

export interface UserInfoApi {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    userName: string,
    avatar: File | null,
    phoneNumber?: string | null,
    bio: string | null,
    education: EducationApi[],
    skills: string[],
    isVerified: boolean,
    lang: string | null,
    role: RoleStatus,
    authProvider: string,
    createdAt: string,
    updatedAt: string,
}

