"use client";

import React from "react";
import { Briefcase } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useLanguage } from "@/shared/context/LanguageContext";

export interface JobDescriptionSectionProps {
  hasJobDescription: boolean;
  onToggle: (enabled: boolean) => void;
}

/**
 * Optional job description toggle & textarea for tailoring interview questions to a specific job listing.
 */
export const JobDescriptionSection: React.FC<JobDescriptionSectionProps> = ({
  hasJobDescription,
  onToggle,
}) => {
  const { t } = useLanguage();
  const { register } = useFormContext();

  return (
    <div className="p-4 rounded-2xl border border-border bg-card/60 flex flex-col gap-3">
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={hasJobDescription}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
        />
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          {t("setup.job.toggle")}
        </span>
      </label>

      {hasJobDescription && (
        <div className="mt-2 animate-in fade-in duration-200">
          <textarea
            {...register("job_description")}
            placeholder={t("setup.job.placeholder")}
            rows={4}
            className="w-full p-3.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed transition-all"
          />
        </div>
      )}
    </div>
  );
};

export default JobDescriptionSection;
