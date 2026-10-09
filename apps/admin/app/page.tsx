"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  useAdminInterviews,
  useAdminUsers,
  useAdminAIRequests,
  useAdminViolations,
  useAdminReports,
  useAdminInterviewDetails,
  useAdminAIRequestDetails,
} from "@repo/shared";
import {
  AdminOverviewTab,
  AdminInterviewsTab,
  AdminUsersTab,
  AdminAiRequestsTab,
  AdminViolationsTab,
  AdminReportsTab,
  AdminSkillsTab,
  AdminCompaniesTab,
  AdminQuestionsTab,
  AdminFeedbacksTab,
  InterviewDetailModal,
  AiRequestDetailModal,
} from "@/features";

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [selectedInterviewId, setSelectedInterviewId] = useState<string | number | null>(null);
  const [selectedAiRequestId, setSelectedAiRequestId] = useState<string | number | null>(null);

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

  // تم تعطيل الفحص مؤقتاً لمعاينة التصميم والشكل بحرية
  const isAdmin = true;

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 pb-16">
      {/* Active Tab Views */}
      <div>
        {activeTab === "overview" && (
          <AdminOverviewTab
            interviews={interviews}
            users={users}
            aiRequests={aiRequests}
            violations={violations}
            totalInterviews={interviewsData?.pagination?.total}
            totalUsers={usersData?.pagination?.total}
            totalAiRequests={aiData?.pagination?.total}
            totalViolations={violationsData?.pagination?.total}
            onSelectTab={handleTabChange}
            onViewInterview={(id) => setSelectedInterviewId(id)}
          />
        )}

        {activeTab === "interviews" && (
          <AdminInterviewsTab
            onViewDetails={(id) => setSelectedInterviewId(id)}
          />
        )}

        {activeTab === "users" && (
          <AdminUsersTab />
        )}

        {activeTab === "ai" && (
          <AdminAiRequestsTab
            onInspect={(id) => setSelectedAiRequestId(id)}
          />
        )}

        {activeTab === "violations" && (
          <AdminViolationsTab
            onViewInterview={(id) => setSelectedInterviewId(id)}
          />
        )}

        {activeTab === "reports" && (
          <AdminReportsTab
            onViewInterview={(id) => setSelectedInterviewId(id)}
          />
        )}

        {activeTab === "skills" && <AdminSkillsTab />}

        {activeTab === "companies" && <AdminCompaniesTab />}

        {activeTab === "questions" && <AdminQuestionsTab />}

        {activeTab === "feedbacks" && <AdminFeedbacksTab />}
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

export default function Admin() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}