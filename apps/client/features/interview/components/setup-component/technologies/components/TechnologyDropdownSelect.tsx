"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { SkillItem } from "../types";

export interface TechnologyDropdownSelectProps {
  isAr: boolean;
  selectedSkillsIds: string[];
  userSkills?: any[];
  allSkillsList: SkillItem[];
  skillMap: Map<string, SkillItem>;
  onAddSkill: (id: string) => void;
}

export const TechnologyDropdownSelect: React.FC<TechnologyDropdownSelectProps> = ({
  isAr,
  selectedSkillsIds,
  userSkills,
  allSkillsList,
  skillMap,
  onAddSkill,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {isAr ? "اختر أو ابحث عن تقنية" : "Select or Search Technology"}
      </label>
      <div className="relative w-full">
        <select
          value=""
          onChange={(e) => {
            const selectedValue = e.target.value;
            if (selectedValue) {
              onAddSkill(selectedValue);
            }
          }}
          className="w-full h-11 pl-4 pr-10 rtl:pr-4 rtl:pl-10 text-sm bg-input/40 dark:bg-input/20 text-foreground rounded-2xl border border-border/70 dark:border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled hidden>
            {isAr ? "اختر تقنية لإضافتها إلى المقابلة..." : "Choose a technology to add..."}
          </option>

          {/* Profile Skills Option Group */}
          {userSkills && userSkills.length > 0 && (
            <optgroup label={isAr ? "مهاراتك المسجلة (من ملفك الشخصي)" : "Your Profile Skills"}>
              {userSkills.map((us) => {
                const id = String(us.skill?.id || us.skillId);
                const isAdded = selectedSkillsIds.includes(id);
                const name = skillMap.get(id)?.name || us.skill?.name || id;
                return (
                  <option
                    key={`user-${id}`}
                    value={id}
                    disabled={isAdded}
                    className="py-2 bg-background text-foreground"
                  >
                    {name} {isAdded ? (isAr ? "(مضافة)" : "(Added)") : ""}
                  </option>
                );
              })}
            </optgroup>
          )}

          {/* All Technologies Option Group */}
          <optgroup label={isAr ? "جميع التقنيات المتاحة" : "All Available Technologies"}>
            {allSkillsList.map((option) => {
              const isAlreadySelected = selectedSkillsIds.includes(option.id);
              return (
                <option
                  key={option.id}
                  value={option.id}
                  disabled={isAlreadySelected}
                  className="py-2 bg-background text-foreground"
                >
                  {option.name} {isAlreadySelected ? (isAr ? "(مضافة)" : "(Added)") : ""}
                </option>
              );
            })}
          </optgroup>
        </select>

        {/* Chevron Icon placed with RTL awareness */}
        <div className="pointer-events-none absolute right-3.5 rtl:right-auto rtl:left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default TechnologyDropdownSelect;
