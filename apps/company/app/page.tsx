import type { Metadata } from "next";
import { CompanyOverviewTab } from "@/features";

export const metadata: Metadata = {
  title: "Dashboard Overview | NexWolf Business",
  description: "Enterprise candidate assessment and hiring pipeline command center.",
};

export default function CompanyDashboardPage() {
  return (
    <div className="space-y-6 pb-16">
      <CompanyOverviewTab />
    </div>
  );
}
