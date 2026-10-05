"use client";

import { useState, useEffect } from "react";
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Calendar,
  Pencil,
  Trash2,
  Code2,
  X,
  Layers,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface ProfileProjectsProps {
  editable?: boolean;
  username?: string;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "AI Interview Coach Platform",
    role: "Full-Stack Developer",
    period: "2024 - Present",
    description:
      "Engineered an interactive mock interview system with real-time speech evaluation, dynamic question generation, and candidate skill analytics.",
    technologies: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Web Speech API"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "proj-2",
    title: "Microservices Cloud Infrastructure",
    role: "Backend Engineer",
    period: "2023 - 2024",
    description:
      "Designed resilient asynchronous event pipelines using Docker and Redis, handling high-concurrency requests with low latency.",
    technologies: ["Python", "FastAPI", "Redis", "Docker", "PostgreSQL"],
    githubUrl: "https://github.com",
  },
];

export function ProfileProjects({ editable = false, username }: ProfileProjectsProps) {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const storageKey = username ? `profile_projects_${username}` : "profile_projects_me";

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");
  const [technologiesInput, setTechnologiesInput] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setProjects(JSON.parse(saved));
      } else {
        setProjects(DEFAULT_PROJECTS);
      }
    } catch {
      setProjects(DEFAULT_PROJECTS);
    }
  }, [storageKey]);

  const saveToStorage = (updated: ProjectItem[]) => {
    setProjects(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setTitle("");
    setRole("");
    setPeriod("");
    setDescription("");
    setTechnologiesInput("");
    setGithubUrl("");
    setLiveUrl("");
    setDialogOpen(true);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setTitle(project.title);
    setRole(project.role);
    setPeriod(project.period);
    setDescription(project.description);
    setTechnologiesInput(project.technologies.join(", "));
    setGithubUrl(project.githubUrl || "");
    setLiveUrl(project.liveUrl || "");
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    saveToStorage(updated);
    toast.success(isAr ? "تم حذف المشروع بنجاح" : "Project deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(isAr ? "يرجى كتابة عنوان المشروع" : "Please enter project title");
      return;
    }

    const techArray = technologiesInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProject) {
      const updated = projects.map((p) =>
        p.id === editingProject.id
          ? {
              ...p,
              title: title.trim(),
              role: role.trim(),
              period: period.trim(),
              description: description.trim(),
              technologies: techArray,
              githubUrl: githubUrl.trim() || undefined,
              liveUrl: liveUrl.trim() || undefined,
            }
          : p
      );
      saveToStorage(updated);
      toast.success(isAr ? "تم تعديل المشروع بنجاح" : "Project updated successfully");
    } else {
      const newProj: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: title.trim(),
        role: role.trim(),
        period: period.trim(),
        description: description.trim(),
        technologies: techArray,
        githubUrl: githubUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
      };
      saveToStorage([newProj, ...projects]);
      toast.success(isAr ? "تمت إضافة المشروع بنجاح" : "Project added successfully");
    }

    setDialogOpen(false);
  };

  if (!mounted) {
    return <div className="h-44 rounded-2xl bg-muted/40 animate-pulse" />;
  }

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header */}
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
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t("profile.projects.add")}</span>
          </button>
        )}
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground italic">
          {t("profile.projects.empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-xl border border-border/60 bg-background/50 hover:bg-muted/30 hover:border-border transition-all p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-snug">
                      {project.title}
                    </h3>
                    {project.role && (
                      <p className="text-xs font-medium text-primary mt-0.5">
                        {project.role}
                      </p>
                    )}
                  </div>

                  {/* Actions for editable */}
                  {editable && (
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(project)}
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        title={t("profile.projects.edit")}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
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

                {/* External links */}
                <div className="flex items-center gap-3 text-xs pt-1">
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="font-bold text-sm">
                {editingProject ? t("profile.projects.edit") : t("profile.projects.add")}
              </h3>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  {isAr ? "عنوان المشروع *" : "Project Title *"}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
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
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  value={technologiesInput}
                  onChange={(e) => setTechnologiesInput(e.target.value)}
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
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
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
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                >
                  {isAr ? "حفظ التغييرات" : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileProjects;
