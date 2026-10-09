"use client";

import { useLanguage } from "@/shared/context/LanguageContext";
import LanguageToggleButton from "./LanguageToggleButton";
import ThemeToggleButton from "./ThemeToggleButton";
import { cn } from "@/shared/lib/utils";

interface DashboardNavbarProps {
  className?: string;
}

export default function DashboardNavbar({ className }: DashboardNavbarProps) {
  const { t } = useLanguage();

  return (
    <header
      className={cn(
        "hidden md:flex sticky top-0 z-30 h-16 border-b border-border/50 bg-background/80 backdrop-blur px-8 items-center justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t("dashboard.nav.candidate")}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <LanguageToggleButton />
        <ThemeToggleButton />
      </div>
    </header>
  );
}
