export interface EducationApi {
    institution: string;     // اسم الجامعة
    degree: string | null;          // الدرجة العلمية
    fieldOfStudy: string;    // التخصص
    startDate: string;       // ISO Date or "YYYY-MM"
    endDate?: string;        // ISO Date or "YYYY-MM" (Optional if isCurrent)
    isCurrent: boolean;      // يدرس حالياً
    description?: string;    // الوصف (اختياري)
};

export interface BasicApi {
    firstName: string,
    lastName: string,
    phoneNumber?: string | null,
}

export interface BioApi {
    avatar: File | null,
    bio: string | null,
    socialLink: string[], //ADD AS {LINKEDIN , GITHUB , PORTFOLIO , ANOTHER}
}

export interface OnboardingPostApi {
    basicData: BasicApi,
    bioData: BioApi
    education: EducationApi[],
    skills: string[],
}


/***************************************************** */
/* ONBOARDIGN FORM DATA TYPE */
/***************************************************** */

export interface BasicForm {
    firstName: string,
    lastName: string,
    phoneNumber?: string | null,
    userName : string,
    email : string,
}

export interface OnboardingForm {
        basicData  : BasicForm,
        bioData : BioApi
        education: EducationApi[],
        skills: string[],
}



/*************************************************** */
/* POST API REQUEST TYPE */
export interface OnboardingService {
  phoneNumber?: string | null;
  bio?: string | null;
  avatarUrl?: File | string | null;
  socialLinks?: string | null;
  skills : string[];
  education ?: EducationApi[];
}
/*************************************************** */

/*************************************************** */
/* type data for IndexedDB  */
export interface IndexedDBType {
    firstName : string,
    lastName : string,
    email : string,
    userName : string,
  phoneNumber?: string | null;
  bio?: string | null;
  avatarUrl?: File | string | null;
  socialLinks?: string | null;
  skills : string[];
  education ?: EducationApi[];
}
/*************************************************** */