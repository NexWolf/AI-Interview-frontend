"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Clock,
  Briefcase,
  Loader2,
} from "lucide-react";
import { AdminInterview } from "../../packages/types/admin";
import { useAdminInterviews } from "../../packages/hook/useAdmin";
import { AdminPagination } from "./AdminPagination";
import { cn } from "../../packages/lib/utils";

interface AdminInterviewsTabProps {
  onViewDetails: (id: string | number) => void;
}

export function AdminInterviewsTab({ onViewDetails }: AdminInterviewsTabProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [langFilter, setLangFilter] = useState("ALL");

  const { data, isLoading } = useAdminInterviews({
    page,
    limit,
    user: search.trim() || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    language: langFilter !== "ALL" ? langFilter : undefined,
  });

  const interviews: AdminInterview[] = data?.interviews || [];
  const pagination = data?.pagination;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleLangChange = (val: string) => {
    setLangFilter(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidate by name, email, or interview ID..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Running">Running</option>
            <option value="Pending">Pending</option>
            <option value="Paused">Paused</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            value={langFilter}
            onChange={(e) => handleLangChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Languages</option>
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
          </select>
        </div>
      </div>

      {/* Interviews Table */}
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
              <tr>
                <th className="px-5 py-3.5">Candidate</th>
                <th className="px-5 py-3.5">Language / Level</th>
                <th className="px-5 py-3.5">Skills Evaluated</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Score</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-muted-foreground text-sm">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span>Loading interview sessions...</span>
                    </div>
                  </td>
                </tr>
              ) : interviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    No interviews match the current criteria.
                  </td>
                </tr>
              ) : (
                interviews.map((item) => {
                  const score = item.reports?.[0]?.overallScore;
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0 text-xs">
                            {item.user.firstName?.[0] || item.user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {item.user.firstName ? `${item.user.firstName} ${item.user.lastName || ""}` : item.user.email}
                            </div>
                            <div className="text-xs text-muted-foreground">{item.user.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-xs font-medium text-foreground">{item.interviewLanguage}</div>
                        <div className="text-[11px] text-muted-foreground">{item.difficultyLevel}</div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                          {item.interviewSkills && item.interviewSkills.length > 0 ? (
                            item.interviewSkills.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border/50"
                              >
                                {s.skill?.nameEn || s.skill?.nameAr}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">General</span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{item.duration ? `${Math.round(item.duration / 60)} min` : "—"}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground/80 mt-0.5">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5",
                            item.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : item.status === "Running"
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse"
                              : item.status === "Pending"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {score !== undefined && score !== null ? (
                          <div
                            className={cn(
                              "font-bold text-sm",
                              score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500",
                            )}
                          >
                            {score}%
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => onViewDetails(item.id)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
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
          itemLabel="interviews"
        />
      </div>
    </div>
  );
}
