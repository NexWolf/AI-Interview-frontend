import React from "react";
import { cn } from "@/shared/lib/utils";

interface CareerDiscoveryOptionsProps {
  options: Array<{ id: string; label: string }>;
  answerText: string;
  onSelectOption: (newAnswer: string) => void;
  disabled?: boolean;
  freeTextPrompt?: string;
}

/**
 * Career Discovery multiple-choice options selector.
 * Parses and syncs selected choice with free text notes.
 */
export const CareerDiscoveryOptions: React.FC<CareerDiscoveryOptionsProps> = ({
  options,
  answerText,
  onSelectOption,
  disabled,
  freeTextPrompt,
}) => {
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (options && answerText) {
      const match = options.find((opt) =>
        answerText.startsWith(`${opt.id}:`) ||
        answerText.startsWith(`${opt.id} -`) ||
        answerText.startsWith(`${opt.id})`)
      );
      setSelectedOptionId(match ? match.id : null);
    } else {
      setSelectedOptionId(null);
    }
  }, [options, answerText]);

  const handleSelect = (optId: string, optLabel: string) => {
    setSelectedOptionId(optId);

    // Extract any existing free text note after the option prefix if present
    let extraNotes = "";
    if (answerText) {
      const stripped = answerText.replace(/^[A-Da-d]:[^\-\n]*(- )?/, "").trim();
      if (stripped && !options.some((o) => o.label === stripped)) {
        extraNotes = ` - ${stripped}`;
      }
    }

    const newAnswer = `${optId}: ${optLabel}${extraNotes}`;
    onSelectOption(newAnswer);
  };

  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-2 py-1">
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5 text-primary">
          <span>🎯 اختر الخيار الأنسب لك:</span>
        </span>
        {selectedOptionId && (
          <span className="text-[11px] text-primary/80 font-medium">
            الخيار المحدد ({selectedOptionId})
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] sm:max-h-[160px] overflow-y-auto pr-1">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id, opt.label)}
              disabled={disabled}
              className={cn(
                "flex items-start gap-2.5 p-2.5 rounded-xl border text-right transition-all cursor-pointer text-xs leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed",
                isSelected
                  ? "bg-primary/15 border-primary text-foreground shadow-sm ring-1 ring-primary/40 font-medium"
                  : "bg-muted/40 hover:bg-muted/80 border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-lg text-[11px] font-bold shrink-0 mt-0.5",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-muted-foreground"
                )}
              >
                {opt.id}
              </span>
              <span className="flex-1">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {freeTextPrompt && (
        <p className="text-[11px] text-muted-foreground/90 flex items-center gap-1 pt-0.5">
          <span>💡</span>
          <span>{freeTextPrompt}</span>
        </p>
      )}
    </div>
  );
};
