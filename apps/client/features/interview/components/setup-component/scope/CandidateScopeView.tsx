"use client";

import React from "react";
import { Globe, Layers, Award } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { PresetRole } from "@/features/interview/hooks/useInterviewSetupWizard";
import LanguageSelect from "../LanguageSelect";
import TechnologiesSelect from "../TechnologiesSelect";
import InterviewLevelSelect from "../InterviewLevelSelect";
import { SetupStepFooter } from "../SetupNextButton";
import LinkedProjectBanner from "./LinkedProjectBanner";
import RolePresetsGrid from "./RolePresetsGrid";
import JobDescriptionSection from "./JobDescriptionSection";

export interface CandidateScopeViewProps {
  activeProjectId: string | null;
  onDetachProject: () => void;
  onApplyPreset: (preset: PresetRole) => void;
  hasJobDescription: boolean;
  setHasJobDescription: (val: boolean) => void;
  currentSkillsCount: number;
  onNext: () => void;
  onPrev?: () => void;
  prevLabel?: string;
}

/**
 * Standard Step 1 view for Professional Candidates preparing for technical interviews.
 * Every section is enclosed within a dedicated, structured card with clean borders and subtle depth.
 */
export const CandidateScopeView: React.FC<CandidateScopeViewProps> = ({
  activeProjectId,
  onDetachProject,
  onApplyPreset,
  hasJobDescription,
  setHasJobDescription,
  currentSkillsCount,
  onNext,
  onPrev,
  prevLabel,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. Optional Linked Codebase Project */}
      {activeProjectId && (
        <LinkedProjectBanner
          projectId={activeProjectId}
          onDetach={onDetachProject}
        />
      )}

      {/* 2. Quick Tech Role Presets */}
      <RolePresetsGrid onApplyPreset={onApplyPreset} />

      {/* 3. Interview Spoken Language Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card/60 dark:bg-card/25 backdrop-blur-xs shadow-xs space-y-3 hover:border-primary/30 transition-all">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            {t("setup.lang.title")}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("setup.lang.desc")}
          </p>
        </div>
        <LanguageSelect />
      </div>

      {/* 4. Target Technologies & Stacks Card (Framed container) */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card/60 dark:bg-card/25 backdrop-blur-xs shadow-xs space-y-4 hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              {t("setup.tech.title")}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("setup.tech.desc")}
            </p>
          </div>
          {currentSkillsCount > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs">
              {currentSkillsCount} {isAr ? "محددة" : "selected"}
            </span>
          )}
        </div>
        <TechnologiesSelect />
      </div>

      {/* 5. Seniority & Difficulty Level Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card/60 dark:bg-card/25 backdrop-blur-xs shadow-xs space-y-3 hover:border-primary/30 transition-all">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            {t("setup.level.title")}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("setup.level.desc")}
          </p>
        </div>
        <InterviewLevelSelect />
      </div>

      {/* 6. Optional Specific Job Description Card */}
      <JobDescriptionSection
        hasJobDescription={hasJobDescription}
        onToggle={setHasJobDescription}
      />

      {/* Step 1 Actions */}
      <SetupStepFooter onNext={onNext} onPrev={onPrev} prevLabel={prevLabel} />
    </div>
  );
};

export default CandidateScopeView;
