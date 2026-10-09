"use client";

import { Search } from "lucide-react";

interface ReportsHeaderBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
}

export function ReportsHeaderBar({
  search,
  onSearchChange,
  totalCount,
}: ReportsHeaderBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search evaluation reports by candidate or feedback..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
        />
      </div>

      <div className="text-xs text-muted-foreground">
        Total evaluations: <span className="font-semibold text-foreground">{totalCount}</span>
      </div>
    </div>
  );
}
