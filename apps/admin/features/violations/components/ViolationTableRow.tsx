"use client";

import { AdminViolation, cn } from "@repo/shared";
import {
  formatViolationCategory,
  getViolationRiskBadge,
  getViolationCandidateName,
} from "../utils/violationHelpers";

interface ViolationTableRowProps {
  violation: AdminViolation;
  onViewInterview: (id: string | number) => void;
}

export function ViolationTableRow({
  violation: item,
  onViewInterview,
}: ViolationTableRowProps) {
  const candidateName = getViolationCandidateName(item.user);
  const riskBadge = getViolationRiskBadge(item.isCheating);

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-5 py-4">
        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-foreground border border-border/50">
          {formatViolationCategory(item.category)}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="font-medium text-foreground text-xs">{candidateName}</div>
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
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
            riskBadge.className
          )}
        >
          {riskBadge.text}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="text-xs text-foreground">
          {new Date(item.occurredAt).toLocaleDateString()}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {new Date(item.occurredAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
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
  );
}
