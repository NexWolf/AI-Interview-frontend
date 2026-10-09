import React from "react";
import { cn } from "@/shared/lib/utils";

interface ScoreBarProps {
  value: number;
  className?: string;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ value, className }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("h-2 rounded-full bg-muted overflow-hidden", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          clampedValue >= 75
            ? "bg-emerald-500"
            : clampedValue >= 50
            ? "bg-amber-500"
            : "bg-rose-500"
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};

export default ScoreBar;
