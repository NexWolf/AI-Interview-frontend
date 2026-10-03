"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Sparkles,
  Mic,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  Globe,
  Award,
  Video,
  AlertCircle,
  Briefcase,
  Zap,
  Layers,
} from "lucide-react";

import CameraPreview from "@/features/interview/components/setup-component/CameraPreview";
import MicorphoneTest from "@/features/interview/components/setup-component/MicorphoneTest";
import { SplashScreen } from "@/components/ui/splash-screen";
import { setupInterview, StartInterviewPayload } from "@/features/interview/types/setup";
import LanguageSelect from "./LanguageSelect";
import VoiceSelect, { AI_VOICES } from "./VoiceSelect";
import TecnologiesSelect from "./TechnologiesSelect";
import InterviewLevelSelect from "./InterviewLevelSelect";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import FormTag from "@/shared/components/form/FormTag";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import { useUserSkills } from "@/shared/hook/useUserSkills";
import { useAllSkills } from "@/shared/hook/useAllSkills";
import { useStartInterview } from "../../hooks/ReactQueryHooks/useStartInterview";
import { useInterviewStore } from "../../store/useInterviewStore";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/shared/lib/utils";

const setupDefaultData: setupInterview = {
  interviewLanguage: "Arabic",
  mode: "skills_only",
  job_description: "",
  skillsIds: [],
  duration: 20,
  difficultyLevel: "Beginner",
  aiVoice: "Kore",
};

interface PresetRole {
  name: string;
  nameAr: string;
  icon: string;
  keywords: string[];
}

