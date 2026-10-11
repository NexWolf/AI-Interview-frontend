import type { Metadata } from "next";
import { CompanyAssessmentsTab } from "@/features";

export const metadata: Metadata = {
  title: "Assessments & Score Reports | NexWolf Business",
  description: "Review detailed candidate evaluation results, strengths, weaknesses, and hiring recommendations.",
};

export default function AssessmentsPage() {
  return (
    <div className="space-y-6 pb-16">
      <CompanyAssessmentsTab />
    </div>
  );
}
