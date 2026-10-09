"use client";

import { useState } from "react";
import {
  Sparkles,
  Search,
  Activity,
  Cpu,
  Zap,
  Eye,
  Clock,
  Loader2,
} from "lucide-react";
import { AdminAIRequest, useAdminAIRequests, cn } from "@repo/shared";
import { AdminPagination } from "@/shared";

interface AdminAiRequestsTabProps {
  onInspect: (id: string | number) => void;
}

export function AdminAiRequestsTab({ onInspect }: AdminAiRequestsTabProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [providerFilter, setProviderFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data, isLoading } = useAdminAIRequests({
    page,
    limit,
    provider: providerFilter !== "ALL" ? providerFilter : undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
  });

  const aiRequests: AdminAIRequest[] = data?.aiRequests || [];
  const pagination = data?.pagination;
  const metrics = (data as any)?.metrics;

  const totalTokens = metrics?.totalTokens ?? aiRequests.reduce((acc, curr) => acc + (curr.totalTokens || 0), 0);
  const promptTokens = metrics?.totalPromptTokens ?? aiRequests.reduce((acc, curr) => acc + (curr.promptTokens || 0), 0);
  const completionTokens = metrics?.totalCompletionTokens ?? aiRequests.reduce((acc, curr) => acc + (curr.completionTokens || 0), 0);
  const avgLatency = metrics?.avgLatencyMs ?? (aiRequests.length
    ? Math.round(aiRequests.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0) / aiRequests.length)
    : 0);

  const handleProviderChange = (val: string) => {
    setProviderFilter(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

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
            <Zap className="w-4 h-4 text-blue-500" /> Completion Tokens
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{completionTokens.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Model output & feedback tokens</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
            <Clock className="w-4 h-4 text-emerald-500" /> Average Latency
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{avgLatency} ms</div>
          <div className="text-[11px] text-muted-foreground mt-1">End-to-end response delay</div>
        </div>

        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
            <Activity className="w-4 h-4 text-amber-500" /> Total Token Volume
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{totalTokens.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Total model tokens billed</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Inference Event Log</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={providerFilter}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Providers</option>
            <option value="openai">OpenAI</option>
            <option value="gemini">Google Gemini</option>
            <option value="groq">Groq</option>
            <option value="anthropic">Anthropic</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
              <tr>
                <th className="px-5 py-3.5">Request Type</th>
                <th className="px-5 py-3.5">Provider / Model</th>
                <th className="px-5 py-3.5">Candidate / Interview</th>
                <th className="px-5 py-3.5">Tokens (In / Out)</th>
                <th className="px-5 py-3.5">Latency</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-muted-foreground text-sm">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span>Loading LLM inference telemetry...</span>
                    </div>
                  </td>
                </tr>
              ) : aiRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    No AI telemetry requests found.
                  </td>
                </tr>
              ) : (
                aiRequests.map((item) => (
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
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
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

        {/* Pagination Controls */}
        <AdminPagination
          pagination={pagination}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          itemLabel="AI requests"
        />
      </div>
    </div>
  );
}
