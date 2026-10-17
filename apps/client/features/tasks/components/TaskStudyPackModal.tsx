"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Download,
  CheckCircle2,
  Lightbulb,
  FileCode2,
  AlertOctagon,
  ListOrdered,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";
import { DevelopmentTask } from "../types/task.types";

interface TaskStudyPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: DevelopmentTask;
}

export function TaskStudyPackModal({
  isOpen,
  onClose,
  task,
}: TaskStudyPackModalProps) {
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(
    null
  );

  if (!isOpen) return null;

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIndex(index);
    toast.success("تم نسخ الكود بنجاح!");
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                الحقيبة التعليمية والتقنية
              </span>
              <h2 className="text-base sm:text-lg font-bold text-foreground mt-0.5 line-clamp-1">
                المهمة {task.order}: {task.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold transition-colors"
              title="تنزيل الحقيبة بتنسيق PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل كـ PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 print:p-0">
          {/* Objective & Context */}
          {task.objective && (
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  الهدف التعليمي الأساسي للمهمة:
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  {task.objective}
                </p>
                {task.projectContext && (
                  <p className="text-xs text-muted-foreground/80 mt-1 italic">
                    سياق المشروع: {task.projectContext}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Concepts to Master */}
          {task.concepts && task.concepts.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>المفاهيم البرمجية المشروحة (Concepts to Master)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {task.concepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border bg-muted/20 space-y-2"
                  >
                    <div className="text-xs font-bold text-primary font-mono">
                      {concept.name}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {concept.explanation}
                    </p>
                    {concept.whyItMatters && (
                      <div className="text-[11px] text-muted-foreground/90 bg-background/50 p-2 rounded-lg border border-border/40">
                        <span className="font-bold text-foreground">
                          لماذا هو مهم؟{" "}
                        </span>
                        {concept.whyItMatters}
                      </div>
                    )}
                    {concept.practicalExample && (
                      <div
                        className="text-[11px] font-mono bg-muted p-2 rounded-lg text-foreground overflow-x-auto"
                        dir="ltr"
                      >
                        {concept.practicalExample}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Implementation Steps */}
          {task.implementationSteps && task.implementationSteps.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-primary" />
                <span>خطوات التنفيذ خطوة بخطوة (Step-by-Step Guide)</span>
              </h3>
              <div className="space-y-2">
                {task.implementationSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-border bg-card/60 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files to Create or Modify */}
          {task.filesToCreateOrModify && task.filesToCreateOrModify.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-primary" />
                <span>الملفات المطلوب إنشاؤها أو تعديلها</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {task.filesToCreateOrModify.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-border bg-muted/20 flex items-start gap-2.5"
                  >
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                        f.action === "create"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      }`}
                    >
                      {f.action}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-mono font-bold text-foreground truncate" dir="ltr">
                        {f.path}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {f.purpose}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Examples */}
          {task.codeExamples && task.codeExamples.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                <span>أكواد برمجية استرشادية (Code Examples)</span>
              </h3>
              <div className="space-y-4">
                {task.codeExamples.map((example, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-muted/40 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border text-xs">
                      <span className="font-bold text-foreground">
                        {example.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-muted-foreground uppercase">
                          {example.language}
                        </span>
                        <button
                          onClick={() => handleCopyCode(example.code, idx)}
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold"
                        >
                          {copiedSnippetIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>نسخ الكود</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <pre
                      className="p-4 text-xs font-mono overflow-x-auto text-foreground bg-background/50 leading-relaxed"
                      dir="ltr"
                    >
                      <code>{example.code}</code>
                    </pre>
                    {example.explanation && (
                      <div className="p-3 text-xs text-muted-foreground border-t border-border/60 bg-muted/20">
                        {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hints & Common Mistakes */}
          {((task.hints && task.hints.length > 0) ||
            (task.commonMistakes && task.commonMistakes.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {task.hints && task.hints.length > 0 && (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تلميحات مساعدة (Hints):</span>
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {task.hints.map((hint, i) => (
                      <li key={i}>• {hint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {task.commonMistakes && task.commonMistakes.length > 0 && (
                <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-destructive">
                    <AlertOctagon className="w-4 h-4" />
                    <span>أخطاء شائعة تجنب الوقوع فيها:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {task.commonMistakes.map((mistake, i) => (
                      <li key={i}>• {mistake}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Educational Resources */}
          {task.resources && task.resources.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>مصادر ومراجع تعليمية معتمدة (Study Resources)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {task.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {res.type === "youtube" ? (
                          <FaYoutube className="w-4 h-4 text-red-500 shrink-0" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-primary shrink-0" />
                        )}
                        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {res.title}
                        </span>
                      </div>
                      {res.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {res.description}
                        </p>
                      )}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
