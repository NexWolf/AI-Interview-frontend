"use client";

import { useState } from "react";
import {
  Briefcase,
  Clock,
  Sparkles,
  ArrowUpRight,
  X,
  FileCheck2,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/shared";
import { usePortalInterviews, Skeleton } from "@repo/shared";

export function CompanyAssessmentsTab() {
  const { t, isArabic } = useLanguage();
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const { data: interviews = [], isLoading } = usePortalInterviews();

  // Filter completed or scored interviews
  const assessments = interviews.filter(
    (item) => item.status === "Completed" || item.report !== null,
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {t("assessments.title")}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("assessments.subtitle")}
          </p>
        </div>

        <span className="text-xs text-muted-foreground">
          {assessments.length} {isArabic ? "تقارير مكتملة" : "completed reports"}
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-border/60 bg-card/60 space-y-4"
            >
              <Skeleton className="h-5 w-48 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : assessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assessments.map((a) => {
            const overallScore = a.score ?? a.report?.overallScore ?? 0;
            const recommendation =
              a.report?.recommendations ||
              (overallScore >= 85
                ? isArabic
                  ? "توصية قوية بالتوظيف"
                  : "Strong Hire"
                : overallScore >= 70
                  ? isArabic
                    ? "توصية بالتوظيف"
                    : "Hire"
                  : isArabic
                    ? "تحت المراجعة"
                    : "Under Review");

            return (
              <div
                key={a.id}
                className="p-5 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md hover:border-primary/40 transition-all space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {isArabic ? "تقرير رقم" : "Assessment"} #{a.id}
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      {a.candidateName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {a.candidateEmail || "—"} &bull; {a.difficultyLevel}
                    </p>
                  </div>

                  <div className="text-end shrink-0">
                    <span className="text-xl font-extrabold text-foreground">
                      {overallScore}%
                    </span>
                    <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                      {recommendation}
                    </p>
                  </div>
                </div>

                {a.jobDescription && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed bg-background/50 p-2.5 rounded-xl border border-border/40">
                    <strong className="text-foreground">
                      {isArabic ? "الوصف الوظيفي:" : "Role:"}
                    </strong>{" "}
                    {a.jobDescription}
                  </p>
                )}

                {a.report?.strengths && (
                  <div className="space-y-1 text-xs">
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                      <strong className="text-foreground">
                        {isArabic ? "أبرز الإيجابيات:" : "Highlights:"}
                      </strong>{" "}
                      {a.report.strengths}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => setSelectedReport(a)}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <span>{t("assessments.viewReport")}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-270" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 border border-dashed border-border/60 rounded-2xl bg-card/40">
          <FileCheck2 className="w-10 h-10 text-muted-foreground/50 mx-auto" />
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-sm font-bold text-foreground">
              {isArabic ? "لا توجد تقارير تقييم مكتملة بعد" : "No Completed Evaluations Yet"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isArabic
                ? "بمجرد أن يكمل المرشح المقابلة الصوتية بالذكاء الاصطناعي، سيتم توليد التقرير الشامل ونقاط القوة والضعف تلقائياً هنا."
                : "When candidates finish their AI voice interview sessions, full scorecards, benchmarks, and hiring recommendations will appear here."}
            </p>
          </div>
        </div>
      )}

      {/* Modal for full report view */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 transition-colors duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {selectedReport.candidateName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedReport.candidateEmail || ""} &bull;{" "}
                  {isArabic ? "تفاصيل تقييم المقابلة" : "Full Assessment Breakdown"}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-primary">
                  {isArabic ? "النتيجة والتقييم" : "Evaluation Score"}
                </p>
                <p className="text-sm font-bold text-foreground">
                  {selectedReport.report?.recommendations ||
                    (selectedReport.score >= 85 ? "Strong Hire" : "Candidate Evaluated")}
                </p>
              </div>
              <div className="text-2xl font-black text-foreground">
                {selectedReport.score ?? selectedReport.report?.overallScore ?? 0}%
              </div>
            </div>

            {selectedReport.jobDescription && (
              <div className="space-y-1.5 text-xs">
                <h5 className="font-bold text-foreground flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  {isArabic
                    ? "الوصف الوظيفي ومعايير المقابلة"
                    : "Target Job Description & Role Criteria"}
                </h5>
                <p className="text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border/40 text-[11px] leading-relaxed">
                  {selectedReport.jobDescription}
                </p>
              </div>
            )}

            {selectedReport.report?.strengths && (
              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-foreground">{t("assessments.strengths")}</h5>
                <p className="text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border/40 leading-relaxed">
                  {selectedReport.report.strengths}
                </p>
              </div>
            )}

            {selectedReport.report?.weaknesses && (
              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-foreground">{t("assessments.weaknesses")}</h5>
                <p className="text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border/40 leading-relaxed">
                  {selectedReport.report.weaknesses}
                </p>
              </div>
            )}

            {selectedReport.report?.improvementPlan && (
              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-foreground">
                  {isArabic ? "خطة التطوير المقترحة" : "Improvement Plan"}
                </h5>
                <p className="text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border/40 leading-relaxed">
                  {selectedReport.report.improvementPlan}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-border/50 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer transition-colors"
              >
                {isArabic ? "إغلاق التقرير" : "Close Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
