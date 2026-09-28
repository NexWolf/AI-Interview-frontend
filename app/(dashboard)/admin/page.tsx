"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Sparkles,
  ShieldAlert,
  FileText,
  Layers,
  RefreshCw,
  Shield,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import {
  useAdminInterviews,
  useAdminUsers,
  useAdminAIRequests,
  useAdminViolations,
  useAdminReports,
  useAdminInterviewDetails,
  useAdminAIRequestDetails,
} from "@/shared/hook/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import { AdminOverviewTab } from "@/features/admin/components/AdminOverviewTab";
import { AdminInterviewsTab } from "@/features/admin/components/AdminInterviewsTab";
import { AdminUsersTab } from "@/features/admin/components/AdminUsersTab";
import { AdminAiRequestsTab } from "@/features/admin/components/AdminAiRequestsTab";
import { AdminViolationsTab } from "@/features/admin/components/AdminViolationsTab";
import { AdminReportsTab } from "@/features/admin/components/AdminReportsTab";
import { AdminSkillsTab } from "@/features/admin/components/AdminSkillsTab";
import { InterviewDetailModal } from "@/features/admin/components/InterviewDetailModal";
import { AiRequestDetailModal } from "@/features/admin/components/AiRequestDetailModal";
import { cn } from "@/shared/lib/utils";

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const { data: user, isLoading: userLoading } = useUserInfo();
  const queryClient = useQueryClient();

  const [selectedInterviewId, setSelectedInterviewId] = useState<string | number | null>(null);
  const [selectedAiRequestId, setSelectedAiRequestId] = useState<string | number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries
  const { data: interviewsData, isLoading: interviewsLoading } = useAdminInterviews();
  const { data: usersData, isLoading: usersLoading } = useAdminUsers();
  const { data: aiData, isLoading: aiLoading } = useAdminAIRequests();
  const { data: violationsData, isLoading: violationsLoading } = useAdminViolations();
  const { data: reportsData, isLoading: reportsLoading } = useAdminReports();

  // Detail Queries
  const { data: activeInterviewDetail } = useAdminInterviewDetails(selectedInterviewId);
  const { data: activeAiRequestDetail } = useAdminAIRequestDetails(selectedAiRequestId);

  const interviews = interviewsData?.interviews || [];
  const users = usersData?.users || [];
  const aiRequests = aiData?.aiRequests || [];
  const violations = violationsData?.violations || [];
  const reports = reportsData?.reports || [];

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/admin?${params.toString()}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin"] }),
      queryClient.invalidateQueries({ queryKey: ["skills"] }),
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Authenticating administrator privileges...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          This portal is reserved for NexWolf system administrators. Your account does not have sufficient role privileges.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "interviews", label: "Interviews", icon: Briefcase, count: interviews.length },
    { id: "users", label: "Users & Access", icon: Users, count: users.length },
    { id: "ai", label: "AI Telemetry", icon: Sparkles, count: aiRequests.length },
    { id: "violations", label: "Integrity & Alerts", icon: ShieldAlert, count: violations.length, alert: violations.some((v) => v.isCheating) },
    { id: "reports", label: "Evaluations", icon: FileText, count: reports.length },
    { id: "skills", label: "Skills Catalog", icon: Layers },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 pb-16">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Admin Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              {user?.role}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Monitor live interviews, track LLM inference telemetry, inspect proctoring integrity, and manage candidate accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Live</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border/60 bg-card hover:bg-muted text-foreground transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-primary")} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Modern Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : tab.alert
                      ? "bg-rose-500/20 text-rose-500"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Views */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <AdminOverviewTab
            interviews={interviews}
            users={users}
            aiRequests={aiRequests}
            violations={violations}
            onSelectTab={handleTabChange}
            onViewInterview={(id) => setSelectedInterviewId(id)}
          />
        )}

        {activeTab === "interviews" && (
          <AdminInterviewsTab
            interviews={interviews}
            isLoading={interviewsLoading}
            onViewDetails={(id) => setSelectedInterviewId(id)}
          />
        )}

        {activeTab === "users" && (
          <AdminUsersTab users={users} isLoading={usersLoading} />
        )}

        {activeTab === "ai" && (
          <AdminAiRequestsTab
            aiRequests={aiRequests}
            isLoading={aiLoading}
            onInspect={(id) => setSelectedAiRequestId(id)}
          />
        )}

        {activeTab === "violations" && (
          <AdminViolationsTab
            violations={violations}
            isLoading={violationsLoading}
            onViewInterview={(id) => setSelectedInterviewId(id)}
          />
        )}

        {activeTab === "reports" && (
          <AdminReportsTab
            reports={reports}
            isLoading={reportsLoading}
            onViewInterview={(id) => setSelectedInterviewId(id)}
          />
        )}

        {activeTab === "skills" && <AdminSkillsTab />}
      </div>

      {/* Modals */}
      <InterviewDetailModal
        interview={activeInterviewDetail || null}
        onClose={() => setSelectedInterviewId(null)}
      />

      <AiRequestDetailModal
        request={activeAiRequestDetail || null}
        onClose={() => setSelectedAiRequestId(null)}
      />
    </div>
  );
}