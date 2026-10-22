"use client";

import React from "react";
import { FolderGit2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/shared/context/LanguageContext";
import { useFormContext } from "react-hook-form";
import { AppButton } from "@/shared/components/ui/AppButton";

export interface LinkedProjectBannerProps {
  projectId: string;
  onDetach: () => void;
}

/**
 * Dedicated card displaying linked project codebase context for project-based interviews.
 * Allows candidates to detach and switch back to general interview mode.
 */
export const LinkedProjectBanner: React.FC<LinkedProjectBannerProps> = ({
  projectId,
  onDetach,
}) => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { setValue } = useFormContext();

  const handleSwitchToGeneral = () => {
    onDetach();
    setValue("projectId", undefined);
    toast.info(
      isAr ? "تم التحويل إلى مقابلة عامة" : "Switched to standard interview"
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20 shrink-0 mt-0.5">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {isAr
                  ? "مقابلة مبنية على المشروع"
                  : "Project-Based Technical Interview"}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {isAr ? "كود المشروع متصل" : "Codebase Linked"}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mt-1">
              {isAr
                ? `مشروع برمجي مرتبط (#${projectId})`
                : `Linked Project Codebase (#${projectId})`}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
              {isAr
                ? "سيقوم المحاور الذكي بسؤالك عن معمارية هذا المشروع، اتخاذ القرارات الهندسية، وفحص الكود الحقيقي مباشرة."
                : "The AI interviewer will evaluate you on this project's real codebase architecture, design patterns, and source code."}
            </p>
          </div>
        </div>

        <AppButton
          variant="outline"
          size="sm"
          onClick={handleSwitchToGeneral}
        >
          {isAr ? "التبديل لوضع عام" : "Switch to General"}
        </AppButton>
      </div>
    </div>
  );
};

export default LinkedProjectBanner;
