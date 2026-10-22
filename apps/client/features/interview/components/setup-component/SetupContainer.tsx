"use client";

import React from "react";
import { Sparkles, Mic, ShieldCheck, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SplashScreen } from "@/components/ui/splash-screen";
import FormTag from "@/shared/components/form/FormTag";
import { cn } from "@/shared/lib/utils";
import { useInterviewSetupWizard } from "@/features/interview/hooks/useInterviewSetupWizard";
import SetupStepScope from "./steps/SetupStepScope";
import SetupStepVoice from "./steps/SetupStepVoice";
import SetupStepLaunch from "./steps/SetupStepLaunch";
import { AppButton } from "@/shared/components/ui/AppButton";

export const SetupContainer = () => {
  const {
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
  } = useInterviewSetupWizard();

  const stepsConfig = [
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
  ];

  return (
    <div className="relative w-full min-h-screen bg-muted/20 dark:bg-background/95 text-foreground py-6 sm:py-10 px-3 sm:px-6 flex flex-col justify-start items-center transition-colors duration-200">
      {/* Ambient background glow accents */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/5 dark:bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

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

      {/* Master Framed Setup Container Card */}
      <div
        className={cn(
          "w-full max-w-4xl mx-auto my-2 sm:my-4 p-5 sm:p-8 md:p-10 rounded-3xl border border-border/80 dark:border-border/50 bg-card/95 dark:bg-card/45 backdrop-blur-xl shadow-xl dark:shadow-2xl dark:shadow-primary/5 space-y-6 sm:space-y-8 relative overflow-hidden transition-all",
          isPending && "invisible pointer-events-none"
        )}
      >
        {/* Subtle decorative background gradient accent */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" aria-hidden="true" />

        {/* Main Header */}
        <div className="border-b border-border/70 pb-5 space-y-3 relative z-10">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <AppButton
              variant="outline"
              size="sm"
              onClick={handleBackToOrigin}
              icon={<ArrowLeft className={cn("w-3.5 h-3.5 transition-transform", isAr && "rotate-180")} />}
              iconPosition="start"
            >
              {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
            </AppButton>

            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              AI Interview Coach
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t("setup.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isAr
                ? `أهلاً بك ${userName || "عزيزي المرشح"} 👋، لنقم بتجهيز جلستك والتأكد من أجهزتك قبل الانطلاق.`
                : `Welcome ${userName || "Candidate"} 👋, let's customize your session, test your hardware, and review the guidelines.`}
            </p>
          </div>
        </div>

        {/* Multi-Step Stepper Progress Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 bg-background/80 dark:bg-secondary/20 backdrop-blur rounded-2xl border border-border/70 shadow-xs relative z-10">
          {stepsConfig.map(({ step, title, desc, icon: Icon }) => {
            const isActive = currentStep === step;
            const isCompleted = currentStep > step;

            return (
              <button
                key={step}
                type="button"
                onClick={() => {
                  if (
                    step === 2 &&
                    !isCareerDiscovery &&
                    (!currentSkillsIds || currentSkillsIds.length === 0)
                  ) {
                    toast.error(
                      isAr
                        ? "يرجى اختيار مهارة واحدة على الأقل أولاً"
                        : "Please select at least one technology first"
                    );
                    return;
                  }
                  handleStepClick(step);
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
        <FormTag onSubmit={onSubmit} methods={methods}>
          {currentStep === 1 && (
            <SetupStepScope
              isCareerDiscovery={isCareerDiscovery}
              activeProjectId={activeProjectId}
              setActiveProjectId={setActiveProjectId}
              currentSkillsIds={currentSkillsIds}
              hasJobDescription={hasJobDescription}
              setHasJobDescription={setHasJobDescription}
              handleApplyPreset={handleApplyPreset}
              onNext={handleNextFromStep1}
              onPrev={handleBackToOrigin}
              prevLabel={isAr ? "إلغاء والعودة" : "Cancel & Return"}
            />
          )}

          {currentStep === 2 && (
            <SetupStepVoice
              onPrev={handlePrevFromStep2}
              onNext={handleNextFromStep2}
            />
          )}

          {currentStep === 3 && (
            <SetupStepLaunch
              currentLanguage={currentLanguage}
              currentDifficulty={currentDifficulty}
              currentVoice={currentVoice}
              activeProjectId={activeProjectId}
              selectedSkillsNames={selectedSkillsNames}
              rulesAgreed={rulesAgreed}
              allRulesAccepted={allRulesAccepted}
              toggleRule={toggleRule}
              handleSelectAllRules={handleSelectAllRules}
              isVideoReady={isVideoReady}
              setIsVideoReady={setIsVideoReady}
              isAudioReady={isAudioReady}
              setIsAudioReady={setIsAudioReady}
              isReadyToStart={isReadyToStart}
              onPrev={handlePrevFromStep3}
            />
          )}
        </FormTag>
      </div>
    </div>
  );
};

export default SetupContainer;