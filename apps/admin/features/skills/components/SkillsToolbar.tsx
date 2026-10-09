"use client";

import { Search, Plus } from "lucide-react";

interface SkillsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeCount: number;
  totalCount: number;
  onOpenCreate: () => void;
}

export function SkillsToolbar({
  search,
  onSearchChange,
  activeCount,
  totalCount,
  onOpenCreate,
}: SkillsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search skills by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          Active: <strong className="text-foreground">{activeCount}</strong> / {totalCount}
        </span>
        <button
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>
    </div>
  );
}
