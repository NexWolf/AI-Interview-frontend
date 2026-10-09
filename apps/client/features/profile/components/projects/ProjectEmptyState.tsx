"use client";

import { useLanguage } from "@/shared/context/LanguageContext";

export function ProjectEmptyState() {
  const { t } = useLanguage();

  return (
    <div className="py-8 text-center text-xs text-muted-foreground italic">
      {t("profile.projects.empty")}
    </div>
  );
}
