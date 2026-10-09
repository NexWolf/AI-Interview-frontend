"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  CompanyOverviewTab,
  CompanyCandidatesTab,
  CompanyAssessmentsTab,
  CompanyIntegrationsTab,
  CompanySettingsTab,
} from "@/features";

function CompanyPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 pb-16">
      {activeTab === "overview" && (
        <CompanyOverviewTab onNavigateTab={handleTabChange} />
      )}

      {activeTab === "candidates" && <CompanyCandidatesTab />}

      {activeTab === "assessments" && <CompanyAssessmentsTab />}

      {activeTab === "integrations" && <CompanyIntegrationsTab />}

      {activeTab === "settings" && <CompanySettingsTab />}
    </div>
  );
}

export default function CompanyPortal() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <CompanyPortalContent />
    </Suspense>
  );
}
