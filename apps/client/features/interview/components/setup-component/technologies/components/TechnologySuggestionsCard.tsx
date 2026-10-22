"use client";

import React from "react";
import { Sparkles, Plus } from "lucide-react";
import { SkillItem } from "../types";

export interface TechnologySuggestionsCardProps {
  isAr: boolean;
  availableUserSkills: SkillItem[];
  availableGeneralSkills: SkillItem[];
  onAddSkill: (id: string) => void;
}

export const TechnologySuggestionsCard: React.FC<TechnologySuggestionsCardProps> = ({
  isAr,
  availableUserSkills,
  availableGeneralSkills,
  onAddSkill,
}) => {
  if (availableUserSkills.length === 0 && availableGeneralSkills.length === 0) {
    return null;
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border/80 dark:border-border/50 bg-secondary/25 dark:bg-secondary/10 space-y-4 backdrop-blur-xs">
      <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          {isAr ? "اقتراحات سريعة بنقرة واحدة" : "Quick Suggestions"}
        </span>
        <span className="text-[11px] text-muted-foreground font-medium">
          {isAr ? "اضغط للإضافة الفورية للمقابلة" : "Click to quick-add"}
        </span>
      </div>

      {/* User's profile skills quick suggestions */}
      {availableUserSkills.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <label className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {isAr ? "مهارات ملفك الشخصي" : "Your Profile Skills"}
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableUserSkills.map((skill) => (
              <button
                key={`user-quick-${skill.id}`}
                type="button"
                onClick={() => onAddSkill(skill.id)}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/35 bg-primary/10 hover:border-primary/70 hover:bg-primary/20 text-xs font-semibold text-foreground hover:text-primary transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3 h-3 text-primary group-hover:scale-125 transition-transform" />
                <span>{skill.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* General popular suggestions */}
      {availableGeneralSkills.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {isAr ? "اقتراحات تقنية شائعة" : "Popular Technologies"}
            </label>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {availableGeneralSkills.slice(0, 18).map((skill) => (
              <button
                key={`gen-quick-${skill.id}`}
                type="button"
                onClick={() => onAddSkill(skill.id)}
                className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/70 dark:border-border/50 bg-background/80 hover:border-primary/50 hover:bg-primary/10 text-xs font-medium text-foreground hover:text-primary transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>{skill.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologySuggestionsCard;
