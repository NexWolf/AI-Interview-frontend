"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ar";
export type Direction = "ltr" | "rtl";

export const companyTranslations = {
  en: {
    // Brand & General
    "brand.name": "NexWolf Business",
    "brand.tagline": "Enterprise Hiring",
    "brand.badge": "Enterprise Recruiter Portal",
    "portal.badge": "Enterprise Portal",
    "portal.candidateRoom": "Candidate Room",

    // Navigation
    "nav.workspace": "Workspace",
    "nav.overview": "Overview",
    "nav.candidates": "Candidates",
    "nav.assessments": "Assessments",
    "nav.integrations": "Integrations",
    "nav.settings": "Settings",

    // Header & Actions
    "header.signOut": "Sign Out",
    "header.signingOut": "Signing Out...",
    "header.signedOutSuccess": "Signed out successfully",
    "header.themeToggle": "Toggle Theme",
    "header.langToggle": "العربية",

    // Auth & Login
    "login.title": "NexWolf Business",
    "login.subtitle": "Sign in with your company recruiter credentials to manage candidates and AI assessments.",
    "login.badge": "Employer Command Center",
    "login.emailLabel": "Work Email Address",
    "login.emailPlaceholder": "company@gmail.com",
    "login.passwordLabel": "Password",
    "login.submit": "Sign In to Employer Workspace",
    "login.loading": "Verifying credentials...",
    "login.securityNote": "Protected by NexWolf Enterprise Security",
    "login.welcomeBack": "Welcome back! Accessing",

    // Overview Tab
    "overview.welcome": "Welcome back, Recruiter",
    "overview.subtitle": "Here is an overview of candidate assessments and recruitment pipeline performance.",
    "overview.totalCandidates": "Total Candidates",
    "overview.totalInterviews": "Interviews Conducted",
    "overview.completedInterviews": "Completed Assessments",
    "overview.averageScore": "Average Score",
    "overview.recentActivity": "Recent Interview Pipeline",
    "overview.noActivity": "No interviews have been recorded yet.",
    "overview.viewAllCandidates": "View All Candidates",

    // Candidates Tab
    "candidates.title": "Candidate Roster",
    "candidates.subtitle": "Manage applicants, external IDs, and generate AI assessment links.",
    "candidates.addBtn": "Add Candidate & Invite",
    "candidates.searchPlaceholder": "Search candidates by name, email or external ID...",
    "candidates.thName": "Candidate",
    "candidates.thExternalId": "External ID",
    "candidates.thInterviews": "Interviews",
    "candidates.thLatestStatus": "Latest Status",
    "candidates.thScore": "Score",
    "candidates.thActions": "Actions",
    "candidates.invite": "Invite to Interview",
    "candidates.noCandidates": "No candidates found.",

    // Assessments Tab
    "assessments.title": "Assessment Reports",
    "assessments.subtitle": "Review AI-generated evaluation reports, candidate strengths, and benchmarks.",
    "assessments.searchPlaceholder": "Search reports by candidate name or role...",
    "assessments.thCandidate": "Candidate",
    "assessments.thRole": "Target Role / Job Description",
    "assessments.thStatus": "Status",
    "assessments.thScore": "Overall Score",
    "assessments.thDate": "Date",
    "assessments.viewReport": "View Full Report",
    "assessments.reportModalTitle": "Interview Evaluation Report",
    "assessments.strengths": "Key Strengths",
    "assessments.weaknesses": "Areas for Improvement",
    "assessments.recommendations": "AI Hiring Recommendation",

    // Integrations Tab
    "integrations.title": "API & ATS Integrations",
    "integrations.subtitle": "Connect NexWolf AI directly into your recruitment pipeline, Greenhouse, Lever, or custom backend.",
    "integrations.apiKeysTitle": "Company API Keys",
    "integrations.createKeyBtn": "Generate New API Key",
    "integrations.keyPrefix": "Key Prefix",
    "integrations.created": "Created",
    "integrations.lastUsed": "Last Used",
    "integrations.revoke": "Revoke",
    "integrations.active": "Active",
    "integrations.revoked": "Revoked",

    // Settings Tab
    "settings.title": "Workspace Settings",
    "settings.subtitle": "Manage company profile, organization slug, and default assessment preferences.",
    "settings.companyName": "Company Name",
    "settings.companySlug": "Organization Slug",
    "settings.save": "Save Changes",
  },
  ar: {
    // Brand & General
    "brand.name": "NexWolf للأعمال",
    "brand.tagline": "منظومة توظيف الشركات",
    "brand.badge": "بوابة مسؤولي التوظيف",
    "portal.badge": "بوابة الشركات",
    "portal.candidateRoom": "غرفة المرشح",

    // Navigation
    "nav.workspace": "مساحة العمل",
    "nav.overview": "لوحة المعلومات",
    "nav.candidates": "المرشحون",
    "nav.assessments": "التقييمات والتقارير",
    "nav.integrations": "الربط البرمجي (API)",
    "nav.settings": "الإعدادات",

    // Header & Actions
    "header.signOut": "تسجيل الخروج",
    "header.signingOut": "جاري الخروج...",
    "header.signedOutSuccess": "تم تسجيل الخروج بنجاح",
    "header.themeToggle": "تبديل المظهر",
    "header.langToggle": "English",

    // Auth & Login
    "login.title": "NexWolf للأعمال",
    "login.subtitle": "سجّل الدخول بحساب مسؤول التوظيف لإدارة المرشحين والمقابلات الذكية وتقييمات الذكاء الاصطناعي.",
    "login.badge": "مركز قيادة التوظيف",
    "login.emailLabel": "البريد الإلكتروني للعمل",
    "login.emailPlaceholder": "company@gmail.com",
    "login.passwordLabel": "كلمة المرور",
    "login.submit": "الدخول إلى مساحة العمل",
    "login.loading": "جاري التحقق من الحساب...",
    "login.securityNote": "محمي بنظام أمان المؤسسات NexWolf",
    "login.welcomeBack": "أهلاً بك مجدداً! جاري الدخول إلى",

    // Overview Tab
    "overview.welcome": "مرحباً بك، مسؤول التوظيف",
    "overview.subtitle": "إليك ملخص أداء مقابلات المرشحين ومعدلات التقييم بالذكاء الاصطناعي.",
    "overview.totalCandidates": "إجمالي المرشحين",
    "overview.totalInterviews": "المقابلات المنفذة",
    "overview.completedInterviews": "المقابلات المكتملة",
    "overview.averageScore": "متوسط التقييم",
    "overview.recentActivity": "آخر نشاطات المقابلات",
    "overview.noActivity": "لا توجد مقابلات مسجلة حتى الآن.",
    "overview.viewAllCandidates": "عرض جميع المرشحين",

    // Candidates Tab
    "candidates.title": "قائمة المرشحين",
    "candidates.subtitle": "إدارة المتقدمين، ربط المعرفات الخارجية، وتوليد روابط المقابلات بالذكاء الاصطناعي.",
    "candidates.addBtn": "إضافة مرشح ودعوته للمقابلة",
    "candidates.searchPlaceholder": "ابحث عن المرشحين بالاسم، الإيميل، أو المعرّف...",
    "candidates.thName": "المرشح",
    "candidates.thExternalId": "المعرف الخارجي",
    "candidates.thInterviews": "المقابلات",
    "candidates.thLatestStatus": "آخر حالة",
    "candidates.thScore": "الدرجة",
    "candidates.thActions": "الإجراءات",
    "candidates.invite": "إنشاء مقابلة ودعوة",
    "candidates.noCandidates": "لا يوجد مرشحون حالياً.",

    // Assessments Tab
    "assessments.title": "تقارير التقييم",
    "assessments.subtitle": "مراجعة تقارير الذكاء الاصطناعي المفصلة ونقاط القوة والضعف للمرشحين.",
    "assessments.searchPlaceholder": "ابحث عن التقارير باسم المرشح أو الوظيفة...",
    "assessments.thCandidate": "المرشح",
    "assessments.thRole": "الوظيفة / الوصف الوظيفي",
    "assessments.thStatus": "الحالة",
    "assessments.thScore": "الدرجة الكلية",
    "assessments.thDate": "التاريخ",
    "assessments.viewReport": "عرض التقرير الكامل",
    "assessments.reportModalTitle": "تقرير تقييم المقابلة الذكية",
    "assessments.strengths": "نقاط القوة",
    "assessments.weaknesses": "نقاط التحسين",
    "assessments.recommendations": "توصية التوظيف الذكية",

    // Integrations Tab
    "integrations.title": "الربط البرمجي ومفاتيح API",
    "integrations.subtitle": "اربط منصة التقييم مباشرة مع نظام التوظيف الخاص بشركتك (ATS, Greenhouse, Lever, Custom API).",
    "integrations.apiKeysTitle": "مفاتيح الـ API للشركة",
    "integrations.createKeyBtn": "توليد مفتاح API جديد",
    "integrations.keyPrefix": "بادئة المفتاح",
    "integrations.created": "تاريخ الإنشاء",
    "integrations.lastUsed": "آخر استخدام",
    "integrations.revoke": "تعطيل",
    "integrations.active": "نشط",
    "integrations.revoked": "معطل",

    // Settings Tab
    "settings.title": "إعدادات مساحة العمل",
    "settings.subtitle": "إدارة معلومات الشركة ومعرّف المؤسسة وتفضيلات التقييم الافتراضية.",
    "settings.companyName": "اسم الشركة",
    "settings.companySlug": "معرّف المؤسسة (Slug)",
    "settings.save": "حفظ التغييرات",
  },
};

export type CompanyTranslationKey = keyof typeof companyTranslations.en;

interface LanguageContextType {
  language: Language;
  direction: Direction;
  isArabic: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: CompanyTranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "nexwolf_company_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "ar" || saved === "en") {
        setLanguageState(saved);
      }
    } catch {
      // localStorage fallback
    }
    setMounted(true);
  }, []);

  const direction: Direction = language === "ar" ? "rtl" : "ltr";
  const isArabic = language === "ar";

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }
  }, [language, direction, mounted]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "ar" : "en"));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: CompanyTranslationKey): string => {
    const dict = companyTranslations[language];
    return dict[key] || companyTranslations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isArabic,
        toggleLanguage,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
