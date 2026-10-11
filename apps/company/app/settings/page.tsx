import type { Metadata } from "next";
import { CompanySettingsTab } from "@/features";

export const metadata: Metadata = {
  title: "Workspace & Company Settings | NexWolf Business",
  description: "Manage organization profile, contacts, and notification preferences.",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-16">
      <CompanySettingsTab />
    </div>
  );
}
