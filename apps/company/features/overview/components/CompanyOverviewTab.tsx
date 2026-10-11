"use client";

import Link from "next/link";
import {
  Users,
  CheckCircle2,
  TrendingUp,
  KeyRound,
  Plus,
  ArrowRight,
  Sparkles,
  UserCheck,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/shared";
import {
  StatCard,
  useCompanyOverview,
  usePortalApiKeys,
  Skeleton,
} from "@repo/shared";

interface CompanyOverviewTabProps {
  onNavigateTab?: (tab: string) => void;
}

export function CompanyOverviewTab({ onNavigateTab }: CompanyOverviewTabProps) {
  const { t, isArabic } = useLanguage();
  const { data: overview, isLoading } = useCompanyOverview();
  const { data: apiKeys } = usePortalApiKeys();

  const activeKeysCount = apiKeys?.filter((k) => !k.isRevoked).length ?? 0;
  const recentList = overview?.recentInterviews || [];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-primary/10 backdrop-blur-xl shadow-sm transition-colors duration-200">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {isArabic
              ? "تقييمات المقابلات التقنية بالذكاء الاصطناعي"
              : "AI-Powered Technical Assessments"}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            {isArabic
              ? `مرحباً بك في مركز قيادة ${overview?.company?.name || "التوظيف"}`
              : `Welcome to ${overview?.company?.name || "Company"} Hiring Center`}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isArabic
              ? "ادعُ المرشحين لمقابلات صوتية واقعية بالذكاء الاصطناعي، راجع تقارير التقييم الآلية، وسرّع الفرز الفني دون الحاجة لتنسيق المقابلات يدوياً."
              : "Invite candidates to realistic AI voice interviews, review automated scoring reports, and streamline technical screening with zero human scheduling overhead."}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/candidates"
              onClick={() => onNavigateTab?.("candidates")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {isArabic ? "إضافة مرشح ودعوته" : "Invite New Candidate"}
            </Link>
            <Link
              href="/integrations"
              onClick={() => onNavigateTab?.("integrations")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-background/90 border border-border/70 hover:bg-muted text-foreground transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              {isArabic ? "بيانات الربط البرمجي (API)" : "View API Credentials"}
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards using Shared StatCard */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-border/60 bg-card/60 space-y-3">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-3 w-36 rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t("overview.totalCandidates")}
            value={overview?.totalCandidates ?? 0}
            sub={
              isArabic
                ? `${overview?.totalCandidates ?? 0} مرشح مسجل`
                : `${overview?.totalCandidates ?? 0} registered candidates`
            }
            icon={Users}
            iconClassName="bg-primary/10 text-primary"
            onClick={() => onNavigateTab?.("candidates")}
          />

          <StatCard
            title={t("overview.completedInterviews")}
            value={overview?.completedInterviews ?? 0}
            sub={
              isArabic
                ? `من إجمالي ${overview?.totalInterviews ?? 0} مقابلة`
                : `Out of ${overview?.totalInterviews ?? 0} total sessions`
            }
            icon={CheckCircle2}
            iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            onClick={() => onNavigateTab?.("assessments")}
          />

          <StatCard
            title={t("overview.averageScore")}
            value={overview?.averageScore ? `${overview.averageScore}%` : "—"}
            sub={
              overview?.averageScore
                ? isArabic
                  ? "المعدل العام للمهارات"
                  : "Benchmark score"
                : isArabic
                  ? "بانتظار اكتمال التقييمات"
                  : "Awaiting completed sessions"
            }
            icon={TrendingUp}
            iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            onClick={() => onNavigateTab?.("assessments")}
          />

          <StatCard
            title={isArabic ? "الربط البرمجي" : "API Integration"}
            value={
              activeKeysCount > 0
                ? isArabic
                  ? "متصل"
                  : "Connected"
                : isArabic
                  ? "غير مفعل"
                  : "Inactive"
            }
            sub={
              activeKeysCount > 0
                ? isArabic
                  ? `${activeKeysCount} مفاتيح API نشطة`
                  : `${activeKeysCount} active API keys`
                : isArabic
                  ? "أنشئ مفتاح API للربط"
                  : "Generate API key to connect"
            }
            icon={KeyRound}
            iconClassName="bg-purple-500/10 text-purple-600 dark:text-purple-400"
            onClick={() => onNavigateTab?.("integrations")}
          />
        </div>
      )}

      {/* Quick Access Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidates Pipeline Summary */}
        <div className="p-6 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md space-y-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">
              {t("overview.recentActivity")}
            </h3>
            <Link
              href="/candidates"
              onClick={() => onNavigateTab?.("candidates")}
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              {isArabic ? "عرض الكل" : "View all"}
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3.5 rounded-xl border border-border/50 bg-background/50 space-y-2">
                  <Skeleton className="h-4 w-40 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
              ))}
            </div>
          ) : recentList.length > 0 ? (
            <div className="space-y-3">
              {recentList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-border/50 bg-background/60 flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {item.candidateName}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      {item.difficultyLevel && (
                        <span>&bull; {item.difficultyLevel}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-foreground">
                      {item.score !== null ? `${item.score}%` : "—"}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center space-y-2 border border-dashed border-border/60 rounded-xl bg-background/40">
              <UserCheck className="w-8 h-8 text-muted-foreground/60 mx-auto" />
              <p className="text-xs text-muted-foreground">
                {isArabic
                  ? "لا توجد مقابلات مسجلة حتى الآن."
                  : "No interview activity recorded yet."}
              </p>
              <Link
                href="/candidates"
                onClick={() => onNavigateTab?.("candidates")}
                className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
              >
                {isArabic ? "ادعُ أول مرشح الآن" : "Invite your first candidate"}
              </Link>
            </div>
          )}
        </div>

        {/* Integration Fast Start */}
        <div className="p-6 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md space-y-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">
              {isArabic ? "أتمتة النظام البرمجي (ATS)" : "API Automation (ATS)"}
            </h3>
            <Link
              href="/integrations"
              onClick={() => onNavigateTab?.("integrations")}
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              {isArabic ? "دليل المطورين" : "Developer Docs"}
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {isArabic
              ? "اربط نظام التوظيف بشركتك (Greenhouse أو Lever أو نظام داخلي) لتوجيه دعوات المقابلات تلقائياً بمجرد تقديم المرشح."
              : "Connect your Greenhouse, Lever, or custom HR system to trigger interview invitations automatically when candidates apply."}
          </p>

          <div className="p-3.5 rounded-xl bg-background/80 border border-border/70 font-mono text-xs text-muted-foreground overflow-x-auto space-y-1">
            <p className="text-primary font-semibold">
              {isArabic ? "# دعوة مرشح عبر الـ API" : "# Invite candidate via API"}
            </p>
            <p>POST /api/v1/company/interviews</p>
            <p className="text-[11px] text-muted-foreground/80">
              Header: Authorization: Bearer {activeKeysCount > 0 ? "sk_live_..." : "<YOUR_KEY>"}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/integrations"
              onClick={() => onNavigateTab?.("integrations")}
              className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer border border-border/50"
            >
              {isArabic ? "إدارة مفاتيح الـ API ودليل التكامل" : "Manage API Keys & Documentation"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
