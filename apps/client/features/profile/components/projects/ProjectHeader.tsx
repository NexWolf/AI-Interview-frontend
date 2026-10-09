"use client";

import { FolderGit2, Plus } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";

interface ProjectHeaderProps {
  editable?: boolean;
  onAddProject: () => void;
}

export function ProjectHeader({ editable = false, onAddProject }: ProjectHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-4">
      <div>
        <h2 className="text-base font-bold flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-primary" />
          {t("profile.projects.title")}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("profile.projects.desc")}
        </p>
      </div>

      {editable && (
        <button
          type="button"
          onClick={onAddProject}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t("profile.projects.add")}</span>
        </button>
      )}
    </div>
  );
}
