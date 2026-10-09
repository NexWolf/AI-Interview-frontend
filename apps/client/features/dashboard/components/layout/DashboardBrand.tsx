"use client";

import Link from "next/link";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/shared/lib/utils";

interface DashboardBrandProps {
  className?: string;
  onClick?: () => void;
}

export default function DashboardBrand({ className, onClick }: DashboardBrandProps) {
  const { t } = useLanguage();

  return (
    <Link
      href="/dashboard"
      onClick={onClick}
      className={cn("flex items-center gap-2.5 group", className)}
    >
      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 shrink-0">
        AI
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm leading-tight truncate">{t("dashboard.brand")}</p>
        <p className="text-[11px] text-muted-foreground truncate">{t("dashboard.nav.candidate")}</p>
      </div>
    </Link>
  );
}
