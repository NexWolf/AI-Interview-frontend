"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Skeleton } from "./Skeleton";

export type LoadingVariant = "spinner" | "overlay" | "skeleton" | "bar";
export type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface LoadingProps {
  /** Visual presentation mode */
  variant?: LoadingVariant;

  /** Controls whether loading state is active (for overlay wrapper mode) */
  active?: boolean;

  /** Primary label/message */
  text?: string;

  /** Secondary subtext */
  subtext?: string;

  /** Size of the spinner/indicator */
  size?: LoadingSize;

  /** Covers full screen/viewport */
  fullPage?: boolean;

  /** Whether to apply backdrop blur in overlay mode */
  blur?: boolean;

  /** Number of skeleton cards to render if variant is 'skeleton' */
  skeletonCount?: number;

  /** Height of skeleton cards */
  skeletonHeight?: string;

  /** Children to wrap when used as an overlay */
  children?: React.ReactNode;

  /** Custom container class */
  className?: string;

  /** Custom spinner class */
  spinnerClassName?: string;
}

const sizeClasses: Record<LoadingSize, { icon: string; text: string; subtext: string }> = {
  xs: { icon: "w-3.5 h-3.5", text: "text-xs", subtext: "text-[10px]" },
  sm: { icon: "w-4 h-4", text: "text-xs", subtext: "text-[11px]" },
  md: { icon: "w-5 h-5", text: "text-sm", subtext: "text-xs" },
  lg: { icon: "w-7 h-7", text: "text-base", subtext: "text-xs" },
  xl: { icon: "w-10 h-10", text: "text-lg", subtext: "text-sm" },
};

export function Loading({
  variant = "spinner",
  active = true,
  text,
  subtext,
  size = "md",
  fullPage = false,
  blur = true,
  skeletonCount = 3,
  skeletonHeight = "h-24",
  children,
  className,
  spinnerClassName,
}: LoadingProps) {
  // If used as an overlay wrapper and not active, simply render children
  if (variant === "overlay" && !active && children) {
    return <>{children}</>;
  }

  const sizes = sizeClasses[size];

  // 1. Indeterminate Progress Bar
  if (variant === "bar") {
    return (
      <div className={cn("relative w-full h-1 overflow-hidden bg-primary/10 rounded-full", className)}>
        <div className="absolute top-0 bottom-0 left-0 bg-primary w-1/3 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full" />
      </div>
    );
  }

  // 2. Skeleton Cards
  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-3 w-full", className)}>
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <Skeleton key={idx} className={cn("w-full rounded-2xl", skeletonHeight)} />
        ))}
      </div>
    );
  }

  // Common Spinner & Text content
  const indicatorContent = (
    <div className="flex flex-col items-center justify-center gap-2.5 text-center">
      <div className="relative flex items-center justify-center">
        <Loader2
          className={cn(
            "animate-spin text-primary shrink-0",
            sizes.icon,
            spinnerClassName,
          )}
        />
      </div>

      {(text || subtext) && (
        <div className="space-y-0.5">
          {text && (
            <p className={cn("font-semibold text-foreground tracking-tight", sizes.text)}>
              {text}
            </p>
          )}
          {subtext && (
            <p className={cn("text-muted-foreground", sizes.subtext)}>
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );

  // 3. Overlay mode
  if (variant === "overlay") {
    const overlayElement = active ? (
      <div
        className={cn(
          fullPage ? "fixed inset-0 z-50" : "absolute inset-0 z-20",
          "flex items-center justify-center",
          "bg-background/60",
          blur && "backdrop-blur-xs",
          "transition-all duration-200",
          "pointer-events-auto",
        )}
        aria-live="polite"
        aria-busy="true"
      >
        <div className="px-5 py-3.5 rounded-2xl bg-card/90 border border-border shadow-xl backdrop-blur-md flex items-center gap-3 animate-in fade-in zoom-in-95 duration-150">
          <Loader2
            className={cn("animate-spin text-primary shrink-0", sizes.icon, spinnerClassName)}
          />
          {text && (
            <span className={cn("font-medium text-foreground", sizes.text)}>
              {text}
            </span>
          )}
        </div>
      </div>
    ) : null;

    if (children) {
      return (
        <div className={cn("relative", className)}>
          {overlayElement}
          <div
            className={cn(
              "transition-opacity duration-200",
              active && "opacity-40 pointer-events-none select-none",
            )}
          >
            {children}
          </div>
        </div>
      );
    }

    return overlayElement;
  }

  // 4. Standalone Spinner mode
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6",
        fullPage && "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        className,
      )}
      aria-live="polite"
      aria-busy="true"
    >
      {indicatorContent}
    </div>
  );
}

export default Loading;
