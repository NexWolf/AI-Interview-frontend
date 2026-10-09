"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Briefcase, Clock, Loader2 } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { formatDate, statusStyles } from "../utils/dashboard.utils";
import type { DashboardRecentInterviewsProps } from "../types/dashboard.types";

export default function DashboardRecentInterviews({
  interviews,
  isLoading,
  isError,
  isAr,
}: DashboardRecentInterviewsProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const interviewList = interviews || [];
  const hasInterviews = interviewList.length > 0;

  return (
    <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card/70 p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          {t("dashboard.recent.title")}
        </h2>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-6">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>{isAr ? "جاري تحميل المقابلات..." : "Loading interviews..."}</span>
        </div>
      )}

      {isError && (
        <p className="text-xs text-red-400 italic py-6">
          {isAr ? "فشل تحميل المقابلات." : "Failed to load interviews."}
        </p>
      )}

      {!isLoading && !isError && !hasInterviews && (
        <div className="py-10 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-muted-foreground/50 mx-auto" />
          <p className="text-sm text-muted-foreground">
            {isAr
              ? "لا توجد مقابلات بعد — ابدأ أول مقابلة تجريبية بالذكاء الاصطناعي!"
              : "No interviews yet — take your first AI interview!"}
          </p>
          <Link
            href="/interview/setup"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            {t("dashboard.recent.startNow")}{" "}
            <ArrowRight className={cn("w-4 h-4", isAr && "rotate-180")} />
          </Link>
        </div>
      )}

      {!isLoading && !isError && hasInterviews && (
        <div className="space-y-3">
          {interviewList.slice(0, 6).map((interview) => {
            const inProgress =
              interview.status === "Running" || interview.status === "Paused";

            return (
              <button
                key={interview.id}
                type="button"
                onClick={() =>
                  router.push(
                    inProgress
                      ? `/interview/${interview.id}`
                      : `/dashboard/interviewDetails?id=${interview.id}`,
                  )
                }
                className="w-full flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/40 hover:border-border px-4 py-3.5 text-left rtl:text-right transition-colors cursor-pointer group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full border font-semibold",
                        statusStyles[interview.status] || statusStyles.Pending,
                      )}
                    >
                      {interview.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {interview.difficultyLevel}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {interview.interviewLanguage}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1.5 truncate group-hover:text-primary transition-colors">
                    {interview.skills?.map((s) => s.name).join(", ") ||
                      (isAr ? "تقييم تقني عام" : "General Technical Evaluation")}
                  </p>
                </div>

                <div className="shrink-0 text-right rtl:text-left">
                  {inProgress ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {isAr ? "متابعة" : "Resume"}
                    </span>
                  ) : (
                    <>
                      <p className="text-xs font-semibold">
                        {interview.totalQuestions} {isAr ? "أسئلة" : "Qs"}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatDate(interview.createdAt)}
                      </p>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
