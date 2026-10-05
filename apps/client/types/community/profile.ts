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

export type RoleStatus = "ADMIN" | "USER" | "SUPER_ADMIN"

export interface EducationApi {
    id?: string,
    institution: string,     // اسم الجامعة
    degree: string | null,          // الدرجة العلمية
    fieldOfStudy: string | null,    // التخصص
    startDate: string,       // ISO Date or "YYYY-MM"
    endDate?: string | null,        // ISO Date or "YYYY-MM" (Optional if isCurrent)
    isCurrent: boolean,      // يدرس حالياً
    description?: string | null,    // الوصف (اختياري)
    createdAt?: string,
    updatedAt?: string,
};

export interface UserSkillApi {
    skillId: string,
    name: string,
    proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert" | null,
    isSelfAssessed: boolean,
    assessedByAi: boolean,
    aiAssessmentScore: number | string | null,
    lastAssessedAt: string | null,
}

export interface UserInfoApi {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    userName: string,
    phoneNumber: string | null,
    avatarUrl: string | null,
    avatarPublicId: string | null,
    bio: string | null,
    socialLinks: string[],
    onboardingDone: boolean,
    educations: EducationApi[],
    skills: UserSkillApi[],
    isVerified: boolean,
    lang: string | null,
    role: RoleStatus,
    authProvider: string,
    createdAt: string,
    updatedAt: string,
}

