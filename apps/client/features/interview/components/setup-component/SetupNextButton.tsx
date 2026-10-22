"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/context/LanguageContext";
import { AppButton } from "@/shared/components/ui/AppButton";

export interface SetupNextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional custom text. Defaults to localized "Next" or "Start Interview" */
  label?: string;
  /** Whether this is the final launch step (renders launch gradient & sparkles) */
  isLastStep?: boolean;
  /** Display a loading spinner and disable interaction */
  isLoading?: boolean;
  /** Custom icon override */
  icon?: React.ReactNode;
  /** Whether to show the directional arrow / status icon */
  showIcon?: boolean;
}

/**
 * Standardized primary action button for the interview setup wizard.
 * Uses shared AppButton pulling color tokens from `globals.css`.
 */
export const SetupNextButton: React.FC<SetupNextButtonProps> = ({
  label,
  isLastStep = false,
  isLoading = false,
  icon,
  showIcon = true,
  disabled = false,
  className,
  type = "button",
  children,
  ...props
}) => {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const defaultLabel = isLastStep ? t("setup.btn.start") : t("setup.btn.next");
  const buttonText = label || children || defaultLabel;

  const resolvedIcon = () => {
    if (!showIcon) return undefined;
    if (icon) return icon;
    if (isLastStep) return <Sparkles className="w-4 h-4 shrink-0" />;
    return (
      <ArrowRight
        className={cn("w-4 h-4 shrink-0 transition-transform", isAr && "rotate-180")}
      />
    );
  };

  return (
    <AppButton
      type={type}
      variant={isLastStep ? "gradient" : "primary"}
      size={isLastStep ? "lg" : "md"}
      isLoading={isLoading}
      disabled={disabled}
      icon={resolvedIcon()}
      iconPosition="end"
      className={className}
      {...props}
    >
      {buttonText}
    </AppButton>
  );
};

export interface SetupPrevButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional custom text. Defaults to localized "Previous" */
  label?: string;
}

/**
 * Standardized secondary "Previous" navigation button.
 * Uses shared AppButton with secondary/outline styling.
 */
export const SetupPrevButton: React.FC<SetupPrevButtonProps> = ({
  label,
  className,
  disabled = false,
  children,
  ...props
}) => {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const buttonText = label || children || t("setup.btn.prev");

  return (
    <AppButton
      type="button"
      variant="outline"
      size="md"
      disabled={disabled}
      icon={<ArrowLeft className={cn("w-4 h-4 shrink-0 transition-transform", isAr && "rotate-180")} />}
      iconPosition="start"
      className={className}
      {...props}
    >
      {buttonText}
    </AppButton>
  );
};

export interface SetupStepFooterProps {
  /** Handler for returning to previous step. If omitted, previous button is not rendered */
  onPrev?: () => void;
  /** Custom label for previous button */
  prevLabel?: string;
  /** Handler for advancing to next step */
  onNext?: () => void;
  /** Custom label for next button */
  nextLabel?: string;
  /** Whether next button is disabled */
  isNextDisabled?: boolean;
  /** Whether next button is in loading state */
  isNextLoading?: boolean;
  /** Mark as the final step (uses "Start" styling and type="submit") */
  isLastStep?: boolean;
  /** Button type for next button: "button" or "submit" */
  nextType?: "button" | "submit";
  /** Custom icon for next button */
  nextIcon?: React.ReactNode;
  /** Additional custom content to render in footer */
  extraContent?: React.ReactNode;
  /** Additional container styling */
  className?: string;
}

/**
 * Clean, unified navigation footer for setup wizard steps.
 * Aligns Previous (left/start) and Next/Submit (right/end) consistently across all steps.
 */
export const SetupStepFooter: React.FC<SetupStepFooterProps> = ({
  onPrev,
  prevLabel,
  onNext,
  nextLabel,
  isNextDisabled = false,
  isNextLoading = false,
  isLastStep = false,
  nextType = isLastStep ? "submit" : "button",
  nextIcon,
  extraContent,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center pt-5 border-t border-border/50 gap-3 w-full",
        onPrev ? "justify-between" : "justify-end",
        className
      )}
    >
      {onPrev && (
        <SetupPrevButton onClick={onPrev} label={prevLabel} />
      )}

      {extraContent && <div className="flex-1 px-2">{extraContent}</div>}

      <SetupNextButton
        type={nextType}
        onClick={onNext}
        label={nextLabel}
        isLastStep={isLastStep}
        isLoading={isNextLoading}
        disabled={isNextDisabled}
        icon={nextIcon}
      />
    </div>
  );
};

export default SetupNextButton;
