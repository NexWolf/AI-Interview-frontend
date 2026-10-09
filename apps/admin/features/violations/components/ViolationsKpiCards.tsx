"use client";

import { ShieldAlert, AlertTriangle } from "lucide-react";

interface ViolationsKpiCardsProps {
  cheatingCount: number;
  techIssueCount: number;
  totalAlerts: number;
}

export function ViolationsKpiCards({
  cheatingCount,
  techIssueCount,
  totalAlerts,
}: ViolationsKpiCardsProps) {
  return (
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
        <div className="text-3xl font-bold text-foreground mt-2">{totalAlerts}</div>
        <div className="text-[11px] text-muted-foreground mt-1">Total proctoring integrity events recorded</div>
      </div>
    </div>
  );
}
