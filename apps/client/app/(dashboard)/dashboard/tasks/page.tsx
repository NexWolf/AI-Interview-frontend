"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ListTodo,
  CheckCircle2,
  Map,
  Loader2,
  AlertCircle,
  RefreshCw,
  FolderGit2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useLatestAnalysis,
  useAnalyzeInterview,
  useUpdateTask,
} from "@/features/tasks/hooks/useStudentDevelopment";
import { TaskPlacementBanner } from "@/features/tasks/components/TaskPlacementBanner";
import { TaskWorkspaceCard } from "@/features/tasks/components/TaskWorkspaceCard";
import { TaskRoadmapSection } from "@/features/tasks/components/TaskRoadmapSection";
import { TaskCompletedArchive } from "@/features/tasks/components/TaskCompletedArchive";
import { TaskRetakeModal } from "@/features/tasks/components/TaskRetakeModal";
import { TaskDefenseCelebrationModal } from "@/features/tasks/components/TaskDefenseCelebrationModal";
import { taskService } from "@/features/tasks/services/task.service";
import { DevelopmentTask } from "@/features/tasks/types/task.types";

function TasksLoadingSkeleton() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-36 bg-muted rounded-full" />
        <div className="h-8 w-72 bg-muted rounded-xl" />
        <div className="h-4 w-96 bg-muted/60 rounded-lg" />
      </div>

      <div className="h-48 w-full bg-muted/30 rounded-2xl border border-border" />

      <div className="flex gap-3 border-b border-border pb-3">
        <div className="h-9 w-32 bg-muted rounded-xl" />
        <div className="h-9 w-32 bg-muted rounded-xl" />
        <div className="h-9 w-32 bg-muted rounded-xl" />
      </div>

      <div className="h-96 w-full bg-muted/20 rounded-2xl border border-border" />
    </div>
  );
}

function TasksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewIdParam = searchParams.get("interviewId");
  const defenseCompletedParam = searchParams.get("defenseCompleted") === "true";
  const passedParam = searchParams.get("passed") !== "false";
  const defenseScoreParam = searchParams.get("defenseScore");
  const defenseTaskIdParam = searchParams.get("taskId");

  const [activeTab, setActiveTab] = useState<"active" | "roadmap" | "completed">(
    "active"
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(
    null
  );
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);
  const [isDefenseCelebrationOpen, setIsDefenseCelebrationOpen] = useState(false);

  const {
    data: latestAnalysis,
    isLoading: isFetchingLatest,
    error: fetchError,
    refetch,
  } = useLatestAnalysis();

  const analyzeMutation = useAnalyzeInterview();
  const updateTaskMutation = useUpdateTask();

  // Trigger analysis if interviewId is present in query parameters and not a defense completion
  const hasTriggeredAnalysis = useRef(false);
  useEffect(() => {
    if (interviewIdParam && !defenseCompletedParam && !hasTriggeredAnalysis.current) {
      hasTriggeredAnalysis.current = true;
      analyzeMutation.mutate(interviewIdParam, {
        onSuccess: () => {
          toast.success("تم تحليل مقابلتك وبناء خطة المهام التطبيقية بنجاح 🚀");
        },
        onError: (err) => {
          toast.error(
            err.message || "حدث خطأ أثناء تحليل المقابلة، يرجى المحاولة لاحقاً."
          );
        },
      });
    }
  }, [interviewIdParam, defenseCompletedParam, analyzeMutation]);

  // Handle defense completion: refetch latest analysis and open celebration modal
  const hasHandledDefense = useRef(false);
  useEffect(() => {
    if (defenseCompletedParam && !hasHandledDefense.current) {
      hasHandledDefense.current = true;
      refetch().then(() => {
        setIsDefenseCelebrationOpen(true);
      });
    }
  }, [defenseCompletedParam, refetch]);

  // Current active analysis: mutation result takes precedence, then fetched latest
  const analysis = analyzeMutation.data?.analysis || latestAnalysis || null;

  const tasks: DevelopmentTask[] = useMemo(() => {
    if (!analysis?.tasks) return [];
    return [...analysis.tasks].sort((a, b) => a.order - b.order);
  }, [analysis?.tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter((t) => t.status === "Completed");
  }, [tasks]);

  // Determine currently active task
  const activeTask: DevelopmentTask | null = useMemo(() => {
    if (tasks.length === 0) return null;
    if (selectedTaskId !== null) {
      const match = tasks.find((t) => String(t.id) === String(selectedTaskId));
      if (match) return match;
    }
    // Default to the first task that is NOT completed, or the first task
    return tasks.find((t) => t.status !== "Completed") || tasks[0];
  }, [tasks, selectedTaskId]);

  const defendedTask = useMemo(() => {
    if (defenseTaskIdParam) {
      const match = tasks.find((t) => String(t.id) === String(defenseTaskIdParam));
      if (match) return match;
    }
    return completedTasks[completedTasks.length - 1] || null;
  }, [tasks, defenseTaskIdParam, completedTasks]);

  // Handle GitHub solution submission
  const handleSubmitSolution = async (
    taskId: string | number,
    repoUrl: string
  ): Promise<void> => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId,
        submission: repoUrl,
        status: "Submitted",
      });
      toast.success(
        "تم تسليم رابط الحل بنجاح! يمكنك الآن بدء المقابلة الصوتية لمناقشة الكود."
      );
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "تعذر تحديث تسليم المهمة، يرجى التحقق من الاتصال.";
      toast.error(errorMsg);
      throw err;
    }
  };

  const handleStartDiscussion = async (taskId: string | number) => {
    try {
      const res = await taskService.startTaskDefenseInterview(taskId);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("is_task_defense", "true");
        sessionStorage.setItem("defense_task_id", String(taskId));
      }
      toast.success("تم تجهيز غرفة المناقشة وفحص مستودع GitHub بنجاح! جاري الدخول...");
      router.push(`/interview/${res.interview.id}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as any)?.response?.data?.message || "تعذر بدء المقابلة، يرجى التحقق من الاتصال.";
      toast.error(msg);
    }
  };

  const handleConfirmRetake = () => {
    setIsRetakeModalOpen(false);
    router.push("/interview/setup?mode=student_placement");
  };

  // State: AI is actively analyzing the interview from query param
  if (analyzeMutation.isPending) {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-300">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-card p-8 sm:p-12 text-center max-w-2xl mx-auto my-12 shadow-xl space-y-6">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>وكيل تطوير الطلاب الذكي (AI Student Development Agent)</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              جاري فحص إجابات المقابلة وبناء خطتك العملية...
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              يقوم الذكاء الاصطناعي الآن بتحليل إجاباتك الاستكشافية، وتحديد نقاط القوة والفجوات التقنية، وتصميم مشروع تخرّج عملي مع حقائب تعليمية ومهام خطوة بخطوة.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/40 max-w-md mx-auto text-xs text-muted-foreground space-y-2 text-right">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>استخراج مستوى الخبرة وتفضيلات المسار المهني</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>هيكلة مشروع بورتفوليو واقعي بالتقنيات الملائمة</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
              <span>توليد المهام البرمجية ومعايير القبول والأكواد الاسترشادية</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State: Initial fetch loading
  if (isFetchingLatest && !analysis) {
    return <TasksLoadingSkeleton />;
  }

  // State: Error during query or mutation
  const activeError = analyzeMutation.error || fetchError;
  if (activeError && !analysis) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-lg mx-auto my-12 space-y-4">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
        <h3 className="text-base font-bold text-foreground">
          حدث خطأ أثناء تحليل المقابلة أو تحميل بيانات المهام
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {activeError.message || "تعذر الاتصال بالخادم، يرجى إعادة المحاولة."}
        </p>
        <button
          onClick={() => {
            if (interviewIdParam) {
              analyzeMutation.mutate(interviewIdParam);
            } else {
              refetch();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام الأكاديمية التكيفية الذكي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            مسار المهام والتدريب العملي (Learning Tasks)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            مهام برمجية مصممة خصيصاً لمستواك، مدعومة بحقائب تعليمية، أكواد استرشادية، ومناقشات شفهية دفاعية مع الذكاء الاصطناعي.
          </p>
        </div>

        {analysis && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsRetakeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/30 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              title="إعادة خوض المقابلة الاستكشافية لتحديث المسار"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة استكشاف المسار</span>
            </button>
          </div>
        )}
      </div>

      {/* Diagnostic Placement Interview Banner */}
      <TaskPlacementBanner
        profile={analysis?.profile || null}
        roadmap={analysis?.roadmap || null}
        onOpenRetake={() => setIsRetakeModalOpen(true)}
      />

      {/* Tabs Navigation (only shown if analysis and tasks exist) */}
      {analysis && tasks.length > 0 && (
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "active"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>المهمة النشطة الحالية</span>
            {activeTask && (
              <span
                className={`w-2 h-2 rounded-full ${
                  activeTab === "active" ? "bg-white" : "bg-primary"
                }`}
              />
            )}
          </button>

          {analysis.roadmap && (
            <button
              onClick={() => setActiveTab("roadmap")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "roadmap"
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <Map className="w-4 h-4" />
              <span>خطة ومشروع المسار</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("completed")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "completed"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>المهام المكتملة</span>
            {completedTasks.length > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  activeTab === "completed"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {completedTasks.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Tab Content */}
      {analysis && tasks.length > 0 ? (
        <>
          {activeTab === "active" && (
            <>
              {activeTask ? (
                <TaskWorkspaceCard
                  task={activeTask}
                  allTasks={tasks}
                  onSelectTask={(t) => setSelectedTaskId(t.id)}
                  onSubmitSolution={handleSubmitSolution}
                  onStartDiscussion={handleStartDiscussion}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-foreground">
                    لقد أتممت جميع المهام المتاحة في هذا المشروع بنجاح! 🎉
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                    تهانينا! يمكنك مراجعة كودك ومعايير القبول في تبويب المهام المكتملة، أو إعادة استكشاف المسار لمشروع أكثر تقدماً.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "roadmap" && analysis.roadmap && (
            <TaskRoadmapSection roadmap={analysis.roadmap} />
          )}

          {activeTab === "completed" && (
            <TaskCompletedArchive completedTasks={completedTasks} />
          )}
        </>
      ) : null}

      {/* Retake Confirmation Modal */}
      <TaskRetakeModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onConfirm={handleConfirmRetake}
      />

      {/* Task Defense Celebration / Feedback Modal */}
      <TaskDefenseCelebrationModal
        isOpen={isDefenseCelebrationOpen}
        onClose={() => {
          setIsDefenseCelebrationOpen(false);
          router.replace("/dashboard/tasks");
        }}
        passed={passedParam}
        score={defenseScoreParam || (defendedTask?.review as any)?.score}
        taskTitle={defendedTask?.title}
        taskOrder={defendedTask?.order}
        congratulatoryMessage={
          (defendedTask?.review as any)?.congratulatoryMessage
        }
        feedbackSummary={(defendedTask?.review as any)?.feedbackSummary}
        masteredConcepts={(defendedTask?.review as any)?.masteredConcepts || []}
        gapsIdentified={(defendedTask?.review as any)?.gapsIdentified || []}
        onProceedToNextTask={() => {
          setIsDefenseCelebrationOpen(false);
          router.replace("/dashboard/tasks");
          const nextTask = tasks.find((t) => t.status !== "Completed");
          if (nextTask) {
            setSelectedTaskId(nextTask.id);
          }
        }}
      />
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<TasksLoadingSkeleton />}>
      <TasksContent />
    </Suspense>
  );
}
