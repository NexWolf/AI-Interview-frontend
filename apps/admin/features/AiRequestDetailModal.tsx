"use client";

import { X, Sparkles, Cpu, Clock, Activity, AlertCircle } from "lucide-react";
import { AdminAIRequest } from "@/shared/types/admin";
import { cn } from "@/shared/lib/utils";

interface AiRequestDetailModalProps {
  request: AdminAIRequest | null;
  onClose: () => void;
}

export function AiRequestDetailModal({
  request,
  onClose,
}: AiRequestDetailModalProps) {
  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/60 bg-muted/20">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                AI Telemetry Inspection #{request.id}
              </h3>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-semibold",
                  request.status === "SUCCESS"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                )}
              >
                {request.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              Type: {request.requestType} · Provider: {request.conversation?.provider || "openai"} ({request.conversation?.model || "gpt-4o"})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Token Breakdown Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-border/40 bg-muted/20">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase">Prompt Tokens</div>
              <div className="text-base font-bold text-foreground mt-1">{request.promptTokens ?? 0}</div>
            </div>
            <div className="p-3 rounded-xl border border-border/40 bg-muted/20">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase">Completion Tokens</div>
              <div className="text-base font-bold text-foreground mt-1">{request.completionTokens ?? 0}</div>
            </div>
            <div className="p-3 rounded-xl border border-border/40 bg-muted/20">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase">Latency</div>
              <div className="text-base font-bold text-foreground mt-1">{request.latencyMs ?? 0} ms</div>
            </div>
          </div>

          {/* Error Message if any */}
          {request.errorMessage && (
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{request.errorMessage}</span>
            </div>
          )}

          {/* Prompt context */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Prompt & System Instructions
            </label>
            <pre className="p-3.5 rounded-xl bg-muted/50 border border-border/40 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
              {request.promptPayload
                ? typeof request.promptPayload === "object"
                  ? JSON.stringify(request.promptPayload, null, 2)
                  : String(request.promptPayload)
                : "No prompt payload recorded."}
            </pre>
          </div>

          {/* Response Payload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              AI Generation Response
            </label>
            <pre className="p-3.5 rounded-xl bg-muted/50 border border-border/40 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
              {request.responsePayload
                ? typeof request.responsePayload === "object"
                  ? JSON.stringify(request.responsePayload, null, 2)
                : String(request.responsePayload)
              : "No response payload recorded."}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/60 bg-muted/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
