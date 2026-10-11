"use client";

import React from "react";
import { ArrowUpRight, TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  badge?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  iconClassName,
  badge,
  trend,
  onClick,
  className,
}: StatCardProps) {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={cn(
        "relative group p-5 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xs transition-all duration-200",
        isClickable && "hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40 cursor-pointer",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
          {title}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge}
          {Icon && (
            <div className={cn("p-2 rounded-xl bg-primary/10 text-primary shadow-xs", iconClassName)}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
        </div>
      </div>

      <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground truncate">
        {value}
      </div>

      {(sub || trend) && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-xs text-muted-foreground gap-2">
          {trend ? (
            <div className="flex items-center gap-1 font-medium truncate">
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              <span
                className={cn(
                  "font-semibold",
                  trend.isPositive ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {trend.value}
              </span>
              {trend.label && <span className="text-muted-foreground truncate">{trend.label}</span>}
            </div>
          ) : (
            <span className="truncate">{sub}</span>
          )}

          {isClickable && (
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-primary rtl:rotate-270" />
          )}
        </div>
      )}
    </div>
  );
}
