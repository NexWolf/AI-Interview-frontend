import React from "react";
import {
  Video,
  AlertCircle,
  Check,
  FolderGit2,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/context/LanguageContext";
import { RulesAgreed } from "@/features/interview/hooks/useInterviewSetupWizard";
import { AI_VOICES } from "../VoiceSelect";
import CameraPreview from "../CameraPreview";
import MicrophoneTest from "../MicrophoneTest";
import { SetupStepFooter } from "../SetupNextButton";

interface SetupStepLaunchProps {
  currentLanguage: string;
  currentDifficulty: string;
  currentVoice: string;
  activeProjectId: string | null;
  selectedSkillsNames: string[];
  rulesAgreed: RulesAgreed;
  allRulesAccepted: boolean;
  toggleRule: (key: keyof RulesAgreed) => void;
  handleSelectAllRules: () => void;
  isVideoReady: boolean;
  setIsVideoReady: (val: boolean) => void;
  isAudioReady: boolean;
  setIsAudioReady: (val: boolean) => void;
  isReadyToStart: boolean;
  onPrev: () => void;
}

export const SetupStepLaunch: React.FC<SetupStepLaunchProps> = ({
  currentLanguage,
  currentDifficulty,
  currentVoice,
  activeProjectId,
  selectedSkillsNames,
  rulesAgreed,
  allRulesAccepted,
  toggleRule,
  handleSelectAllRules,
  isVideoReady,
  setIsVideoReady,
  isAudioReady,
  setIsAudioReady,
  isReadyToStart,
  onPrev,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Hardware Check Section */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card/60 dark:bg-card/25 backdrop-blur-xs shadow-xs space-y-4 hover:border-primary/30 transition-all">
        <div className="flex flex-col gap-1 pb-3 border-b border-border/60">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" />
            {t("setup.hardware.title")}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("setup.hardware.desc")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-6 w-full pt-1">
          <CameraPreview onReady={(value: boolean) => setIsVideoReady(value)} />
          <MicrophoneTest
            language={currentLanguage as "Arabic" | "English"}
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
          {([
            {
              key: "quietPlace" as const,
              title: isAr ? "مكان هادئ ومضاء:" : "Quiet & Well-Lit Room:",
              desc: isAr
                ? "أوافق على التواجد بمفردي في بيئة هادئة ومضاءة جيداً طوال الجلسة."
                : "I agree to remain alone in a quiet and well-lit environment throughout the session.",
            },
            {
              key: "noTabSwitch" as const,
              title: isAr ? "البقاء في نافذة المقابلة:" : "Stay on This Page:",
              desc: isAr
                ? "ألتزم بعدم التبديل بين علامات تبويب المتصفح أو تصغير النافذة أثناء الجلسة."
                : "I will not switch browser tabs, minimize the window, or launch external applications.",
            },
            {
              key: "noExternalAI" as const,
              title: isAr ? "منع المساعدات الخارجية:" : "No External AI / Assistance:",
              desc: isAr
                ? "لن أستخدم أدوات ذكاء اصطناعي خارجية أو محركات بحث أو تلقي مساعدة من آخرين."
                : "I will not use ChatGPT, Copilot, search engines, notes, or receive help from others.",
            },
            {
              key: "faceVisible" as const,
              title: isAr ? "وضوح الوجه وموافقة التسجيل:" : "Face Visibility & Recording:",
              desc: isAr
                ? "أوافق على تسجيل الصوت وتدفق الكاميرا للمراقبة الذكية مع إبقاء وجهي واضحاً."
                : "I consent to continuous camera and audio recording, keeping my face visible at all times.",
            },
          ] as const).map(({ key, title, desc }) => {
            const isChecked = rulesAgreed[key];
            return (
              <label
                key={key}
                className={cn(
                  "flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer text-xs select-none shadow-2xs hover:shadow-xs",
                  isChecked
                    ? "border-primary/40 bg-primary/5 dark:bg-primary/10"
                    : "border-border bg-background hover:bg-muted/50"
                )}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleRule(key)}
                  className="mt-0.5 w-4 h-4 rounded border-border text-primary accent-primary focus:ring-primary cursor-pointer shrink-0"
                />
                <div>
                  <strong className="block text-foreground mb-0.5 font-semibold">
                    {title}
                  </strong>
                  <span className="text-muted-foreground leading-relaxed block">
                    {desc}
                  </span>
                </div>
              </label>
            );
          })}
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

          {activeProjectId && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 space-y-1 col-span-2 sm:col-span-4">
              <span className="text-[11px] text-primary font-bold flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" />
                {isAr ? "المشروع المتصل بالمقابلة:" : "Linked Codebase Project:"}
              </span>
              <span className="font-semibold text-foreground text-sm">
                {isAr ? `مشروع برمجي (#${activeProjectId})` : `Codebase Project (#${activeProjectId})`}
              </span>
            </div>
          )}
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
              {isAudioReady ? (isAr ? "✓ الميكروفون قيد التشغيل" : "✓ Microphone active") : (isAr ? "✗ الميكروفون مغلق أو مكتوم" : "✗ Microphone muted/closed")}
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
      <SetupStepFooter
        onPrev={onPrev}
        isLastStep
        nextType="submit"
        isNextDisabled={!isReadyToStart}
        nextLabel={t("setup.btn.start")}
      />
    </div>
  );
};

export default SetupStepLaunch;
