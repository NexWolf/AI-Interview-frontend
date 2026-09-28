"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  AlertTriangle,
  Eye,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
} from "lucide-react";
import { AdminViolation } from "@/shared/types/admin";
import { cn } from "@/shared/lib/utils";

interface AdminViolationsTabProps {
  violations: AdminViolation[];
  isLoading: boolean;
  onViewInterview: (id: string | number) => void;
}

export function AdminViolationsTab({
  violations,
  isLoading,
  onViewInterview,
}: AdminViolationsTabProps) {
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const cheatingCount = violations.filter((v) => v.isCheating).length;
  const techIssueCount = violations.filter((v) => v.isTechnicalIssue).length;

  const filtered = violations.filter((item) => {
    const matchCat = categoryFilter === "ALL" || item.category === categoryFilter;
    const matchType =
      typeFilter === "ALL" ||
      (typeFilter === "CHEATING" && item.isCheating) ||
      (typeFilter === "TECHNICAL" && item.isTechnicalIssue);
    return matchCat && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Violations KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase">
            <ShieldAlert className="w-4 h-4" /> Confirmed Cheating Flags
          </div>
          <div className="text-3xl font-bold text-foreground mt-2">{cheatingCount}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Tab switches, secondary screens, copy-paste</div>
        </div>

        <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase">
            <AlertTriangle className="w-4 h-4" /> Technical & Audio Anomaly
          </div>
          <div className="text-3xl font-bold text-foreground mt-2">{techIssueCount}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Camera drops, microphone noise spikes</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
            <Layers className="w-4 h-4 text-blue-500" /> Total Monitored Incidents
          </div>
          <div className="text-3xl font-bold text-foreground mt-2">{violations.length}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Across all live test sessions</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500" /> Proctoring & Integrity Incident Feed
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="TAB_SWITCH">Tab Switching</option>
            <option value="AUDIO_ANOMALY">Audio / Secondary Voice</option>
            <option value="MULTIPLE_FACES">Multiple Faces Detected</option>
            <option value="NO_FACE">Face Not Detected</option>
            <option value="FULLSCREEN_EXIT">Fullscreen Exited</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Severity</option>
            <option value="CHEATING">Cheating Suspected</option>
            <option value="TECHNICAL">Technical Issue</option>
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
                <th className="px-5 py-3.5">Incident Description</th>
                <th className="px-5 py-3.5">Classification</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5 text-right">Interview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    Loading proctoring records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    No integrity incidents recorded.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-foreground border border-border/50">
                        {item.category.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground text-xs">
                        {item.user.firstName ? `${item.user.firstName} ${item.user.lastName || ""}` : item.user.email}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{item.user.email}</div>
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
                        <span>Session #{item.interviewId}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
