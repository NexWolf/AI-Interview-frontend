"use client";

import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ListChecks,
  AlertCircle,
  FileCode2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { DevelopmentTask, DevelopmentTaskStatus } from "../types/task.types";
import { TaskStudyPackModal } from "./TaskStudyPackModal";
import { TaskGithubSubmitModal } from "./TaskGithubSubmitModal";
import { TaskInterviewTrigger } from "./TaskInterviewTrigger";

interface TaskWorkspaceCardProps {
  task: DevelopmentTask;
  allTasks: DevelopmentTask[];
  onSelectTask: (task: DevelopmentTask) => void;
  onSubmitSolution: (
    taskId: string | number,
    repoUrl: string
  ) => Promise<void>;
  onStartDiscussion?: (taskId: string | number) => void;
}

export function TaskWorkspaceCard({
  task,
  allTasks,
  onSelectTask,
  onSubmitSolution,
  onStartDiscussion,
}: TaskWorkspaceCardProps) {
  const [isStudyPackOpen, setIsStudyPackOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const difficultyColor = {
    Beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    Intermediate: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
    Advanced: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
  }[task.difficulty] || "bg-muted text-muted-foreground border-border";

  const statusDisplay: Record<
    DevelopmentTaskStatus,
    { label: string; className: string }
  > = {
    Pending: {
      label: "قيد الانتظار",
      className: "bg-muted/80 text-muted-foreground border-border",
    },
    InProgress: {
      label: "قيد العمل والتطبيق",
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    },
    Submitted: {
      label: "تم التسليم - بانتظار المناقشة",
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
    },
    Completed: {
      label: "مكتملة ومجتازة بنجاح",
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    },
    Rejected: {
      label: "بحاجة إلى مراجعة",
      className: "bg-destructive/10 text-destructive border-destructive/25",
    },
  };

  const currentStatus =
    statusDisplay[task.status] || statusDisplay.Pending;

  return (
    <>
      <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden mb-8 transition-all">
        {/* Step Selector Ribbon */}
        {allTasks.length > 1 && (
          <div className="border-b border-border/60 bg-muted/30 px-6 py-3 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-muted-foreground ml-2 shrink-0">
              مهام المشروع:
            </span>
            <div className="flex items-center gap-1.5 min-w-max">
              {allTasks.map((t) => {
                const isSelected = String(t.id) === String(task.id);
                const isDone = t.status === "Completed";
                const isSubmitted = t.status === "Submitted";

                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm font-bold"
                        : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isDone
                          ? "bg-emerald-500"
                          : isSubmitted
                          ? "bg-blue-500"
                          : isSelected
                          ? "bg-primary-foreground"
                          : "bg-muted-foreground/50"
                      }`}
                    />
                    <span>
                      {t.order}. {t.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              المهمة رقم {task.order}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${difficultyColor}`}
            >
              مستوى: {task.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{task.estimatedHours} ساعات تقديرية</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${currentStatus.className}`}
            >
              {currentStatus.label}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {task.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Objective Box */}
          {task.objective && (
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
              <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>الهدف الأساسي من هذه المهمة:</span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {task.objective}
              </p>
            </div>
          )}

          {/* Quick Implementation Steps Overview */}
          {task.implementationSteps && task.implementationSteps.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-primary" />
                <span>خطوات العمل المطلوبة:</span>
              </div>
              <div className="space-y-1.5">
                {task.implementationSteps.slice(0, 3).map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-foreground bg-muted/20 p-2.5 rounded-lg border border-border/50"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Concepts Tags Preview */}
          {task.concepts && task.concepts.length > 0 && (
            <div>
              <div className="text-xs font-bold text-muted-foreground mb-2">
                مفاهيم برمجية تتعلمها في هذه المهمة:
              </div>
              <div className="flex flex-wrap gap-2">
                {task.concepts.map((concept, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg border border-border bg-card text-xs font-mono font-medium text-foreground"
                  >
                    {concept.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Row: Study Pack & Submission Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsStudyPackOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" />
              <span>فتح الدليل التعليمي، الأكواد، وروابط الشرح</span>
            </button>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              <FaGithub className="w-4 h-4" />
              <span>
                {task.submission ? "تحديث رابط الحل (GitHub)" : "تسليم حل المهمة (GitHub)"}
              </span>
            </button>

            {task.submission && (
              <a
                href={task.submission}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                title="فتح مستودع GitHub المسلّم"
              >
                <FaGithub className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]" dir="ltr">
                  {task.submission.replace("https://github.com/", "")}
                </span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
        </div>

        {/* Code Discussion / Interview Banner (if solution is submitted) */}
        {(task.status === "Submitted" || Boolean(task.submission)) && (
          <div className="border-t border-border/80 bg-muted/20 p-6 sm:p-7">
            <TaskInterviewTrigger
              task={task}
              onStartDiscussion={() => onStartDiscussion?.(task.id)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <TaskStudyPackModal
        isOpen={isStudyPackOpen}
        onClose={() => setIsStudyPackOpen(false)}
        task={task}
      />

      <TaskGithubSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        taskId={task.id}
        taskTitle={task.title}
        currentSubmission={task.submission}
        onSubmit={async (url) => {
          await onSubmitSolution(task.id, url);
        }}
      />
    </>
  );
}
