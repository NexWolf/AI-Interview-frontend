"use client";

import React from "react";
import { Award, X } from "lucide-react";
import { SkillItem } from "../types";

export interface SelectedSkillsBoxProps {
  isAr: boolean;
  selectedSkillsIds: string[];
  skillMap: Map<string, SkillItem>;
  onRemoveSkill: (id: string) => void;
  onClearAll: () => void;
  errorMessage?: string;
}

export const SelectedSkillsBox: React.FC<SelectedSkillsBoxProps> = ({
  isAr,
  selectedSkillsIds,
  skillMap,
  onRemoveSkill,
  onClearAll,
  errorMessage,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-primary" />
          <span>
            {isAr
              ? `التقنيات المختارة (${selectedSkillsIds.length})`
              : `Selected Technologies (${selectedSkillsIds.length})`}
          </span>
        </label>
        {selectedSkillsIds.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          >
            {isAr ? "مسح الكل" : "Clear all"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl border border-border/70 dark:border-border/40 bg-secondary/20 dark:bg-secondary/10 min-h-[58px] items-center backdrop-blur-xs">
        {selectedSkillsIds.length > 0 ? (
          selectedSkillsIds.map((id) => {
            const skill = skillMap.get(id);
            const displayName = skill?.name || id;

            return (
              <div
                key={id}
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/10 text-primary px-3 py-1.5 text-xs font-semibold shadow-2xs transition-all animate-in zoom-in-95"
              >
                <span>{displayName}</span>
                <button
                  type="button"
                  onClick={() => onRemoveSkill(id)}
                  aria-label={`Remove ${displayName}`}
                  className="rounded-md p-0.5 text-primary/70 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground px-1 select-none">
            {isAr
              ? "لم يتم اختيار أي تقنيات بعد. اختر من القائمة أدناه أو انقر على المقترحات السريعة."
              : "No technologies selected yet. Choose from the dropdown below or click the quick suggestions."}
          </p>
        )}
      </div>

      {errorMessage && (
        <p className="text-destructive text-xs font-medium px-1 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default SelectedSkillsBox;
