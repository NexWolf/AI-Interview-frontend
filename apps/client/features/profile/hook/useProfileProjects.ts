"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLanguage } from "@/shared/context/LanguageContext";
import { codebaseService } from "@/features/interview/services/codebase.service";
import { useGetAllInterviews } from "@/features/interview/hooks/ReactQueryHooks/useGetAllInterviews";
import { ProjectItem, ProjectFormData, ProfileProjectsProps } from "../types/profileProjects.types";
import { DEFAULT_PROJECTS, INITIAL_PROJECT_FORM } from "../constants/projects.constants";

export function useProfileProjects({ username }: ProfileProjectsProps = {}) {
  const router = useRouter();
  const { language } = useLanguage();
  const isAr = language === "ar";
  const storageKey = username ? `profile_projects_${username}` : "profile_projects_me";

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Codebase analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingProjectId, setAnalyzingProjectId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_PROJECT_FORM);

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

  const saveToStorage = useCallback(
    (updated: ProjectItem[]) => {
      setProjects(updated);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
    },
    [storageKey]
  );

  const handleFieldChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData(INITIAL_PROJECT_FORM);
    setDialogOpen(true);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      role: project.role,
      period: project.period,
      description: project.description,
      technologiesInput: project.technologies.join(", "),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    saveToStorage(updated);
    toast.success(isAr ? "تم حذف المشروع بنجاح" : "Project deleted successfully");
  };

  const handleStartProjectInterview = async (project: ProjectItem) => {
    let projectId = project.codebaseProjectId;

    // If not analyzed yet and has valid githubUrl, analyze now on the fly
    if (!projectId && project.githubUrl && project.githubUrl.includes("github.com/")) {
      setAnalyzingProjectId(project.id);
      toast.info(isAr ? "جاري تحليل كود المشروع قبل بدء المقابلة..." : "Analyzing codebase before interview...");
      try {
        const result = await codebaseService.analyzeRepository(project.githubUrl.trim());
        projectId = result.projectId;
        const updated = projects.map((p) =>
          p.id === project.id
            ? {
                ...p,
                codebaseProjectId: result.projectId,
                isAnalyzed: true,
                analyzedStats: {
                  files: result.statistics?.analyzedFiles || result.statistics?.files || 0,
                  symbols: result.statistics?.symbols || 0,
                },
              }
            : p
        );
        saveToStorage(updated);
        toast.success(isAr ? "تم تحليل المستودع بنجاح!" : "Codebase analyzed successfully!");
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            (isAr
              ? "فشل تحليل مستودع GitHub للمقابلة. تأكد أن المستودع عام (Public)."
              : "Failed to analyze GitHub repo. Ensure it is public.")
        );
        setAnalyzingProjectId(null);
        return;
      } finally {
        setAnalyzingProjectId(null);
      }
    }

    if (projectId) {
      router.push(
        `/interview/setup?projectId=${encodeURIComponent(projectId)}`
      );
    } else {
      toast.error(
        isAr
          ? "يرجى إضافة رابط GitHub صالح لتحليل المشروع"
          : "Please provide a valid GitHub URL to analyze the project"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error(isAr ? "يرجى كتابة عنوان المشروع" : "Please enter project title");
      return;
    }

    const techArray = formData.technologiesInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const cleanGithubUrl = formData.githubUrl.trim();
    let codebaseProjectId = editingProject?.codebaseProjectId;
    let isAnalyzed = editingProject?.isAnalyzed || false;
    let analyzedStats = editingProject?.analyzedStats;

    // Trigger codebase analysis if githubUrl is provided and (new project or githubUrl changed or not yet analyzed)
    if (cleanGithubUrl && cleanGithubUrl.includes("github.com/")) {
      const urlChanged = editingProject ? editingProject.githubUrl !== cleanGithubUrl : true;
      if (urlChanged || !codebaseProjectId) {
        setIsAnalyzing(true);
        toast.info(isAr ? "جاري فحص وتحليل مستودع GitHub..." : "Analyzing GitHub repository...");
        try {
          const result = await codebaseService.analyzeRepository(cleanGithubUrl);
          codebaseProjectId = result.projectId;
          isAnalyzed = true;
          analyzedStats = {
            files: result.statistics?.analyzedFiles || result.statistics?.files || 0,
            symbols: result.statistics?.symbols || 0,
          };
          toast.success(
            isAr
              ? `تم تحليل الكود بنجاح! (${analyzedStats.files} ملف، ${analyzedStats.symbols} دالة)`
              : `Repository analyzed successfully! (${analyzedStats.files} files, ${analyzedStats.symbols} symbols)`
          );
        } catch (error: any) {
          console.warn("Failed to analyze repository on save:", error);
          toast.error(
            error?.response?.data?.message ||
              (isAr
                ? "فشل تحليل مستودع GitHub. تأكد أن المستودع عام (Public)."
                : "Failed to analyze GitHub repository. Ensure it is public.")
          );
        } finally {
          setIsAnalyzing(false);
        }
      }
    }

    if (editingProject) {
      const updated = projects.map((p) =>
        p.id === editingProject.id
          ? {
              ...p,
              title: formData.title.trim(),
              role: formData.role.trim(),
              period: formData.period.trim(),
              description: formData.description.trim(),
              technologies: techArray,
              githubUrl: cleanGithubUrl || undefined,
              liveUrl: formData.liveUrl.trim() || undefined,
              codebaseProjectId,
              isAnalyzed,
              analyzedStats,
            }
          : p
      );
      saveToStorage(updated);
      toast.success(isAr ? "تم تعديل المشروع بنجاح" : "Project updated successfully");
    } else {
      const newProj: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: formData.title.trim(),
        role: formData.role.trim(),
        period: formData.period.trim(),
        description: formData.description.trim(),
        technologies: techArray,
        githubUrl: cleanGithubUrl || undefined,
        liveUrl: formData.liveUrl.trim() || undefined,
        codebaseProjectId,
        isAnalyzed,
        analyzedStats,
      };
      saveToStorage([newProj, ...projects]);
      toast.success(isAr ? "تمت إضافة المشروع بنجاح" : "Project added successfully");
    }

    setDialogOpen(false);
  };

  // Fetch user interviews to match completed project evaluations
  const { data: interviewsData } = useGetAllInterviews({ limit: 100 });

  const projectsWithEvaluations = useMemo(() => {
    const list = Array.isArray(interviewsData) ? interviewsData : interviewsData?.interviews || [];
    const completedInterviews = list.filter((inv) => inv.status === "Completed" && inv.report);

    return projects.map((project) => {
      const matched = completedInterviews.find((inv) => {
        if (project.codebaseProjectId && String(inv.codebaseProjectId) === String(project.codebaseProjectId)) {
          return true;
        }
        if (project.githubUrl && inv.codebaseProject?.repositoryUrl) {
          const normProj = project.githubUrl.toLowerCase().replace(/\/+$/, "");
          const normInv = inv.codebaseProject.repositoryUrl.toLowerCase().replace(/\/+$/, "");
          if (normProj === normInv) return true;
        }
        return false;
      });

      if (!matched || !matched.report) {
        return project;
      }

      const evalInfo = {
        interviewId: String(matched.id),
        overallScore:
          typeof matched.report.overallScore === "number"
            ? matched.report.overallScore
            : Number(matched.report.overallScore || 0),
        technicalKnowledgeScore:
          typeof matched.report.technicalKnowledgeScore === "number"
            ? matched.report.technicalKnowledgeScore
            : Number(matched.report.technicalKnowledgeScore || 0),
        currentLevel: matched.report.currentLevel ? String(matched.report.currentLevel) : "Intermediate",
        completedAt: matched.endTime || matched.updatedAt || matched.createdAt,
        reportPdfUrl: matched.report.reportPdfUrl || null,
      };

      return {
        ...project,
        codebaseProjectId:
          project.codebaseProjectId ||
          (matched.codebaseProjectId ? String(matched.codebaseProjectId) : undefined),
        isAnalyzed: true,
        evaluation: evalInfo,
      };
    });
  }, [projects, interviewsData]);

  return {
    projects: projectsWithEvaluations,
    mounted,
    dialogOpen,
    editingProject,
    formData,
    isAnalyzing,
    analyzingProjectId,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseDialog,
    handleFieldChange,
    handleDelete,
    handleStartProjectInterview,
    handleSubmit,
  };
}
