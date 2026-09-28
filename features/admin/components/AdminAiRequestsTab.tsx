"use client";

import { useState } from "react";
import {
  Sparkles,
  Search,
  Filter,
  Activity,
  Cpu,
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Layers,
} from "lucide-react";
import { AdminAIRequest } from "@/shared/types/admin";
import { cn } from "@/shared/lib/utils";

interface AdminAiRequestsTabProps {
  aiRequests: AdminAIRequest[];
  isLoading: boolean;
  onInspect: (id: string | number) => void;
}

export function AdminAiRequestsTab({
  aiRequests,
  isLoading,
  onInspect,
}: AdminAiRequestsTabProps) {
  const [providerFilter, setProviderFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const totalTokens = aiRequests.reduce((acc, curr) => acc + (curr.totalTokens || 0), 0);
  const promptTokens = aiRequests.reduce((acc, curr) => acc + (curr.promptTokens || 0), 0);
  const completionTokens = aiRequests.reduce((acc, curr) => acc + (curr.completionTokens || 0), 0);
  const avgLatency = aiRequests.length
    ? Math.round(aiRequests.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0) / aiRequests.length)
    : 0;

  const filtered = aiRequests.filter((item) => {
    const matchProvider =
      providerFilter === "ALL" ||
      item.conversation?.provider?.toLowerCase() === providerFilter.toLowerCase();
    const matchStatus =
      statusFilter === "ALL" || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchProvider && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Telemetry Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
            <Cpu className="w-4 h-4 text-violet-500" /> Total Prompt Tokens
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{promptTokens.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Input instructions & candidate context</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
            <Sparkles className="w-4 h-4 text-emerald-500" /> Completion Tokens
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{completionTokens.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Generated evaluations & questions</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
            <Layers className="w-4 h-4 text-blue-500" /> Total Tokens Billed
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{totalTokens.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Across all AI inference engines</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
            <Zap className="w-4 h-4 text-amber-500" /> Mean Latency
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{avgLatency} ms</div>
          <div className="text-[11px] text-muted-foreground mt-1">Average round-trip response time</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Live AI Inference Log
        </div>

        <div className="flex items-center gap-2">
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Providers</option>
            <option value="openai">OpenAI</option>
            <option value="gemini">Google Gemini</option>
            <option value="anthropic">Anthropic Claude</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* AI Telemetry Table */}
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
              <tr>
                <th className="px-5 py-3.5">Request Type</th>
                <th className="px-5 py-3.5">Provider / Model</th>
                <th className="px-5 py-3.5">Candidate Context</th>
                <th className="px-5 py-3.5">Tokens (In / Out)</th>
                <th className="px-5 py-3.5">Latency</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    Streaming AI telemetry data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    No AI telemetry records match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-mono text-xs font-semibold text-foreground">
                        {item.requestType}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-foreground border border-border/50">
                        {item.conversation?.provider || "openai"} / {item.conversation?.model || "default"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {item.interview?.user ? (
                        <div>
                          <div className="text-xs font-medium text-foreground">
                            {item.interview.user.firstName ? `${item.interview.user.firstName} ${item.interview.user.lastName || ""}` : item.interview.user.email}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            Interview #{item.interview.id}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-xs text-foreground font-medium">
                        {item.promptTokens ?? 0} in / {item.completionTokens ?? 0} out
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Total: {item.totalTokens ?? 0}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{item.latencyMs ?? 0} ms</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5",
                          item.status === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : item.status === "FAILED"
                              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onInspect(item.id)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                        title="Inspect AI Payload"
                      >
                        <Eye className="w-4 h-4" />
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
