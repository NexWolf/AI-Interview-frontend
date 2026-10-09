"use client";

import { Search } from "lucide-react";
import {
  INTERVIEW_STATUS_OPTIONS,
  INTERVIEW_LANGUAGE_OPTIONS,
} from "../constants/interviews.constants";

interface InterviewsFiltersBarProps {
  search: string;
  statusFilter: string;
  langFilter: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onLangChange: (val: string) => void;
}

export function InterviewsFiltersBar({
  search,
  statusFilter,
  langFilter,
  onSearchChange,
  onStatusChange,
  onLangChange,
}: InterviewsFiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search candidate by name, email, or interview ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          {INTERVIEW_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={langFilter}
          onChange={(e) => onLangChange(e.target.value)}
          className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          {INTERVIEW_LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
