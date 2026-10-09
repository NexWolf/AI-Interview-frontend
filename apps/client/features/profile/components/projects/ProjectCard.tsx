"use client";

import Link from "next/link";
import {
  Calendar,
  Pencil,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  Loader2,
  Award,
  CheckCircle2,
  RotateCcw,
  FileText,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useLanguage } from "@/shared/context/LanguageContext";
import { ProjectItem } from "../../types/profileProjects.types";

interface ProjectCardProps {
  project: ProjectItem;
  editable?: boolean;
  isAnalyzingThisProject?: boolean;
  onEdit: (project: ProjectItem) => void;
  onDelete: (id: string) => void;
  onStartInterview: (project: ProjectItem) => void;
}

export function ProjectCard({
  project,
  editable = false,
  isAnalyzingThisProject = false,
  onEdit,
  onDelete,
  onStartInterview,
}: ProjectCardProps) {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const score = project.evaluation?.overallScore ?? null;
  const scoreBadgeColor =
    score !== null
      ? score >= 80
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        : score >= 60
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      : "";

  return (
    <div className="group relative rounded-xl border border-border/60 bg-background/50 hover:bg-muted/30 hover:border-border transition-all p-4 flex flex-col justify-between space-y-3">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-foreground leading-snug">
                {project.title}
              </h3>

              {/* Evaluation score badge if tested */}
              {project.evaluation ? (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${scoreBadgeColor}`}
                  title={isAr ? "تقييم المقابلة البرمجية لهذا المشروع" : "Project interview score"}
                >
                  <Award className="w-3 h-3" />
                  <span>
                    {isAr ? `التقييم: ${project.evaluation.overallScore}%` : `Score: ${project.evaluation.overallScore}%`}
                  </span>
                </span>
              ) : project.isAnalyzed && project.codebaseProjectId ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{isAr ? "جاهز للمقابلة البرمجية" : "AI Interview Ready"}</span>
                </span>
              ) : null}
            </div>
            {project.role && (
              <p className="text-xs font-medium text-primary mt-0.5">
                {project.role}
              </p>
            )}
          </div>

          {/* Edit / Delete actions */}
          {editable && (
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title={t("profile.projects.edit")}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(project.id)}
                className="p-1 rounded-md text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {project.period && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{project.period}</span>
          </div>
        )}

        {project.description && (
          <p className="text-xs text-muted-foreground/90 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      <div className="space-y-3 pt-2 border-t border-border/40">
        {/* Project Evaluation Banner if tested */}
        {project.evaluation && (
          <div className="rounded-lg p-2.5 bg-gradient-to-r from-emerald-500/10 via-primary/5 to-transparent border border-emerald-500/20 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                  project.evaluation.overallScore >= 80
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : project.evaluation.overallScore >= 60
                    ? "bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400"
                    : "bg-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400"
                }`}
              >
                {project.evaluation.overallScore}%
              </div>
              <div>
                <div className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{isAr ? "تم تقييم كود المشروع بالـ AI" : "AI Code Assessment"}</span>
                  {project.evaluation.currentLevel && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted/80 text-muted-foreground font-normal border border-border/40">
                      {project.evaluation.currentLevel}
                    </span>
                  )}
                </div>
                {project.evaluation.completedAt && (
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(project.evaluation.completedAt).toLocaleDateString(
                      isAr ? "ar-EG" : "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </span>
                )}
              </div>
            </div>

            <Link
              href={`/dashboard/interviewDetails?id=${project.evaluation.interviewId}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shrink-0 shadow-2xs hover:shadow-xs active:scale-95"
              title={isAr ? "عرض التقرير المفصل للمقابلة" : "View Detailed Report"}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isAr ? "عرض التقرير" : "View Report"}</span>
            </Link>
          </div>
        )}

        {/* Tech badges */}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/60 text-muted-foreground border border-border/40"
              >
                <Layers className="w-2.5 h-2.5 opacity-60" />
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* External links & Start/Retake Interview CTA */}
        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          <div className="flex items-center gap-3 text-xs">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaGithub className="w-3.5 h-3.5" />
                <span>{t("profile.projects.github")}</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t("profile.projects.liveDemo")}</span>
              </a>
            )}
          </div>

          {project.githubUrl && (
            <button
              type="button"
              onClick={() => onStartInterview(project)}
              disabled={isAnalyzingThisProject}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 ml-auto rtl:ml-0 rtl:mr-auto ${
                project.evaluation
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                  : "bg-gradient-to-r from-primary to-primary/85 hover:from-primary/95 hover:to-primary text-primary-foreground"
              }`}
              title={
                isAr
                  ? project.evaluation
                    ? "إعادة المقابلة التقنية لهذا المشروع"
                    : "بدء مقابلة تقنية مبنية على كود هذا المشروع"
                  : project.evaluation
                  ? "Retake technical interview for this project"
                  : "Start technical interview on this project codebase"
              }
            >
              {isAnalyzingThisProject ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isAr ? "جاري التحليل..." : "Analyzing..."}</span>
                </>
              ) : project.evaluation ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isAr ? "إعادة المقابلة" : "Retake Interview"}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? "بدء مقابلة للمشروع" : "Start Project Interview"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
