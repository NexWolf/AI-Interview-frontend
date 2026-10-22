"use client";

import React from "react";
import { Zap } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { PRESET_ROLES, PresetRole } from "@/features/interview/hooks/useInterviewSetupWizard";

export interface RolePresetsGridProps {
  onApplyPreset: (preset: PresetRole) => void;
}

/**
 * Quick role presets section that auto-selects key technologies for common tech roles.
 */
export const RolePresetsGrid: React.FC<RolePresetsGridProps> = ({ onApplyPreset }) => {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  return (
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
            onClick={() => onApplyPreset(preset)}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/80 bg-background/80 hover:bg-muted hover:border-primary/50 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <span className="text-base">{preset.icon}</span>
            <span className="truncate">{isAr ? preset.nameAr : preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RolePresetsGrid;
