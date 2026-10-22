"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { InterviewLanguage } from "@/features/interview/types/setup";

interface LanguageOption {
  id: number;
  value: InterviewLanguage;
  mainTitle: string;
  subTitle: string;
}

const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  {
    id: 1,
    value: "Arabic",
    mainTitle: "العربية",
    subTitle: "Arabic",
  },
  {
    id: 2,
    value: "English",
    mainTitle: "English",
    subTitle: "English",
  },
] as const;

export const LanguageSelect: React.FC = () => {
  const { register, watch } = useFormContext();
  const selectedLanguage = watch("interviewLanguage");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full" role="radiogroup" aria-label="Interview Language">
      {LANGUAGE_OPTIONS.map((lan) => {
        const isSelected = selectedLanguage === lan.value;

        return (
          <label
            key={lan.id}
            className={cn(
              "relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none shadow-xs hover:shadow-md active:scale-[0.98]",
              isSelected
                ? "border-primary bg-primary/10 dark:bg-primary/15 ring-1 ring-primary/30"
                : "border-border bg-card/60 hover:bg-muted/50 hover:border-primary/40"
            )}
          >
            <div className="flex items-center gap-3.5">
              {/* Radio Custom Indicator */}
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  value={lan.value}
                  {...register("interviewLanguage")}
                  className="sr-only"
                  aria-checked={isSelected}
                />
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30 bg-transparent"
                  )}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>

              {/* Labels */}
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {lan.mainTitle}
                </span>
                <span className="text-xs text-muted-foreground">
                  {lan.subTitle}
                </span>
              </div>
            </div>

            {/* Icon */}
            <Globe
              className={cn(
                "w-5 h-5 transition-all duration-200",
                isSelected ? "text-primary scale-110" : "text-muted-foreground"
              )}
            />
          </label>
        );
      })}
    </div>
  );
};

export default LanguageSelect;