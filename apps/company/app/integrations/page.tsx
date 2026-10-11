import type { Metadata } from "next";
import { CompanyIntegrationsTab } from "@/features";

export const metadata: Metadata = {
  title: "API & ATS Integrations | NexWolf Business",
  description: "Manage enterprise API keys, webhooks, and ATS automation payloads.",
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-6 pb-16">
      <CompanyIntegrationsTab />
    </div>
  );
}
