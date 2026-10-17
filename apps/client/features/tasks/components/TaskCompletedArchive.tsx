"use client";

import { useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ListChecks,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { DevelopmentTask } from "../types/task.types";
import { TaskStudyPackModal } from "./TaskStudyPackModal";

interface TaskCompletedArchiveProps {
  completedTasks: DevelopmentTask[];
}

export function TaskCompletedArchive({
  completedTasks,
}: TaskCompletedArchiveProps) {
  const [selectedTask, setSelectedTask] = useState<DevelopmentTask | null>(
    null
  );
  const [expandedTaskId, setExpandedTaskId] = useState<string | number | null>(
    null
  );

  if (!completedTasks || completedTasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto mb-3">
          <Award className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">
          لا توجد مهام مكتملة بعد
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          بمجرد تسليم كود المهمة واجتياز مناقشتها مع الذكاء الاصطناعي، ستظهر هنا كمرجع دائم لك مع الأكواد ومصادر التعلم.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {completedTasks.map((task) => {
          const isExpanded = expandedTaskId === task.id;

          return (
            <div
              key={task.id}
              className="rounded-2xl border border-border bg-card text-card-foreground p-5 sm:p-6 shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        مكتملة بنجاح
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        المهمة {task.order} • {task.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimatedHours}h</span>
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-foreground mt-1">
                      {task.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="p-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                    title="مراجعة الحقيبة التعليمية"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>الحقيبة التعليمية</span>
                  </button>

                  {task.submission && (
                    <a
                      href={task.submission}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                      title="فتح مستودع GitHub"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                      <span>الكود</span>
                    </a>
                  )}

                  <button
                    onClick={() =>
                      setExpandedTaskId(isExpanded ? null : task.id)
                    }
                    className="p-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-colors"
                    title={isExpanded ? "طي التفاصيل" : "عرض معايير القبول"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Description preview */}
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">
                {task.description}
              </p>

              {/* Expanded Criteria & Concepts */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border/60 text-xs sm:text-sm text-muted-foreground space-y-3 animate-in fade-in duration-200">
                  {task.acceptanceCriteria &&
                    task.acceptanceCriteria.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-foreground">
                          <ListChecks className="w-4 h-4 text-emerald-500" />
                          <span>معايير القبول التي تم تحقيقها:</span>
                        </div>
                        <ul className="space-y-1 pr-2">
                          {task.acceptanceCriteria.map((criterion, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs"
                            >
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {task.concepts && task.concepts.length > 0 && (
                    <div className="pt-2">
                      <div className="font-bold text-foreground mb-1.5 text-xs">
                        المفاهيم التي تم إتقانها:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {task.concepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-muted/70 text-foreground font-mono"
                          >
                            {concept.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedTask && (
        <TaskStudyPackModal
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
        />
      )}
    </>
  );
}
