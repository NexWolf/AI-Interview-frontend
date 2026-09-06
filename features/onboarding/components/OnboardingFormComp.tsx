import { BioStep } from "./BioStep";
import SkillsStep from "./SkillsStep";
import { AlertCircle, Loader } from "lucide-react";
import EducationStep from "./Educations";
import { FormTag } from "@/shared/components/form/FormTag";
import BasicStep from "./BasicStep";
import { OnboardingForm } from "../types/onboarding.types";
import { UseFormReturn } from "react-hook-form";

type FormProps = {
  step: number;
  onNext: (step: number) => void;
  onBack: (step: number) => void;
  isError: boolean;
  isPending: boolean;
  totalSteps: number;
  OnSubmit: (data: OnboardingForm) => void;
  error: Error | null;
  methods : UseFormReturn<OnboardingForm>
};

const STEP_TITLES: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: "Basic Information",
    subtitle: "Let's start with your fundamental profile and contact info.",
  },
  2: {
    title: "Bio & Avatar",
    subtitle: "Tell the community who you are and customize your profile photo.",
  },
  3: {
    title: "Skills & Specialization",
    subtitle: "Highlight your key skills to unlock tailored opportunities.",
  },
  4: {
    title: "Education Background",
    subtitle: "Share your academic history, degrees, and certificates.",
  },
};

export const OnboardingFormComp = ({
  step,
  onNext,
  onBack,
  isError,
  isPending,
  totalSteps,
  OnSubmit,
  error,
  methods,
}: FormProps) => {
   const progressPercentage = Math.round((step / totalSteps) * 100);
  return (
    <div className="w-full max-w-2xl mx-auto py-2 sm:py-6">
      <FormTag onSubmit={OnSubmit} methods={methods}>
        {/* الحاوية الرئيسية الزجاجية المتناسقة مع الـ Sidebar والألوان */}
        <div className="relative overflow-hidden rounded-3xl border border-border/70 dark:border-border/40 bg-card/80 dark:bg-card/40 p-6 sm:p-10 backdrop-blur-2xl shadow-xl dark:shadow-2xl dark:shadow-primary/5 transition-all">
          
          {/* إضاءة خلفية ناعمة تتناغم مع الوضعين الفاتح والداكن */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl"
            aria-hidden="true"
          />
          {/* ================= 1. شريط التقدم وترويسة الخطوة ================= */}
          <div className="relative z-10 mb-8 pb-6 border-b border-border/50 dark:border-border/30">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Step {step} of {totalSteps}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {progressPercentage}% Completed
              </span>
            </div>
            {/* شريط الإنجاز (Progress Bar) */}
            <div className="w-full h-1.5 bg-secondary/80 dark:bg-secondary/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {/* عنوان ووصف الخطوة الحالية */}
            <div className="mt-6 space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {STEP_TITLES[step]?.title || `Step ${step}`}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {STEP_TITLES[step]?.subtitle}
              </p>
            </div>
          </div>
          {/* ================= 2. محتوى الخطوات ================= */}
          <div className="relative z-10 space-y-6">
            {step === 1 && <BasicStep onNext={() => onNext(1)} />}
            {step === 2 && (
              <BioStep onNext={() => onNext(2)} onBack={() => onBack(2)} />
            )}
            {step === 3 && (
              <SkillsStep onNext={() => onNext(3)} onBack={() => onBack(3)} />
            )}
            {step === 4 && <EducationStep onBack={() => onBack(4)} />}
            {/* صندوق الخطأ مع تصميم متوافق مع درجات --destructive */}
            {isError && (
              <div className="flex items-center gap-2.5 p-4 rounded-xl border border-destructive/30 bg-destructive/10 dark:bg-destructive/20 text-destructive text-sm mt-4 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Something went wrong: {error?.message}</span>
              </div>
            )}
            {/* ================= 3. زر الحفظ النهائي ================= */}
            {totalSteps === step && (
              <div className="flex justify-end pt-6 border-t border-border/50 dark:border-border/30">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl font-medium text-sm shadow-md hover:shadow-lg dark:shadow-none transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin w-4 h-4 text-primary-foreground" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    "Complete Profile"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </FormTag>
    </div>
  );
};

export default OnboardingFormComp;
