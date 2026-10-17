"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { toast } from "sonner";

interface TaskGithubSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | number;
  taskTitle: string;
  currentSubmission?: string | null;
  onSubmit: (repoUrl: string) => Promise<void>;
}

export function TaskGithubSubmitModal({
  isOpen,
  onClose,
  taskTitle,
  currentSubmission,
  onSubmit,
}: TaskGithubSubmitModalProps) {
  const [repoUrl, setRepoUrl] = useState(currentSubmission || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentSubmission) {
      setRepoUrl(currentSubmission);
    }
  }, [currentSubmission]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUrl = repoUrl.trim();
    if (!cleanUrl) {
      setError("يرجى إدخال رابط مستودع GitHub الخاص بحلك.");
      return;
    }

    if (!cleanUrl.toLowerCase().includes("github.com/")) {
      setError(
        "الرابط يجب أن يكون رابطاً صالحاً لمستودع على GitHub (مثال: https://github.com/username/project)."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(cleanUrl);
      toast.success("تم تسليم رابط المستودع وتحديث حالة المهمة بنجاح!");
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "تعذر حفظ التسليم، يرجى المحاولة مرة أخرى.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-foreground/10 flex items-center justify-center text-foreground">
              <FaGithub className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                تسليم حل التكليف البرمجي
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {taskTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              قم برفع كودك إلى مستودع عام (Public Repository) على GitHub، ثم الصق رابطه هنا. سيتم حفظ حلك واعتماد تسليمه في خطتك التعليمية.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>رابط مستودع GitHub:</span>
              <span className="text-destructive">*</span>
            </label>
            <div className="relative" dir="ltr">
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="https://github.com/your-username/my-task-repo"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/60"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري التسليم...</span>
                </>
              ) : (
                <>
                  <FaGithub className="w-3.5 h-3.5" />
                  <span>تأكيد وحفظ التسليم</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
