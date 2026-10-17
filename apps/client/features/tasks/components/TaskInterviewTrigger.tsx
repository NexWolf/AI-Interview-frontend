"use client";

import React, { useState } from "react";
import { Mic, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DevelopmentTask } from "../types/task.types";
import { taskService } from "../services/task.service";

interface TaskInterviewTriggerProps {
  task: DevelopmentTask;
  onStartDiscussion?: () => void;
}

export function TaskInterviewTrigger({
  task,
  onStartDiscussion,
}: TaskInterviewTriggerProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = async () => {
    if (onStartDiscussion) {
      onStartDiscussion();
      return;
    }

    try {
      setIsStarting(true);
      const res = await taskService.startTaskDefenseInterview(task.id);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("is_task_defense", "true");
        sessionStorage.setItem("defense_task_id", String(task.id));
      }
      toast.success("تم تجهيز جلسة المناقشة وفحص مستودع GitHub بنجاح! جاري الدخول...");
      router.push(`/interview/${res.interview.id}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as any)?.response?.data?.message || "تعذر بدء المقابلة، يرجى التحقق من الاتصال.";
      toast.error(msg);
      setIsStarting(false);
    }
  };

  const repoDisplay = task.submission
    ? task.submission.replace("https://github.com/", "")
    : "تم إرسال الحل";

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-primary/5 to-background p-6 shadow-xl animate-in zoom-in-95 duration-200">
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-lg shadow-primary/25">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                المقابلة جاهزة الآن
              </span>
              <span
                className="text-xs text-muted-foreground font-mono truncate max-w-[200px]"
                dir="ltr"
              >
                {repoDisplay}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mt-1">
              مناقشة كود المهمة مع المحاور الذكي (Code Defense)
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
              تم تسجيل رابط المستودع للمهمة رقم {task.order} بنجاح. في هذه المقابلة الصوتية التفاعلية، سيناقشك المرشد الذكي حول الكود والقرارات الهندسية للتحقق من المفاهيم وتأهيلك للخطوة التالية.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          <button
            onClick={handleStartInterview}
            disabled={isStarting}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {isStarting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري إعداد الغرفة وفحص الكود...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>دخول غرفة مناقشة الكود</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
