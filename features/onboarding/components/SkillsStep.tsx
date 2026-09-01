"use client";
import { Controller, get, useFormContext } from "react-hook-form";
import FormHeader from "./FormHeader";

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
    formState: { errors, isSubmitting },
  } = useFormContext();
  const selectedSkills: string[] = watch("skills") || [];

  const removeSkills = (skillToRemove: string) => {
    const updateRemoveSkills = selectedSkills.filter(
      (skill, _) => skill !== skillToRemove,
    );
    setValue("skills", updateRemoveSkills, { shouldValidate: true });
  };

  const skillsErrors = get(errors, "skills");

  return (
    <div className="space-y-6 max-w-xl mx-auto p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
      {/* Header & Title */}
      <FormHeader
        leftStep="One step left"
        title="Technical Skills"
        description="text-xs text-muted-foreground"
      />

      {/* Selected Skills Chips */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2.5 p-3 bg-muted/30 rounded-xl border border-border/40 min-h-[52px] items-center">
          {selectedSkills.map((skill, index) => {
            return (
              <div
                key={index}
                className="group relative inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1.5 rounded-lg border border-border/60 shadow-2xs transition-all duration-150 hover:border-destructive/40"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkills(skill)}
                  type="button"
                  aria-label={`Remove ${skill}`}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md p-0.5 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Controller / Select Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Add Skill
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
                className="w-full h-11 pl-3.5 pr-10 text-sm bg-background text-foreground rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 appearance-none [-webkit-appearance:none] [-moz-appearance:none] cursor-pointer"
              >
                <option value="" disabled hidden>
                  Choose a skill to add...
                </option>
                {PREDEFINED_SKILLS.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="py-2 bg-background text-foreground"
                  >
                    {option}
                  </option>
                ))}
              </select>

              {/* Custom Arrow Icon */}
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground">
                <svg
                  className="w-4 h-4 opacity-70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          )}
        />

        {skillsErrors && (
          <p className="text-destructive text-xs mt-1.5 font-medium">
            {String(skillsErrors.message)}
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer"
          >
            Back
          </button>
        )}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl font-medium text-sm shadow-xs transition-all duration-200 cursor-pointer"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillsStep;
