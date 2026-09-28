"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Trophy,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { AdminReport } from "@/shared/types/admin";
import { cn } from "@/shared/lib/utils";

interface AdminReportsTabProps {
  reports: AdminReport[];
  isLoading: boolean;
  onViewInterview: (id: string | number) => void;
}

const toList = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === "string") {
    if (val.includes("\n")) {
      return val
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [val.trim()].filter(Boolean);
  }
  return [String(val)];
};

export function AdminReportsTab({
  reports,
  isLoading,
  onViewInterview,
}: AdminReportsTabProps) {
  const [search, setSearch] = useState("");

  const filtered = reports.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const strengthsStr = typeof item.strengths === "string" ? item.strengths : "";
    const weaknessesStr = typeof item.weaknesses === "string" ? item.weaknesses : "";
    const summaryStr = item.summaryEn || item.summaryAr || "";

    return (
      item.user?.firstName?.toLowerCase().includes(q) ||
      item.user?.lastName?.toLowerCase().includes(q) ||
      item.user?.email?.toLowerCase().includes(q) ||
      summaryStr.toLowerCase().includes(q) ||
      strengthsStr.toLowerCase().includes(q) ||
      weaknessesStr.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search evaluation reports by candidate or feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> evaluation reports
        </div>
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-sm text-muted-foreground">
          Loading candidate evaluation reports...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-sm text-muted-foreground">
          No reports found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((report) => {
            const overall = Number(report.overallScore ?? 0);
            const strengthsList = toList(report.strengths);
            const weaknessesList = toList(report.weaknesses || report.areasForImprovement);
            const candidateName = report.user?.firstName
              ? `${report.user.firstName} ${report.user.lastName || ""}`
              : report.user?.email || "Candidate";

            return (
              <div
                key={report.id}
                className="p-5 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                      <span>{candidateName}</span>
                      {report.currentLevel && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                          {report.currentLevel}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{report.user?.email}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground font-medium uppercase">Overall</div>
                      <div
                        className={cn(
                          "text-lg font-bold",
                          overall >= 80
                            ? "text-emerald-500"
                            : overall >= 60
                            ? "text-amber-500"
                            : "text-rose-500",
                        )}
                      >
                        {overall}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown if available */}
                {(report.technicalKnowledgeScore !== undefined || report.communicationScore !== undefined) && (
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                    {report.technicalKnowledgeScore !== undefined && (
                      <div className="p-2 rounded-xl bg-muted/30 border border-border/40">
                        <div className="text-muted-foreground text-[10px]">Technical</div>
                        <div className="font-bold text-foreground mt-0.5">
                          {Number(report.technicalKnowledgeScore)}%
                        </div>
                      </div>
                    )}
                    {report.communicationScore !== undefined && (
                      <div className="p-2 rounded-xl bg-muted/30 border border-border/40">
                        <div className="text-muted-foreground text-[10px]">Communication</div>
                        <div className="font-bold text-foreground mt-0.5">
                          {Number(report.communicationScore)}%
                        </div>
                      </div>
                    )}
                    {report.confidenceScore !== undefined && (
                      <div className="p-2 rounded-xl bg-muted/30 border border-border/40">
                        <div className="text-muted-foreground text-[10px]">Confidence</div>
                        <div className="font-bold text-foreground mt-0.5">
                          {Number(report.confidenceScore)}%
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Summary if available */}
                {(report.summaryEn || report.summaryAr) && (
                  <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl line-clamp-3">
                    {report.summaryEn || report.summaryAr}
                  </div>
                )}

                {/* Strengths & Weaknesses */}
                <div className="space-y-2 pt-1 border-t border-border/30">
                  {strengthsList.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-emerald-500 uppercase flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Strengths:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {strengthsList.map((str, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 leading-relaxed"
                          >
                            {str}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {weaknessesList.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-semibold text-amber-500 uppercase flex items-center gap-1">
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
                      {typeof report.improvementPlan === "object" ? JSON.stringify(report.improvementPlan, null, 2) : String(report.improvementPlan)}
                    </div>
                  )}
                </div>

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
          })}
        </div>
      )}
    </div>
  );
}
