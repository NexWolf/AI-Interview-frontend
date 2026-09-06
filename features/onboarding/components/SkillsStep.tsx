"use client";

import { Controller, get, useFormContext } from "react-hook-form";
import { 
  X, 
  ChevronDown, 
  Plus, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Award 
} from "lucide-react";

type PropsSkills = {
  onNext?: () => void;
  onBack?: () => void;
};

export const PREDEFINED_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "PostgreSQL",
  "Java",
  "HTML/CSS",
  "Git",
  "REST APIs",
];

const SkillsStep = ({ onNext, onBack }: PropsSkills) => {
  const {
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedSkills: string[] = watch("skills") || [];

  const addSkill = (skillToAdd: string) => {
    if (!selectedSkills.includes(skillToAdd)) {
      setValue("skills", [...selectedSkills, skillToAdd], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const removeSkills = (skillToRemove: string) => {
    const updated = selectedSkills.filter((skill) => skill !== skillToRemove);
    setValue("skills", updated, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
  };

  const skillsErrors = get(errors, "skills");

  // المهارات المقترحة التي لم يتم اختيارها بعد
  const availableSuggestions = PREDEFINED_SKILLS.filter(
    (s) => !selectedSkills.includes(s)
  );

  return (
    <div className="space-y-6">
      {/* 1. قسم المهارات المختارة (Selected Skills Container) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-primary" />
            <span>Selected Skills ({selectedSkills.length})</span>
          </label>
          {selectedSkills.length > 0 && (
            <button
              type="button"
              onClick={() => setValue("skills", [], { shouldValidate: true })}
              className="text-[11px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl border border-border/60 dark:border-border/40 bg-secondary/20 dark:bg-secondary/10 min-h-[58px] items-center backdrop-blur-xs">
          {selectedSkills.length > 0 ? (
            selectedSkills.map((skill, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/10 text-primary px-3 py-1.5 text-xs font-semibold shadow-2xs transition-all animate-in zoom-in-95"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkills(skill)}
                  aria-label={`Remove ${skill}`}
                  className="rounded-md p-0.5 text-primary/70 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground px-1 select-none">
              No skills selected yet. Choose from the list below or click the quick suggestions.
            </p>
          )}
        </div>

        {skillsErrors && (
          <p className="text-destructive text-xs font-medium px-1 mt-1">
            {String(skillsErrors.message)}
          </p>
        )}
      </div>

      {/* 2. القائمة المنسدلة لاختيار المهارات (Select Dropdown) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Select or Search Skill
        </label>
        <Controller
          name="skills"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="relative w-full">
              <select
                value=""
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue && !field.value.includes(selectedValue)) {
                    field.onChange([...field.value, selectedValue]);
                  }
                }}
                className="w-full h-11 pl-4 pr-10 text-sm bg-input/40 dark:bg-input/20 text-foreground rounded-2xl border border-border/70 dark:border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled hidden>
                  Choose a skill to add...
                </option>
                {PREDEFINED_SKILLS.map((option) => {
                  const isAlreadySelected = selectedSkills.includes(option);
                  return (
                    <option
                      key={option}
                      value={option}
                      disabled={isAlreadySelected}
                      className="py-2 bg-background text-foreground"
                    >
                      {option} {isAlreadySelected ? "(Added)" : ""}
                    </option>
                  );
                })}
              </select>

              {/* أيقونة السهم المنسدل */}
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          )}
        />
      </div>

      {/* 3. اقتراحات سريعة بنقرة واحدة (Quick Suggestions) */}
      {availableSuggestions.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Popular Suggestions (Click to quick-add)</span>
          </label>

          <div className="flex flex-wrap gap-1.5">
            {availableSuggestions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/60 dark:border-border/40 bg-card/60 dark:bg-card/20 hover:border-primary/40 hover:bg-primary/10 text-xs font-medium text-foreground hover:text-primary transition-all duration-150 active:scale-95 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>{skill}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. أزرار التنقل (Back & Continue) */}
      <div className="flex items-center justify-between pt-6 border-t border-border/50 dark:border-border/30">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60 dark:border-border/40 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-7 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-lg dark:shadow-none transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillsStep;