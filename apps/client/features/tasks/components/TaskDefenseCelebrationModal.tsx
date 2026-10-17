"use client";

import React from "react";
import {
  Trophy,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  X,
  Target,
  BookOpen,
} from "lucide-react";

interface TaskDefenseCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  passed: boolean;
  score?: number | string | null;
  taskTitle?: string;
  taskOrder?: number;
  congratulatoryMessage?: string | null;
  feedbackSummary?: string | null;
  masteredConcepts?: string[];
  gapsIdentified?: string[];
  onProceedToNextTask: () => void;
}

export function TaskDefenseCelebrationModal({
  isOpen,
  onClose,
  passed,
  score,
  taskTitle,
  taskOrder,
  congratulatoryMessage,
  feedbackSummary,
  masteredConcepts = [],
  gapsIdentified = [],
  onProceedToNextTask,
}: TaskDefenseCelebrationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glow Header */}
        <div
          className={`relative p-6 sm:p-8 text-center overflow-hidden border-b border-border/60 ${
            passed
              ? "bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent"
              : "bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent"
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-3xl blur-xl opacity-60 animate-pulse ${
                passed ? "bg-emerald-500/40" : "bg-amber-500/40"
              }`}
            />
            <div
              className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                passed
                  ? "bg-emerald-500 text-white shadow-emerald-500/30"
                  : "bg-amber-500 text-white shadow-amber-500/30"
              }`}
            >
              {passed ? (
                <Trophy className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 border ${
            passed
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }">
            {passed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تم اجتياز المهمة بنجاح 🚀</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>تحتاج إلى مراجعة بعض النقاط</span>
              </>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {passed
              ? "مبروك يا بطل! أثبتت فهمك للكود"
              : "أحسنت المحاولة! ينقصك القليل فقط"}
          </h2>

          {taskTitle && (
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto truncate">
              {taskOrder ? `المهمة رقم ${taskOrder}: ` : ""}
              {taskTitle}
            </p>
          )}

          {score !== null && score !== undefined && score !== "" && (
            <div className="mt-3 inline-flex items-baseline gap-1 px-3 py-1 rounded-xl bg-card border border-border shadow-sm">
              <span className="text-xs text-muted-foreground font-semibold">
                درجة التقييم:
              </span>
              <span className="text-sm font-black text-foreground font-mono">
                {score} / 100
              </span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Main message */}
          {(congratulatoryMessage || feedbackSummary) && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                passed
                  ? "bg-emerald-500/5 border-emerald-500/20 text-foreground"
                  : "bg-amber-500/5 border-amber-500/20 text-foreground"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Sparkles
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    passed ? "text-emerald-500" : "text-amber-500"
                  }`}
                />
                <p>
                  {congratulatoryMessage || feedbackSummary}
                </p>
              </div>
            </div>
          )}

          {/* Mastered concepts */}
          {passed && masteredConcepts.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                <span>مفاهيم برمجية أتقنتها في هذا التكليف:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {masteredConcepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
                  >
                    ✓ {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gaps identified */}
          {!passed && gapsIdentified.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>نقاط ركز عليها في كودك قبل المحاولة القادمة:</span>
              </div>
              <div className="space-y-1.5">
                {gapsIdentified.map((gap, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200"
                  >
                    <span className="font-bold">•</span>
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-6 border-t border-border/60 bg-muted/20 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            إغلاق
          </button>

          {passed ? (
            <button
              onClick={() => {
                onProceedToNextTask();
                onClose();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              <span>بدء العمل على المهمة التالية</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold shadow-md hover:bg-foreground/90 transition-all active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" />
              <span>فهمت، سأعدل الكود وأعيد المحاولة</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
