import type { Metadata } from "next";
import { CompanyCandidatesTab } from "@/features";

export const metadata: Metadata = {
  title: "Candidate Pipeline & Roster | NexWolf Business",
  description: "Track candidate invitations, ATS identifiers, and AI interview readiness.",
};

export default function CandidatesPage() {
  return (
    <div className="space-y-6 pb-16">
      <CompanyCandidatesTab />
    </div>
  );
}
