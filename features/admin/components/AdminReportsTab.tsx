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
  Loader2,
} from "lucide-react";
import { AdminReport } from "@/shared/types/admin";
import { useAdminReports } from "@/shared/hook/useAdmin";
import { AdminPagination } from "./AdminPagination";
import { cn } from "@/shared/lib/utils";

interface AdminReportsTabProps {
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

export function AdminReportsTab({ onViewInterview }: AdminReportsTabProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminReports({
    page,
    limit,
    user: search.trim() || undefined,
  });

  const reports: AdminReport[] = data?.reports || [];
  const pagination = data?.pagination;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Total evaluations: <span className="font-semibold text-foreground">{pagination?.total ?? reports.length}</span>
        </div>
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span>Loading candidate evaluation reports...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 text-center text-sm text-muted-foreground border border-border/50 rounded-2xl bg-card/30">
          No reports found.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => {
              const overall = Number(report.overallScore ?? 0);
              const strengthsList = toList(report.strengths);
              const weaknessesList = toList(report.weaknesses || report.areasForImprovement);
              const candidateName = report.user?.firstName
                ? `${report.user.firstName} ${report.user.lastName || ""}`
                : report.user?.email || "Candidate";

              return (
                <div
                  key={report.id}
                  className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-5 space-y-4 hover:border-primary/40 transition-all hover:shadow-lg"
                >
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
                        overall >= 80
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          : overall >= 60
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          : "bg-rose-500/10 text-rose-500 border-rose-500/30",
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

                  {/* Strengths & Weaknesses Pill Badges */}
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

          {/* Pagination Controls */}
          <div className="rounded-2xl border border-border/50 overflow-hidden shadow-xs">
            <AdminPagination
              pagination={pagination}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
              itemLabel="evaluations"
            />
          </div>
        </div>
      )}
    </div>
  );
}
