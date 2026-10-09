"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Sparkles,
  ShieldAlert,
  FileText,
  Layers,
  Building2,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import {
  useAdminInterviews,
  useAdminUsers,
  useAdminAIRequests,
  useAdminViolations,
  useAdminReports,
  useAdminCompanies,
  useAdminQuestions,
  useAdminFeedbacks,
  cn,
} from "@repo/shared";

interface AdminSidebarNavProps {
  onItemClick?: () => void;
}

function AdminSidebarNavContent({ onItemClick }: AdminSidebarNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAdminRoute = true;
  const activeTab = searchParams?.get("tab") || "overview";

  // React Query cached admin metrics
  const { data: interviewsData } = useAdminInterviews();
  const { data: usersData } = useAdminUsers();
  const { data: aiData } = useAdminAIRequests();
  const { data: violationsData } = useAdminViolations();
  const { data: reportsData } = useAdminReports();
  const { data: companiesData } = useAdminCompanies();
  const { data: questionsData } = useAdminQuestions();
  const { data: feedbacksData } = useAdminFeedbacks();

  const totalInterviews = interviewsData?.pagination?.total ?? interviewsData?.interviews?.length;
  const totalUsers = usersData?.pagination?.total ?? usersData?.users?.length;
  const totalAiRequests = aiData?.pagination?.total ?? aiData?.aiRequests?.length;
  const violations = violationsData?.violations || [];
  const totalViolations = violationsData?.pagination?.total ?? violations.length;
  const totalReports = reportsData?.pagination?.total ?? reportsData?.reports?.length;
  const totalCompanies = companiesData?.length;
  const totalQuestions =
    questionsData?.pagination?.total ??
    (Array.isArray(questionsData?.questions)
      ? questionsData.questions.length
      : (questionsData?.questions as any)?.data?.length ?? 0);
  const totalFeedbacks = feedbacksData?.pagination?.total ?? feedbacksData?.feedbacks?.length;

  const hasCheating = violations.some((v) => v.isCheating);

  const adminTabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "interviews", label: "Interviews", icon: Briefcase, count: totalInterviews },
    { id: "users", label: "Users & Access", icon: Users, count: totalUsers },
    { id: "companies", label: "Companies & B2B", icon: Building2, count: totalCompanies },
    { id: "questions", label: "Question Bank", icon: HelpCircle, count: totalQuestions },
    { id: "feedbacks", label: "User Feedbacks", icon: MessageSquare, count: totalFeedbacks },
    { id: "ai", label: "AI Telemetry", icon: Sparkles, count: totalAiRequests },
    {
      id: "violations",
      label: "Integrity & Alerts",
      icon: ShieldAlert,
      count: totalViolations,
      alert: hasCheating,
    },
    { id: "reports", label: "Evaluations", icon: FileText, count: totalReports },
    { id: "skills", label: "Skills Catalog", icon: Layers },
  ];

  return (
    <div className="space-y-1">
      {adminTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const href = `?tab=${tab.id}`;

        return (
          <Link
            key={tab.id}
            href={href}
            onClick={onItemClick}
            className={cn(
              "group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer",
              isActive
                ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="truncate">{tab.label}</span>
            </div>

            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-colors",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : tab.alert
                    ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                    : "bg-muted text-muted-foreground group-hover:bg-muted/80",
                )}
              >
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function AdminSidebarNavSkeleton() {
  return (
    <div className="space-y-1 px-1 py-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-8 rounded-xl bg-muted/40 animate-pulse" />
      ))}
    </div>
  );
}

export function AdminSidebarNav(props: AdminSidebarNavProps) {
  return (
    <Suspense fallback={<AdminSidebarNavSkeleton />}>
      <AdminSidebarNavContent {...props} />
    </Suspense>
  );
}
