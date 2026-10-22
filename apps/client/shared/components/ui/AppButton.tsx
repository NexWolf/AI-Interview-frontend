"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/context/LanguageContext";

export interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant mapped to globals.css CSS variables */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient" | "danger";
  /** Size variant */
  size?: "sm" | "md" | "lg" | "icon";
  /** Loading state displaying a spinner */
  isLoading?: boolean;
  /** Optional leading or trailing icon */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: "start" | "end";
}

/**
 * Standardized, unified Button component across the entire application.
 * Pulls colors directly from CSS variables in `globals.css` (--primary, --button, --secondary, etc.).
 * Includes built-in loading spinner, micro-animations, and full RTL awareness.
 */
export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      iconPosition = "end",
      disabled = false,
      className,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const isDisabled = disabled || isLoading;

    // Variant classes mapped directly to globals.css color tokens
    const variantStyles: Record<string, string> = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm shadow-primary/20 border border-transparent focus-visible:ring-2 focus-visible:ring-primary/40",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border focus-visible:ring-2 focus-visible:ring-secondary/40",
      outline:
        "border border-border bg-background hover:bg-muted text-foreground focus-visible:ring-2 focus-visible:ring-primary/30",
      ghost:
        "hover:bg-muted/70 text-foreground focus-visible:ring-2 focus-visible:ring-primary/30",
      gradient:
        "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-primary-foreground shadow-md shadow-primary/25 border border-transparent ring-2 ring-primary/30",
      danger:
        "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 focus-visible:ring-2 focus-visible:ring-destructive/30",
    };

    // Size classes
    const sizeStyles: Record<string, string> = {
      sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
      md: "px-5 py-2.5 text-sm rounded-xl gap-2",
      lg: "px-7 py-3.5 text-base rounded-2xl font-bold gap-2.5",
      icon: "w-9 h-9 rounded-xl p-0 flex items-center justify-center",
    };

    const renderIcon = () => {
      if (isLoading) {
        return <Loader2 className="w-4 h-4 animate-spin shrink-0" />;
      }
      return icon || null;
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 select-none outline-none",
          "active:scale-[0.98] cursor-pointer",
          variantStyles[variant] || variantStyles.primary,
          sizeStyles[size] || sizeStyles.md,
          isDisabled &&
            "opacity-50 cursor-not-allowed pointer-events-none shadow-none ring-0",
          className
        )}
        {...props}
      >
        {iconPosition === "start" && renderIcon()}
        {children && <span>{children}</span>}
        {iconPosition === "end" && renderIcon()}
      </button>
    );
  }
);

AppButton.displayName = "AppButton";

export default AppButton;
