"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import StudentGuidanceCard from "../steps/StudentGuidanceCard";
import LanguageSelect from "../LanguageSelect";
import { SetupStepFooter } from "../SetupNextButton";

export interface StudentScopeViewProps {
  onNext: () => void;
  onPrev?: () => void;
  prevLabel?: string;
}

/**
 * Clean, dedicated Step 1 view for Students and Career Discovery candidates.
 * Strips away complex tech stack checkboxes, difficulty levels, and job descriptions,
 * providing a welcoming guidance card and interview language preference.
 */
export const StudentScopeView: React.FC<StudentScopeViewProps> = ({
  onNext,
  onPrev,
  prevLabel,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Student Onboarding & Career Exploration Guidance */}
      <StudentGuidanceCard />

      {/* Language Selection Card */}
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

      {/* Navigation Footer */}
      <SetupStepFooter onNext={onNext} onPrev={onPrev} prevLabel={prevLabel} />
    </div>
  );
};

export default StudentScopeView;
