import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import { useUserSkills } from "@/shared/hook/useUserSkills";
import { useAllSkills } from "@/shared/hook/useAllSkills";
import { useStartInterview } from "@/features/interview/hooks/ReactQueryHooks/useStartInterview";
import { useInterviewStore } from "@/features/interview/store/useInterviewStore";
import { useLanguage } from "@/shared/context/LanguageContext";
import { useMediaStream, stopGlobalMediaStream } from "@/shared/components/provider/MediaStermProvider";
import { setupInterview, StartInterviewPayload } from "@/features/interview/types/setup";

export const setupDefaultData: setupInterview = {
  interviewLanguage: "Arabic",
  mode: "skills_only",
  job_description: "",
  skillsIds: [],
  duration: 20,
  difficultyLevel: "Beginner",
  aiVoice: "Kore",
};

export interface PresetRole {
  name: string;
  nameAr: string;
  icon: string;
  keywords: string[];
}

export const PRESET_ROLES: PresetRole[] = [
  {
    name: "Full-Stack Web",
    nameAr: "مطور ويب شامل",
    icon: "🌐",
    keywords: ["react", "next", "node", "typescript", "javascript", "postgres", "sql"],
  },
  {
    name: "Frontend Specialist",
    nameAr: "أخصائي واجهات أمامية",
    icon: "🎨",
    keywords: ["react", "next", "html", "css", "tailwind", "typescript", "javascript", "vue"],
  },
  {
    name: "Backend Engineer",
    nameAr: "مهندس باك إند",
    icon: "⚙️",
    keywords: ["python", "fastapi", "django", "node", "express", "sql", "postgres", "docker", "mongo"],
  },
  {
    name: "Mobile Apps",
    nameAr: "تطبيقات الهواتف",
    icon: "📱",
    keywords: ["flutter", "react native", "swift", "kotlin", "android", "ios"],
  },
];

export const STUDENT_SKILL_ID = "7";

export interface RulesAgreed {
  quietPlace: boolean;
  noTabSwitch: boolean;
  noExternalAI: boolean;
  faceVisible: boolean;
}

export const exitFullscreenSafely = () => {
  if (typeof document !== "undefined" && document.fullscreenElement) {
    document.exitFullscreen().catch((err) => {
      console.warn("Fullscreen exit caught:", err);
    });
  }
};

