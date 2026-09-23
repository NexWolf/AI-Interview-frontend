"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar";
export type Direction = "ltr" | "rtl";

export const translations = {
  en: {
    // Navbar
    "nav.features": "Features",
    "nav.benefits": "Benefits",
    "nav.howItWorks": "How it Works",
    "nav.pricing": "Pricing",
    "nav.login": "Log In",
    "nav.signup": "Sign Up",
    "nav.switchLang": "العربية",

    // Hero
    "hero.title": "Ace Your Next Tech Interview with Real-Time AI",
    "hero.desc":
      "Practice realistic technical and behavioral interviews powered by intelligent AI. Receive instant feedback, sharpen your problem-solving skills, and walk into your next interview with complete confidence.",
    "hero.cta": "Start Now",
    "hero.stats": "10,000+ Mock Interviews Conducted",
    "hero.splineLoading": "Loading 3D Experience",

    // Features
    "features.badge": "Features",
    "features.title": "Everything You Need to Master Tech Interviews",
    "features.subtitle":
      "Comprehensive tools designed to sharpen your problem-solving, elevate communication, and prepare you for real-world hiring rounds.",
    "features.f1Title": "Adaptive AI Questioning",
    "features.f1Desc":
      "Questions adapt dynamically to your answers, selected technologies, and past interview weak points to guarantee continuous learning every session.",
    "features.f2Title": "Voice & Real-Time Simulation",
    "features.f2Desc":
      "Simulate authentic interview pressure with realistic AI conversational voice interactions and video practice that feel like speaking with a senior engineering lead.",
    "features.f3Title": "Detailed Feedback & Scorecards",
    "features.f3Desc":
      "Receive immediate scoring across technical depth, problem-solving, and communication, along with a personalized, step-by-step improvement plan.",

    // How It Works
    "how.title1": "Turn Practice into",
    "how.title2": "Confidence & Offers",
    "how.subtitle":
      "A streamlined three-step journey to prepare, practice, and conquer every technical interview with precision.",
    "how.s1Title": "Configure Your Interview",
    "how.s1Desc":
      "Choose your target role, difficulty level, programming languages, or paste a real job description.",
    "how.s2Title": "Live Interactive Session",
    "how.s2Desc":
      "Engage in voice or text rounds with adaptive questions that dynamically evaluate your core technical skills.",
    "how.s3Title": "Actionable Insights & Growth",
    "how.s3Desc":
      "Review comprehensive reports highlighting strong areas, blind spots, and customized next steps to improve.",

    // Benefits
    "benefits.badge": "Benefits",
    "benefits.title1": "Turn Every Interview Into",
    "benefits.title2": "Actionable Insights",
    "benefits.subtitle":
      "Understand performance, identify strengths, and discover the areas that matter most with intelligent interview analytics.",
    "benefits.live": "Live",
    "benefits.candidateInsights": "Candidate Insights",
    "benefits.overallScore": "Overall score",
    "benefits.excellent": "Excellent",
    "benefits.scoreComment":
      "Strong performance across communication and technical responses.",
    "benefits.confidence": "Interview Confidence",
    "benefits.quality": "Response Quality",
    "benefits.performance": "Overall Performance",
    "benefits.analytics": "Performance Analytics",
    "benefits.aiPerformance": "AI Interview Performance",
    "benefits.aiInsights": "AI-powered insights",

    // Pricing
    "pricing.badge": "Flexible & Transparent Pricing",
    "pricing.title1": "Find the Perfect",
    "pricing.title2": "Plan",
    "pricing.subtitle":
      "Choose a plan that fits your career goals. Upgrade, downgrade, or cancel anytime.",
    "pricing.monthly": "Monthly",
    "pricing.yearly": "Yearly",
    "pricing.save": "Save 20%",
    "pricing.perMo": "/mo",
    "pricing.perYr": "/yr",
    "pricing.popular": "Most Popular",
    "pricing.choose": "Choose Plan",
    "pricing.starterName": "Starter",
    "pricing.starterDesc":
      "Perfect for students and developers beginning their interview practice.",
    "pricing.starterF1": "5 Full AI Mock Interviews / month",
    "pricing.starterF2": "Text & Real-time Voice Practice",
    "pricing.starterF3": "Comprehensive Scoring Breakdown",
    "pricing.starterF4": "Core Tech Stacks (Frontend, Backend, etc.)",
    "pricing.proName": "Pro",
    "pricing.proDesc":
      "For active job seekers who want to ace technical rounds and land top offers.",
    "pricing.proF1": "Unlimited AI Mock Interviews",
    "pricing.proF2": "Voice & Camera Simulation Modes",
    "pricing.proF3": "Adaptive Weakness & Growth Tracking",
    "pricing.proF4": "Detailed Reports & Step-by-Step Improvement Plan",
    "pricing.proF5": "Custom Job Description Matching",
    "pricing.proF6": "Priority Support",
    "pricing.entName": "Enterprise",
    "pricing.entDesc":
      "For bootcamps, universities, and teams preparing cohorts at scale.",
    "pricing.entF1": "Everything in Pro",
    "pricing.entF2": "Cohort Performance Dashboards",
    "pricing.entF3": "Custom Skill Benchmarks & Rubrics",
    "pricing.entF4": "API Access & Custom Integrations",
    "pricing.entF5": "Dedicated Account Manager",

    // Footer
    "footer.title": "Your next interview could be the one",
    "footer.desc":
      "Start your first mock interview in under a minute. Get real-time AI feedback and personalized growth.",
    "footer.cta": "Start practicing free",
    "footer.rights": "All rights reserved.",
  },
  ar: {
    // Navbar
    "nav.features": "المميزات",
    "nav.benefits": "الفوائد",
    "nav.howItWorks": "كيف يعمل",
    "nav.pricing": "الأسعار",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "تسجيل حساب",
    "nav.switchLang": "English",

    // Hero
    "hero.title": "اجتز مقابلتك التقنية القادمة مع الذكاء الاصطناعي",
    "hero.desc":
      "تدرب على مقابلات تقنية وسلوكية واقعية مدعومة بنماذج ذكاء اصطناعي متطورة. احصل على تقييم فوري، وطور نقاط ضعفك، واستعد لمقابلتك بثقة تامة.",
    "hero.cta": "ابدأ الآن",
    "hero.stats": "+10,000 مقابلة تجريبية تم إجراؤها",
    "hero.splineLoading": "جاري تحميل المشهد التفاعلي",

    // Features
    "features.badge": "المميزات",
    "features.title": "كل ما تحتاجه للتميز في المقابلات التقنية",
    "features.subtitle":
      "أدوات متكاملة صُممت لتطوير مهاراتك في حل المشكلات، وتحسين التواصل، وتجهيزك لجولات التوظيف الحقيقية.",
    "features.f1Title": "أسئلة ذكية وتكيفية",
    "features.f1Desc":
      "تتغير الأسئلة وتتدرج حسب إجاباتك والتقنيات المختارة ونقاط ضعفك السابقة لضمان تطور حقيقي في كل جلسة.",
    "features.f2Title": "محاكاة واقعية بالصوت والكاميرا",
    "features.f2Desc":
      "عِش تجربة المقابلة الحقيقية عبر حوار صوتي وتدريب مرئي بالذكاء الاصطناعي كأنك تتحدث مع خبير تقني معتمد.",
    "features.f3Title": "تقارير تقييمية مفصلة",
    "features.f3Desc":
      "تقييم دقيق يقيس عمقك التقني وطريقتك في التفكير وحل المشكلات، مع خطة تحسين شخصية واضحة للخطوات القادمة.",

    // How It Works
    "how.title1": "حوّل التدريب إلى",
    "how.title2": "ثقة وعروض عمل",
    "how.subtitle":
      "مسار من 3 خطوات واضحة للتحضير والممارسة واجتياز كل مقابلة تقنية باقتدار.",
    "how.s1Title": "تخصيص المقابلة",
    "how.s1Desc":
      "اختر المسمى الوظيفي، ومستوى الصعوبة، والمهارات التقنية، أو الصق وصف الوظيفة المطلوب.",
    "how.s2Title": "جلسة محاكاة تفاعلية",
    "how.s2Desc":
      "خض جولات بالصوت أو النص بأسئلة ذكية تختبر مهاراتك البرمجية الأساسية في الوقت الفعلي.",
    "how.s3Title": "نتائج تحليلات وتطور مستمر",
    "how.s3Desc":
      "اطلع على تقارير تفصيلية تبرز نقاط القوة وفرص التحسين مع تمارين موجهة لمقابلتك القادمة.",

    // Benefits
    "benefits.badge": "الفوائد",
    "benefits.title1": "حوّل كل مقابلة إلى",
    "benefits.title2": "رؤى ونتائج عملية",
    "benefits.subtitle":
      "تعرف على مستواك الحقيقي، وعزز نقاط قوتك، واكتشف المجالات الأكثر أهمية للنجاح عبر تحليلات ذكية.",
    "benefits.live": "مباشر",
    "benefits.candidateInsights": "تحليلات المرشح",
    "benefits.overallScore": "النتيجة الإجمالية",
    "benefits.excellent": "ممتاز",
    "benefits.scoreComment": "أداء قوي ومتميز في التواصل والإجابات التقنية.",
    "benefits.confidence": "الثقة في المقابلة",
    "benefits.quality": "جودة الإجابات",
    "benefits.performance": "الأداء العام",
    "benefits.analytics": "تحليلات الأداء",
    "benefits.aiPerformance": "أداء المقابلة الذكية",
    "benefits.aiInsights": "تحليلات مدعومة بالذكاء الاصطناعي",

    // Pricing
    "pricing.badge": "خطط أسعار مرنة وواضحة",
    "pricing.title1": "اختر الخطة",
    "pricing.title2": "المناسبة لك",
    "pricing.subtitle":
      "حدد الباقة التي تتناسب مع أهدافك الوظيفية، مع إمكانية الترقية أو الإلغاء في أي وقت.",
    "pricing.monthly": "شهرياً",
    "pricing.yearly": "سنوياً",
    "pricing.save": "وفر 20%",
    "pricing.perMo": "/شهرياً",
    "pricing.perYr": "/سنوياً",
    "pricing.popular": "الأكثر طلباً",
    "pricing.choose": "اختر الخطة",
    "pricing.starterName": "البداية",
    "pricing.starterDesc":
      "مثالية للطلاب والمطورين الجدد في بداية تدريبهم على مقابلات العمل.",
    "pricing.starterF1": "5 مقابلات تجريبية ذكية كاملة شهرياً",
    "pricing.starterF2": "تدريب تفاعلي بالنص والصوت المباشر",
    "pricing.starterF3": "تقارير تقييمية أساسية وشاملة",
    "pricing.starterF4": "التقنيات الأساسية (الواجهة الأمامية، الخلفية، إلخ)",
    "pricing.proName": "المحترف",
    "pricing.proDesc":
      "للباحثين الجادين عن فرص عمل ممتازة واجتياز المقابلات التقنية المعقدة.",
    "pricing.proF1": "مقابلات تجريبية غير محدودة بالذكاء الاصطناعي",
    "pricing.proF2": "أوضاع محاكاة كاملة بالصوت والكاميرا",
    "pricing.proF3": "تتبع تكيفي لنقاط الضعف والتقدم",
    "pricing.proF4": "تقارير تفصيلية وخطة تحسين مخصصة خطوة بخطوة",
    "pricing.proF5": "مطابقة ذكية مع الوصف الوظيفي للمقابلة",
    "pricing.proF6": "دعم فني ذو أولوية",
    "pricing.entName": "المؤسسات",
    "pricing.entDesc":
      "للجامعات والمعسكرات البرمجية لتأهيل الطلاب والمجموعات بكفاءة.",
    "pricing.entF1": "كل ما تحتويه باقة المحترف",
    "pricing.entF2": "لوحات تحكم لمتابعة أداء المجموعات",
    "pricing.entF3": "معايير تقييم وتصنيف مخصصة",
    "pricing.entF4": "ربط برمجي عبر API وتكامل خاص",
    "pricing.entF5": "مدير حساب مخصص",

    // Footer
    "footer.title": "مقابلتك القادمة قد تكون خطوتك الكبرى",
    "footer.desc":
      "ابدأ أول مقابلة تجريبية في أقل من دقيقة. احصل على تقييم مباشر وتوجيه مستمر.",
    "footer.cta": "ابدأ التدريب مجاناً",
    "footer.rights": "جميع الحقوق محفوظة.",
  },
};

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "ai_interview_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (savedLang === "ar" || savedLang === "en") {
        setLanguageState(savedLang);
      }
    } catch {
      // localStorage may not be available
    }
    setMounted(true);
  }, []);

  const direction: Direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
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

  const t = (key: TranslationKey): string => {
    const currentDict = translations[language];
    return currentDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
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
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
