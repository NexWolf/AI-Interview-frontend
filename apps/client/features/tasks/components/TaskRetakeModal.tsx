"use client";

import React from "react";
import { AlertTriangle, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface TaskRetakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export function TaskRetakeModal({
  isOpen,
  onClose,
  onConfirm,
}: TaskRetakeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onClose();
    if (onConfirm) {
      onConfirm();
    } else {
      router.push("/interview/setup?mode=student_placement");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5 text-amber-500">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              إعادة استكشاف وتحديد المسار
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            عند خوض مقابلة استكشافية جديدة (5 أسئلة)، سيقوم الذكاء الاصطناعي بإعادة تقييم مستواك الحالي وميولك، ورسم مسار جديد وتوليد مشروع ومهام مختلفة تناسب إجاباتك الجديدة.
          </p>
          <div className="p-3 rounded-xl border border-amber-500/25 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-300 font-medium">
            تنبيه: سيتم اعتماد نتائج المقابلة الجديدة وتحديث مهامك الحالية فور انتهائها.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            إلغاء التراجع
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <span>بدء المقابلة الجديدة</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