const PRESET_ROLES: PresetRole[] = [
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

export const SetupContainer = () => {
  const { data: userData } = useUserInfo();
  const { data: userSkills } = useUserSkills();
  const { data: allSkills } = useAllSkills();
  const { mutate: startInterview, isPending } = useStartInterview();
  const router = useRouter();
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  // Stepper state: Step 1 (Scope), Step 2 (Voice), Step 3 (Devices & Launch)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [hasJobDescription, setHasJobDescription] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  // Hardware readiness states
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);

  // Anti-cheating and guidelines acceptance checklist
  const [rulesAgreed, setRulesAgreed] = useState<{
    quietPlace: boolean;
    noTabSwitch: boolean;
    noExternalAI: boolean;
    faceVisible: boolean;
  }>({
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

  const { register, watch, setValue } = methods;

  const currentSkillsIds = watch("skillsIds") || [];
  const currentLanguage = watch("interviewLanguage");
  const currentDifficulty = watch("difficultyLevel");
  const currentVoice = watch("aiVoice");

  // Determine available skills list for presets and summary
  const availableSkills = useMemo(() => {
    if (userSkills && userSkills.length > 0) {
      return userSkills.map((item) => ({ id: item.skill.id, name: item.skill.name }));
    }
    return (allSkills || []).map((skill) => ({ id: skill.id, name: skill.name }));
  }, [userSkills, allSkills]);

  // Names of currently selected skills for summary card
  const selectedSkillsNames = useMemo(() => {
    return availableSkills
      .filter((s) => currentSkillsIds.map(String).includes(String(s.id)))
      .map((s) => s.name);
  }, [availableSkills, currentSkillsIds]);

  // Handle applying a quick role preset
  const handleApplyPreset = (preset: PresetRole) => {
    const matchedIds: number[] = [];
    availableSkills.forEach((skill) => {
      const match = preset.keywords.some((kw) =>
        skill.name.toLowerCase().includes(kw.toLowerCase())
      );
      if (match) {
        matchedIds.push(Number(skill.id));
      }
    });

    if (matchedIds.length > 0) {
      setValue("skillsIds", matchedIds as any, { shouldValidate: true, shouldDirty: true });
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

  const toggleRule = (key: keyof typeof rulesAgreed) => {
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
    if (!currentSkillsIds || currentSkillsIds.length === 0) {
      toast.error(
        isAr
          ? "يرجى تحديد تقنية واحدة على الأقل قبل المتابعة"
          : "Please select at least one technology before proceeding"
      );
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextFromStep2 = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const OnSubmit = async (data: setupInterview) => {
    document.documentElement.requestFullscreen().catch((e) => {
      console.error("full screen request failed", e);
    });

    if (!isReadyToStart) {
      toast.error(
        isAr
          ? "تأكد من فحص الكاميرا والميكروفون والموافقة على جميع شروط النزاهة قبل البدء"
          : "Please ensure your camera and microphone are tested, and accept all honor code guidelines before starting."
      );
      return;
    }

    if (!data.skillsIds || data.skillsIds.length === 0) {
      toast.error(
        isAr
          ? "يرجى اختيار مهارة أو تقنية واحدة على الأقل"
          : "Please select at least one technology/skill to evaluate."
      );
      return;
    }

    const payload: StartInterviewPayload = {
      difficultyLevel: data.difficultyLevel,
      interviewLanguage: data.interviewLanguage,
      mode: hasJobDescription ? "job_description" : "skills_only",
      job_description: hasJobDescription ? data.job_description : undefined,
      duration: 20,
      skillIds: data.skillsIds,
    };

    startInterview(payload, {
      onSuccess: (response) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("interview_ai_voice", data.aiVoice || "Kore");
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

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground p-4 sm:p-8 flex flex-col justify-start items-center transition-colors duration-200">
      {/* Full-screen Loading Overlay for Interview Preparation */}
      {isPending && (
        <SplashScreen
          message={isAr ? "جاري تحضير المقابلة..." : "Preparing Interview..."}
          subMessage={
            isAr
              ? "يقوم الذكاء الاصطناعي الآن بصياغة أسئلتك المخصصة"
              : "Our AI is crafting your customized questions"
          }
          showStatusPill={true}
        />
      )}

      {/* Theme Toggle in top corner */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
        {/* Main Header */}
        <div className="border-b border-border pb-5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              AI Interview Coach
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2">
            {t("setup.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAr
              ? `أهلاً بك ${userName || "عزيزي المرشح"} 👋، لنقم بتجهيز جلستك والتأكد من أجهزتك قبل الانطلاق.`
              : `Welcome ${userName || "Candidate"} 👋, let's customize your session, test your hardware, and review the guidelines.`}
          </p>
        </div>

        {/* Multi-Step Stepper Progress Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 bg-card/60 backdrop-blur rounded-2xl border border-border/70 shadow-xs">
          {[
            {
              step: 1 as const,
              title: t("setup.step1.title"),
              desc: t("setup.step1.desc"),
              icon: Sparkles,
            },
            {
              step: 2 as const,
              title: t("setup.step2.title"),
              desc: t("setup.step2.desc"),
              icon: Mic,
            },
            {
              step: 3 as const,
              title: t("setup.step3.title"),
              desc: t("setup.step3.desc"),
              icon: ShieldCheck,
            },
          ].map(({ step, title, desc, icon: Icon }) => {
            const isActive = currentStep === step;
            const isCompleted = currentStep > step;

            return (
              <button
                key={step}
                type="button"
                onClick={() => {
                  if (step === 2 && (!currentSkillsIds || currentSkillsIds.length === 0)) {
                    toast.error(
                      isAr
                        ? "يرجى اختيار مهارة واحدة على الأقل أولاً"
                        : "Please select at least one technology first"
                    );
                    return;
                  }
                  setCurrentStep(step);
                }}
                className={cn(
                  "flex items-center gap-2.5 sm:gap-3.5 p-3 rounded-xl transition-all cursor-pointer text-left rtl:text-right select-none",
                  isActive
                    ? "bg-primary/10 border border-primary/30 text-primary shadow-xs"
                    : isCompleted
                    ? "bg-background/80 hover:bg-muted/60 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="min-w-0 hidden sm:block">
                  <p className="text-xs font-bold leading-tight truncate">{title}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Form Wrapped */}
        <FormTag onSubmit={OnSubmit} methods={methods}>
          {/* STEP 1: INTERVIEW SCOPE & CUSTOMIZATION */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Quick Presets Section */}
              <div className="p-4 sm:p-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    {t("setup.presets.title")}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("setup.presets.desc")}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {PRESET_ROLES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-border/80 bg-background/80 hover:bg-muted hover:border-primary/50 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <span className="text-base">{preset.icon}</span>
                      <span className="truncate">{isAr ? preset.nameAr : preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Language Section */}
              <div className="flex flex-col gap-2.5">
                <div>
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    {t("setup.lang.title")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("setup.lang.desc")}
                  </p>
                </div>
                <LanguageSelect />
              </div>

              {/* 2. Technologies Section */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" />
                      {t("setup.tech.title")}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("setup.tech.desc")}
                    </p>
                  </div>
                  {currentSkillsIds.length > 0 && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                      {currentSkillsIds.length} {isAr ? "محددة" : "selected"}
                    </span>
                  )}
                </div>
                <TecnologiesSelect />
              </div>

              {/* 3. Interview Level Section */}
              <div className="flex flex-col gap-2.5">
                <div>
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    {t("setup.level.title")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("setup.level.desc")}
                  </p>
                </div>
                <InterviewLevelSelect />
              </div>

              {/* Job Description Optional Toggle */}
              <div className="p-4 rounded-2xl border border-border bg-card/60 flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasJobDescription}
                    onChange={(e) => setHasJobDescription(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    {t("setup.job.toggle")}
                  </span>
                </label>

                {hasJobDescription && (
                  <div className="mt-2">
                    <textarea
                      {...register("job_description")}
                      placeholder={t("setup.job.placeholder")}
                      rows={4}
                      className="w-full p-3.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                    />
                  </div>
                )}
              </div>

              {/* Step 1 Actions */}
              <div className="flex justify-end pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={handleNextFromStep1}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer active:scale-95"
                >
                  <span>{t("setup.btn.next")}</span>
                  <ArrowRight className={cn("w-4 h-4", isAr && "rotate-180")} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AI INTERVIEWER VOICE & PERSONA */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Mic className="w-4 h-4 text-primary" />
                    {t("setup.voice.title")}
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Live Audio Preview
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("setup.voice.desc")}
                </p>
              </div>

              <VoiceSelect />

              {/* Step 2 Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-sm font-semibold transition-all cursor-pointer active:scale-95"
                >
                  <ArrowLeft className={cn("w-4 h-4", isAr && "rotate-180")} />
                  <span>{t("setup.btn.prev")}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer active:scale-95"
                >
                  <span>{t("setup.btn.next")}</span>
                  <ArrowRight className={cn("w-4 h-4", isAr && "rotate-180")} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: HARDWARE CHECK, HONOR CODE & LAUNCH */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Hardware Check Section */}
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Video className="w-4 h-4 text-primary" />
                    {t("setup.hardware.title")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("setup.hardware.desc")}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-stretch gap-6 w-full mt-1">
                  <CameraPreview onReady={(value: boolean) => setIsVideoReady(value)} />
                  <MicorphoneTest
                    language={watch("interviewLanguage")}
                    onReady={(value: boolean) => setIsAudioReady(value)}
                  />
                </div>
              </div>

              {/* Honor Code & Guidelines Section */}
              <div className="flex flex-col gap-4 border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/10 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground">
                      {t("setup.rules.title")}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("setup.rules.desc")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectAllRules}
                    className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                  >
                    {allRulesAccepted ? t("setup.rules.deselectAll") : t("setup.rules.acceptAll")}
                  </button>
                </div>

                {/* Individual Checklist Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-background hover:bg-muted/50 cursor-pointer transition text-xs">
                    <input
                      type="checkbox"
                      checked={rulesAgreed.quietPlace}
                      onChange={() => toggleRule("quietPlace")}
                      className="mt-0.5 w-4 h-4 rounded text-primary cursor-pointer"
                    />
                    <span>
                      <strong className="block text-foreground mb-0.5">
                        {isAr ? "مكان هادئ ومضاء:" : "Quiet & Well-Lit Room:"}
                      </strong>
                      {isAr
                        ? "أوافق على التواجد بمفردي في بيئة هادئة ومضاءة جيداً طوال الجلسة."
                        : "I agree to remain alone in a quiet and well-lit environment throughout the session."}
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-background hover:bg-muted/50 cursor-pointer transition text-xs">
                    <input
                      type="checkbox"
                      checked={rulesAgreed.noTabSwitch}
                      onChange={() => toggleRule("noTabSwitch")}
                      className="mt-0.5 w-4 h-4 rounded text-primary cursor-pointer"
                    />
                    <span>
                      <strong className="block text-foreground mb-0.5">
                        {isAr ? "البقاء في نافذة المقابلة:" : "Stay on This Page:"}
                      </strong>
                      {isAr
                        ? "ألتزم بعدم التبديل بين علامات تبويب المتصفح أو تصغير النافذة أثناء الجلسة."
                        : "I will not switch browser tabs, minimize the window, or launch external applications."}
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-background hover:bg-muted/50 cursor-pointer transition text-xs">
                    <input
                      type="checkbox"
                      checked={rulesAgreed.noExternalAI}
                      onChange={() => toggleRule("noExternalAI")}
                      className="mt-0.5 w-4 h-4 rounded text-primary cursor-pointer"
                    />
                    <span>
                      <strong className="block text-foreground mb-0.5">
                        {isAr ? "منع المساعدات الخارجية:" : "No External AI / Assistance:"}
                      </strong>
                      {isAr
                        ? "لن أستخدم أدوات ذكاء اصطناعي خارجية أو محركات بحث أو تلقي مساعدة من آخرين."
                        : "I will not use ChatGPT, Copilot, search engines, notes, or receive help from others."}
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-background hover:bg-muted/50 cursor-pointer transition text-xs">
                    <input
                      type="checkbox"
                      checked={rulesAgreed.faceVisible}
                      onChange={() => toggleRule("faceVisible")}
                      className="mt-0.5 w-4 h-4 rounded text-primary cursor-pointer"
                    />
                    <span>
                      <strong className="block text-foreground mb-0.5">
                        {isAr ? "وضوح الوجه وموافقة التسجيل:" : "Face Visibility & Recording:"}
                      </strong>
                      {isAr
                        ? "أوافق على تسجيل الصوت وتدفق الكاميرا للمراقبة الذكية مع إبقاء وجهي واضحاً."
                        : "I consent to continuous camera and audio recording, keeping my face visible at all times."}
                    </span>
                  </label>
                </div>
              </div>

              {/* Summary Review Card */}
              <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    {t("setup.summary.title")}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    20 {isAr ? "دقيقة" : "mins"} • AI Interview
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-1">
                    <span className="text-[11px] text-muted-foreground block">
                      {isAr ? "اللغة المختارة" : "Language"}
                    </span>
                    <span className="font-semibold text-foreground">
                      {currentLanguage === "Arabic" ? "العربية (Arabic)" : "English"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-1">
                    <span className="text-[11px] text-muted-foreground block">
                      {isAr ? "المستوى" : "Level"}
                    </span>
                    <span className="font-semibold text-foreground">
                      {currentDifficulty}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-1">
                    <span className="text-[11px] text-muted-foreground block">
                      {isAr ? "صوت المدرب" : "Interviewer Voice"}
                    </span>
                    <span className="font-semibold text-foreground">
                      {AI_VOICES.find((v) => v.id === currentVoice)?.displayName || currentVoice}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-1">
                    <span className="text-[11px] text-muted-foreground block">
                      {isAr ? "جاهزية الأجهزة" : "Hardware Status"}
                    </span>
                    <span className={cn("font-semibold", isVideoReady && isAudioReady ? "text-emerald-500" : "text-amber-500")}>
                      {isVideoReady && isAudioReady ? (isAr ? "جاهز تماماً ✓" : "All Ready ✓") : (isAr ? "بانتظار الفحص" : "Pending Check")}
                    </span>
                  </div>
                </div>

                {/* Selected skills badges in summary */}
                {selectedSkillsNames.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-muted-foreground block">
                      {isAr ? "التقنيات التي سيتم تقييمك فيها:" : "Target Evaluation Technologies:"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSkillsNames.map((name, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Prerequisite checklist alert if not ready */}
              {!isReadyToStart && (
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {isAr ? "متطلبات تفعيل زر بدء المقابلة:" : "Required to unlock Start button:"}
                  </span>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md font-medium",
                        isVideoReady ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {isVideoReady ? (isAr ? "✓ الكاميرا جاهزة" : "✓ Camera ready") : (isAr ? "✗ الكاميرا غير مؤكدة" : "✗ Camera unverified")}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md font-medium",
                        isAudioReady ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {isAudioReady ? (isAr ? "✓ الميكروفون جاهز" : "✓ Microphone ready") : (isAr ? "✗ الميكروفون غير مؤكد" : "✗ Microphone unverified")}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md font-medium",
                        allRulesAccepted ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {allRulesAccepted ? (isAr ? "✓ الشروط مقبولة" : "✓ Guidelines accepted") : (isAr ? "✗ وافق على الـ 4 بنود" : "✗ Accept 4 rules")}
                    </span>
                  </div>
                </div>
              )}

              {/* Step 3 Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-sm font-semibold transition-all cursor-pointer active:scale-95"
                >
                  <ArrowLeft className={cn("w-4 h-4", isAr && "rotate-180")} />
                  <span>{t("setup.btn.prev")}</span>
                </button>

                <button
                  type="submit"
                  disabled={!isReadyToStart}
                  className={cn(
                    "inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg active:scale-95",
                    isReadyToStart
                      ? "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-primary-foreground shadow-primary/25 cursor-pointer ring-2 ring-primary/30"
                      : "bg-muted text-muted-foreground border border-border opacity-50 cursor-not-allowed shadow-none"
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t("setup.btn.start")}</span>
                </button>
              </div>
            </div>
          )}
        </FormTag>
      </div>
    </div>
  );
};

export default SetupContainer;