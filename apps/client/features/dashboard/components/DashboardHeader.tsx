"use client";

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
    </div>
  );
}
