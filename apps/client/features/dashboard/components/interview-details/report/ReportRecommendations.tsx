"use client";

import React from "react";
import { Award } from "lucide-react";

interface ReportRecommendationsProps {
  recommendations: string[];
}

export const ReportRecommendations: React.FC<ReportRecommendationsProps> = ({
  recommendations,
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-6 space-y-3">
      <h2 className="font-bold text-sm flex items-center gap-2">
        <Award className="w-4 h-4 text-primary" />
        Recommendations
      </h2>
      <ul className="space-y-2">
        {recommendations.map((rec, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-sm text-foreground/90"
          >
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <span className="leading-relaxed">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportRecommendations;
