"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { greeting } from "../utils/dashboard.utils";
import type { DashboardHeaderProps } from "../types/dashboard.types";

export default function DashboardHeader({ firstName, isAr }: DashboardHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {greeting(isAr)}, {firstName || (isAr ? "المرشح" : "Candidate")} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("dashboard.subtitle")}
        </p>
      </div>
      <Link
        href="/interview/setup"
        className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        {t("dashboard.nav.newInterview")}
      </Link>
    </div>
  );
}
