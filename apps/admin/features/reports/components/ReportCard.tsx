"use client";

import { FileText, Trophy, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@repo/shared";
import { ReportCardProps } from "../types/reports.types";
import {
  toList,
  getReportScoreBadgeClass,
  getReportCandidateName,
} from "../utils/reportHelpers";

export function ReportCard({ report, onViewInterview }: ReportCardProps) {
  const overall = Number(report.overallScore ?? 0);
  const strengthsList = toList(report.strengths);
  const weaknessesList = toList(report.weaknesses || report.areasForImprovement);
  const candidateName = getReportCandidateName(report.user);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-5 space-y-4 hover:border-primary/40 transition-all hover:shadow-lg">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>{candidateName}</span>
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">{report.user?.email}</p>
        </div>

        <div
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1",
            getReportScoreBadgeClass(overall),
          )}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>{overall}% Score</span>
        </div>
      </div>

      {/* Summary / Highlights */}
      {(report.summaryEn || report.summaryAr) && (
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {report.summaryEn || report.summaryAr}
        </p>
      )}

      {/* Strengths & Weaknesses Badges */}
      <div className="space-y-2 pt-2 border-t border-border/40">
        {strengthsList.length > 0 && (
          <div>
            <span className="text-[11px] font-semibold text-emerald-500 uppercase flex items-center gap-1 mb-1.5">
              <CheckCircle className="w-3 h-3" /> Core Strengths:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {strengthsList.map((strength, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 leading-relaxed"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}

        {weaknessesList.length > 0 && (
          <div>
            <span className="text-[11px] font-semibold text-amber-500 uppercase flex items-center gap-1 mb-1.5">
              <AlertTriangle className="w-3 h-3" /> Areas for Growth:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {weaknessesList.map((area, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 leading-relaxed"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Improvement Plan */}
        {report.improvementPlan && (
          <div className="pt-2 text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-xl border border-border/40 whitespace-pre-wrap">
            <strong className="text-foreground block mb-1 text-[11px]">Action Plan:</strong>
            {typeof report.improvementPlan === "object"
              ? JSON.stringify(report.improvementPlan, null, 2)
              : String(report.improvementPlan)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30 text-xs">
        <span className="text-muted-foreground text-[11px]">
          Generated: {new Date(report.createdAt).toLocaleDateString()}
        </span>
        {report.interview?.id && (
          <button
            onClick={() => onViewInterview(report.interview.id)}
            className="font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Interview #{report.interview.id}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