export function useInterviewSetupWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const { data: userData } = useUserInfo();
  const { data: userSkills } = useUserSkills();
  const { data: allSkills } = useAllSkills();
  const { mutate: startInterview, isPending } = useStartInterview();
  const { ensureStreamActive, stopStream } = useMediaStream();

  // Smart return to origin page with graceful fallback to /dashboard
  const handleBackToOrigin = useCallback(() => {
    exitFullscreenSafely();
    try {
      stopStream();
      stopGlobalMediaStream();
    } catch (err) {
      console.warn("Error stopping media stream on exit:", err);
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  }, [router, stopStream]);

  // Stepper state: Step 1 (Scope), Step 2 (Voice), Step 3 (Devices & Launch)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [hasJobDescription, setHasJobDescription] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  // Hardware readiness states
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);

  // Search parameters for project-based interview or career discovery
  const urlProjectId = searchParams.get("projectId");
  const urlMode = searchParams.get("mode");
  const isCareerDiscovery =
    urlMode === "career_discovery" || urlMode === "student_placement";

  const [activeProjectId, setActiveProjectId] = useState<string | null>(urlProjectId);

  // Anti-cheating and guidelines acceptance checklist
  const [rulesAgreed, setRulesAgreed] = useState<RulesAgreed>({
    quietPlace: false,
    noTabSwitch: false,
    noExternalAI: false,
    faceVisible: false,
  });

  useEffect(() => {
    if (!userData?.userName) return;
    setUserName(userData.userName);
  }, [userData]);

  const methods = useForm<setupInterview>({
    defaultValues: setupDefaultData,
  });

  const { watch, setValue } = methods;

  useEffect(() => {
    if (urlProjectId) {
      setActiveProjectId(urlProjectId);
      setValue("projectId", urlProjectId);
    }
  }, [urlProjectId, setValue]);

  // Dynamically resolve student skill ID from allSkills if present, with fallback to constant
  const resolvedStudentSkillId = useMemo(() => {
    const found = allSkills?.find(
      (s) =>
        s.name?.toLowerCase() === "student" ||
        s.nameEn?.toLowerCase() === "student" ||
        String(s.id) === STUDENT_SKILL_ID
    );
    return found ? String(found.id) : STUDENT_SKILL_ID;
  }, [allSkills]);

  useEffect(() => {
    if (isCareerDiscovery) {
      setValue("difficultyLevel", "Beginner");
      setValue("skillsIds", [resolvedStudentSkillId]);
    }
  }, [isCareerDiscovery, setValue, resolvedStudentSkillId]);

  const currentSkillsIds = watch("skillsIds") || [];
  const currentLanguage = watch("interviewLanguage");
  const currentDifficulty = watch("difficultyLevel");
  const currentVoice = watch("aiVoice");

  // Determine available skills list for presets and summary
  const availableSkills = useMemo(() => {
    if (allSkills && allSkills.length > 0) {
      return allSkills
        .filter((s) => s.isActive !== false)
        .map((skill) => ({ id: skill.id, name: skill.name }));
    }
    if (userSkills && userSkills.length > 0) {
      return userSkills.map((item) => ({ id: item.skill.id, name: item.skill.name }));
    }
    return [];
  }, [userSkills, allSkills]);

  // Names of currently selected skills for summary card
  const selectedSkillsNames = useMemo(() => {
    if (isCareerDiscovery) {
      return [isAr ? "🎓 مسار الطالب والنمو البرمجي (Student)" : "🎓 Student Foundational Pathway"];
    }
    return availableSkills
      .filter((s) => currentSkillsIds.map(String).includes(String(s.id)))
      .map((s) => s.name);
  }, [availableSkills, currentSkillsIds, isCareerDiscovery, isAr]);

  // Handle applying a quick role preset
  const handleApplyPreset = (preset: PresetRole) => {
    const matchedIds: string[] = [];
    availableSkills.forEach((skill) => {
      const match = preset.keywords.some((kw) =>
        skill.name.toLowerCase().includes(kw.toLowerCase())
      );
      if (match) {
        matchedIds.push(String(skill.id));
      }
    });

    if (matchedIds.length > 0) {
      setValue("skillsIds", matchedIds, { shouldValidate: true, shouldDirty: true });
      toast.success(
        isAr
          ? `تم تفعيل مسار ${preset.nameAr} واختيار ${matchedIds.length} مهارات`
          : `Activated ${preset.name} preset (${matchedIds.length} skills selected)`
      );
    } else {
      toast.info(isAr ? "لم يتم العثور على مهارات مطابقة حالياً" : "No matching skills found");
    }
  };

  // Validate that all guidelines have been accepted
  const allRulesAccepted = useMemo(() => {
    return Object.values(rulesAgreed).every(Boolean);
  }, [rulesAgreed]);

  // Unified condition to enable the submit button:
  const isReadyToStart = isVideoReady && isAudioReady && allRulesAccepted && !isPending;

  const toggleRule = (key: keyof RulesAgreed) => {
    setRulesAgreed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAllRules = () => {
    const newState = !allRulesAccepted;
    setRulesAgreed({
      quietPlace: newState,
      noTabSwitch: newState,
      noExternalAI: newState,
      faceVisible: newState,
    });
  };

  // Navigation between steps
  const handleNextFromStep1 = () => {
    if (!isCareerDiscovery && (!currentSkillsIds || currentSkillsIds.length === 0)) {
      toast.error(
        isAr
          ? "يرجى تحديد تقنية واحدة على الأقل قبل المتابعة"
          : "Please select at least one technology before proceeding"
      );
      return;
    }

    // زر Next الأول: بدء تشغيل وتجهيز مسار الكاميرا والصوت في الخلفية بهدوء
    ensureStreamActive().catch((err) => {
      console.warn("Media stream pre-warming caught:", err);
    });

    setCurrentStep(2);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextFromStep2 = () => {
    // زر Next الثاني: تفعيل وضع ملء الشاشة قبل دخول فحص الأجهزة
    if (typeof document !== "undefined" && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request bypassed:", err);
      });
    }

    setCurrentStep(3);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // زر Prev من الخطوة 3 إلى الخطوة 2: الخروج الفوري والآمن من وضع ملء الشاشة
  const handlePrevFromStep3 = useCallback(() => {
    exitFullscreenSafely();
    setCurrentStep(2);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // زر Prev من الخطوة 2 إلى الخطوة 1
  const handlePrevFromStep2 = useCallback(() => {
    exitFullscreenSafely();
    setCurrentStep(1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // التنقل المباشر عبر شريط الخطوات (Stepper) مع الخروج الآمن من ملء الشاشة عند الرجوع
  const handleStepClick = useCallback((step: 1 | 2 | 3) => {
    if (step < 3) {
      exitFullscreenSafely();
    }
    setCurrentStep(step);
  }, []);

  // الخروج من وضع ملء الشاشة عند مغادرة الصفحة نهائياً
  useEffect(() => {
    return () => {
      exitFullscreenSafely();
    };
  }, []);

  const onSubmit = async (data: setupInterview) => {
    if (!isVideoReady) {
      toast.error(
        isAr
          ? "الكاميرا غير مفعلة، يلزم تشغيل الكاميرا وتأكيد عملها لبدء المقابلة"
          : "Camera is not active. Live video feed is strictly required to start."
      );
      return;
    }

    if (!isAudioReady) {
      toast.error(
        isAr
          ? "الميكروفون مغلق أو مكتوم، يلزم تشغيل الميكروفون لبدء المقابلة"
          : "Microphone is muted or unavailable. Audio feed is strictly required to start."
      );
      return;
    }

    if (!isReadyToStart) {
      toast.error(
        isAr
          ? "تأكد من فحص الكاميرا والميكروفون والموافقة على جميع شروط النزاهة قبل البدء"
          : "Please ensure your camera and microphone are tested, and accept all honor code guidelines before starting."
      );
      return;
    }


    if (!isCareerDiscovery && (!data.skillsIds || data.skillsIds.length === 0)) {
      toast.error(
        isAr
          ? "يرجى اختيار مهارة أو تقنية واحدة على الأقل"
          : "Please select at least one technology/skill to evaluate."
      );
      return;
    }

    const payload: StartInterviewPayload = {
      difficultyLevel: isCareerDiscovery ? "Beginner" : data.difficultyLevel,
      interviewLanguage: data.interviewLanguage,
      mode: isCareerDiscovery
        ? "job_description"
        : hasJobDescription
          ? "job_description"
          : "skills_only",
      job_description: isCareerDiscovery
        ? "CAREER_DISCOVERY: جلسة استكشاف وتحديد مسار التعلم البرمجي. المرشح مبتدئ يرغب في استكشاف شغفه وتحديد المسار الأنسب له من الصفر (Frontend, Backend, AI, Mobile). المطلوب التحدث معه بأسلوب تشجيعي وودي، وطرح أسئلة استكشافية متسلسلة لفهم طريقة تفكيره وميوله، وفي النهاية تقديم التوصية وخارطة الطريق الأنسب له."
        : hasJobDescription
          ? data.job_description
          : undefined,
      duration: isCareerDiscovery ? 15 : 20,
      skillIds: isCareerDiscovery ? [resolvedStudentSkillId] : (data.skillsIds || []).map(String),
      projectId: activeProjectId || undefined,
      isCareerDiscovery: isCareerDiscovery,
    };

    startInterview(payload, {
      onSuccess: (response) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("interview_ai_voice", data.aiVoice || "Kore");
          if (isCareerDiscovery) {
            sessionStorage.setItem("interview_mode", "career_discovery");
          } else {
            sessionStorage.removeItem("interview_mode");
          }
        }
        const store = useInterviewStore.getState();
        console.log("🚀 [SetupContainer] Starting Interview Room with Zustand Store:", store);

        const interviewId = response?.interview?.id;
        if (interviewId) {
          router.push(`/interview/${interviewId}`);
        } else {
          console.error("Interview ID not found in response", response);
        }
      },
      onError: (error) => {
        console.error("Failed to start interview", error);
        toast.error(isAr ? "فشل إنشاء جلسة المقابلة" : "Failed to start interview");
      },
    });
  };

  return {
    currentStep,
    setCurrentStep,
    methods,
    userName,
    isPending,
    isCareerDiscovery,
    activeProjectId,
    setActiveProjectId,
    hasJobDescription,
    setHasJobDescription,
    currentSkillsIds,
    currentLanguage,
    currentDifficulty,
    currentVoice,
    selectedSkillsNames,
    handleApplyPreset,
    rulesAgreed,
    allRulesAccepted,
    toggleRule,
    handleSelectAllRules,
    isVideoReady,
    setIsVideoReady,
    isAudioReady,
    setIsAudioReady,
    isReadyToStart,
    handleNextFromStep1,
    handleNextFromStep2,
    handlePrevFromStep2,
    handlePrevFromStep3,
    handleStepClick,
    handleBackToOrigin,
    onSubmit,
    t,
    isAr,
    language,
  };
}
