"use client";

import { X, Loader2 } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { ProjectFormData } from "../../types/profileProjects.types";

interface ProjectDialogProps {
  isOpen: boolean;
  isEditing: boolean;
  isAnalyzing: boolean;
  formData: ProjectFormData;
  onChangeField: (field: keyof ProjectFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ProjectDialog({
  isOpen,
  isEditing,
  isAnalyzing,
  formData,
  onChangeField,
  onSubmit,
  onClose,
}: ProjectDialogProps) {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <h3 className="font-bold text-sm">
            {isEditing ? t("profile.projects.edit") : t("profile.projects.add")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-foreground">
              {isAr ? "عنوان المشروع *" : "Project Title *"}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => onChangeField("title", e.target.value)}
              placeholder={isAr ? "مثال: منصة التجارة الإلكترونية" : "e.g. E-Commerce Platform"}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">
                {t("profile.projects.role")}
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => onChangeField("role", e.target.value)}
                placeholder={isAr ? "مثال: Full-Stack Developer" : "e.g. Full-Stack Developer"}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">
                {t("profile.projects.period")}
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => onChangeField("period", e.target.value)}
                placeholder={isAr ? "مثال: 2024 - 2025" : "e.g. 2024 - 2025"}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">
              {isAr ? "وصف المشروع" : "Project Description"}
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => onChangeField("description", e.target.value)}
              placeholder={
                isAr
                  ? "نبذة موجزة عن بنية المشروع وأهم ما أنجزته فيه..."
                  : "Brief summary of project architecture and your contributions..."
              }
              className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">
              {t("profile.projects.tech")} ({isAr ? "مفصولة بفاصلة" : "comma separated"})
            </label>
            <input
              type="text"
              value={formData.technologiesInput}
              onChange={(e) => onChangeField("technologiesInput", e.target.value)}
              placeholder="React, TypeScript, FastAPI, Docker"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">
                {t("profile.projects.github")} URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => onChangeField("githubUrl", e.target.value)}
                placeholder="https://github.com/..."
                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">
                {t("profile.projects.liveDemo")} URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => onChangeField("liveUrl", e.target.value)}
                placeholder="https://..."
                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isAr ? "جاري فحص المستودع..." : "Analyzing Repository..."}</span>
                </>
              ) : (
                <span>{isAr ? "حفظ التغييرات" : "Save Project"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
