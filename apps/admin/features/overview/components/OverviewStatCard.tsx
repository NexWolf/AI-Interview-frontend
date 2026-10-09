"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@repo/shared";
import { OverviewStatItem } from "../types/overview.types";

interface OverviewStatCardProps {
  stat: OverviewStatItem;
  onClick?: () => void;
}

export function OverviewStatCard({ stat, onClick }: OverviewStatCardProps) {
  const Icon = stat.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group p-5 rounded-2xl border bg-card/60 backdrop-blur-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        stat.bg,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {stat.title}
        </span>
        <div className={cn("p-2 rounded-xl bg-background/80 shadow-xs", stat.color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
        <span>{stat.sub}</span>
        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
