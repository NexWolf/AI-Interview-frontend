"use client";

import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { AdminViolation, cn } from "@repo/shared";

interface SecurityLogFeedProps {
  violations: AdminViolation[];
  onSelectTab: (tab: string) => void;
}

export function SecurityLogFeed({ violations, onSelectTab }: SecurityLogFeedProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" /> Security Log
          </h3>
          <p className="text-xs text-muted-foreground">Real-time anti-cheating detections</p>
        </div>
        <button
          onClick={() => onSelectTab("violations")}
          className="text-xs font-medium text-rose-500 hover:underline"
        >
          All Alerts
        </button>
      </div>

      <div className="space-y-3">
        {violations.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            No security violations detected.
          </div>
        ) : (
          violations.slice(0, 4).map((violation) => (
            <div
              key={violation.id}
              className="p-3.5 rounded-xl border border-border/40 bg-background/50 hover:bg-muted/40 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full font-semibold text-[10px]",
                    violation.isCheating
                      ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                      : "bg-amber-500/15 text-amber-500 border border-amber-500/30",
                  )}
                >
                  {violation.category.replace("_", " ")}
                </span>
                <span className="text-muted-foreground text-[11px]">
                  {new Date(violation.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="text-xs font-medium text-foreground">{violation.violationType}</div>
              <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1">
                <span>
                  User: {violation.user.firstName ? `${violation.user.firstName}` : violation.user.email}
                </span>
                <span className="font-mono text-[10px]">#{violation.interviewId}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
