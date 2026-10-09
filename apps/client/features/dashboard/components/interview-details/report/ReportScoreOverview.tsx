"use client";

import React from "react";
import { Target, TrendingUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ScoreRing } from "../shared/ScoreRing";
import { ScoreBar } from "../shared/ScoreBar";
import { scoreColor } from "../../../utils/interviewDetails.utils";

interface DimensionScore {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface ReportScoreOverviewProps {
  overall: number;
  currentLevel?: string | null;
  recommendedNextLevel?: string | null;
  dimensionScores: DimensionScore[];
}

export const ReportScoreOverview: React.FC<ReportScoreOverviewProps> = ({
  overall,
  currentLevel,
  recommendedNextLevel,
  dimensionScores,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Score & Level Card */}
      <div className="rounded-2xl border border-border/70 bg-card/70 p-6 flex flex-col items-center justify-center gap-4">
        <ScoreRing value={overall} label="Overall Score" />
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Current Level</span>
          <span className="font-semibold text-primary">{currentLevel || "—"}</span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" />
          Recommended Next:{" "}
          <span className="font-semibold text-foreground">
            {recommendedNextLevel || "—"}
          </span>
        </div>
      </div>

      {/* 4 Performance Dimensions */}
      <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card/70 p-6 space-y-5">
        <h2 className="font-bold text-sm flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Performance Dimensions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {dimensionScores.map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  {label}
                </span>
                <span className={cn("text-xs font-bold", scoreColor(value))}>
                  {Math.round(value)}%
                </span>
              </div>
              <ScoreBar value={value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportScoreOverview;
