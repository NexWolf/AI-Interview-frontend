"use client";

import {
  VIOLATION_CATEGORY_OPTIONS,
  VIOLATION_TYPE_OPTIONS,
} from "../constants/violations.constants";

interface ViolationsFilterBarProps {
  showingCount: number;
  totalCount: number;
  categoryFilter: string;
  typeFilter: string;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function ViolationsFilterBar({
  showingCount,
  totalCount,
  categoryFilter,
  typeFilter,
  onCategoryChange,
  onTypeChange,
}: ViolationsFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
      <div className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{showingCount}</span> of{" "}
        <span className="font-semibold text-foreground">{totalCount}</span> security alerts
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          {VIOLATION_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          {VIOLATION_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
