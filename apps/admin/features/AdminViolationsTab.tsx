"use client";

import { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { AdminViolation } from "@/shared/types/admin";
import { useAdminViolations } from "@/shared/hook/useAdmin";
import { AdminPagination } from "./AdminPagination";
import { cn } from "@/shared/lib/utils";

interface AdminViolationsTabProps {
  onViewInterview: (id: string | number) => void;
}

export function AdminViolationsTab({ onViewInterview }: AdminViolationsTabProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const { data, isLoading } = useAdminViolations({
    page,
    limit,
    category: categoryFilter !== "ALL" ? categoryFilter : undefined,
    isCheating: typeFilter === "CHEATING" ? "true" : undefined,
    isTechnicalIssue: typeFilter === "TECHNICAL" ? "true" : undefined,
  });

  const violations: AdminViolation[] = data?.violations || [];
  const pagination = data?.pagination;

  const cheatingCount = violations.filter((v) => v.isCheating).length;
  const techIssueCount = violations.filter((v) => v.isTechnicalIssue).length;

  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setPage(1);
  };

  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Violations KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase">
            <ShieldAlert className="w-4 h-4" /> Cheating Flags On Page
          </div>
          <div className="text-3xl font-bold text-foreground mt-2">{cheatingCount}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Tab switches, multiple faces, copy-paste</div>
        </div>

        <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase">
            <AlertTriangle className="w-4 h-4" /> Technical & Audio Anomaly
          </div>
          <div className="text-3xl font-bold text-foreground mt-2">{techIssueCount}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Audio glitches, mic dropouts, camera lost</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
            <ShieldAlert className="w-4 h-4 text-primary" /> Total Recorded Alerts
          </div>
          <div className="text-3xl font-bold text-foreground mt-2">{pagination?.total ?? violations.length}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Total proctoring integrity events recorded</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{violations.length}</span> of{" "}
          <span className="font-semibold text-foreground">{pagination?.total ?? violations.length}</span> security alerts
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="TAB_SWITCH">Tab Switch</option>
            <option value="MULTIPLE_FACES">Multiple Faces</option>
            <option value="NO_FACE">No Face Detected</option>
            <option value="AUDIO_ANOMALY">Audio Anomaly</option>
            <option value="FULLSCREEN_EXIT">Fullscreen Exit</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Incident Types</option>
            <option value="CHEATING">Cheating Risk Only</option>
            <option value="TECHNICAL">Technical Issue Only</option>
          </select>
        </div>
      </div>

      {/* Violations Table */}
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
              <tr>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Candidate</th>
                <th className="px-5 py-3.5">Violation Details</th>
                <th className="px-5 py-3.5">Risk Level</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5 text-right">Related Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-muted-foreground text-sm">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span>Loading proctoring records...</span>
                    </div>
                  </td>
                </tr>
              ) : violations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    No integrity incidents recorded.
                  </td>
                </tr>
              ) : (
                violations.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-foreground border border-border/50">
                        {item.category.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground text-xs">
                        {item.user?.firstName ? `${item.user.firstName} ${item.user.lastName || ""}` : item.user?.email}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{item.user?.email}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-xs font-medium text-foreground">{item.violationType}</div>
                      {item.details && (
                        <div className="text-[11px] text-muted-foreground mt-0.5 max-w-sm truncate">
                          {item.details}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {item.isCheating ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          Cheating Risk
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          Technical Glitch
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-xs text-foreground">
                        {new Date(item.occurredAt).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(item.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onViewInterview(item.interviewId)}
                        className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Session #{String(item.interviewId)}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <AdminPagination
          pagination={pagination}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          itemLabel="violations"
        />
      </div>
    </div>
  );
}
