import { AdminReport } from "@repo/shared";

/**
 * Normalizes array, multiline string, or comma-separated values into a string array
 */
export function toList(val: unknown): string[] {
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
}

/**
 * Returns score badge style classes based on performance score
 */
export function getReportScoreBadgeClass(overallScore: number): string {
  if (overallScore >= 80) {
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
  }
  if (overallScore >= 60) {
    return "bg-amber-500/10 text-amber-500 border-amber-500/30";
  }
  return "bg-rose-500/10 text-rose-500 border-rose-500/30";
}

/**
 * Formats candidate full name or falls back to email for reports
 */
export function getReportCandidateName(user?: AdminReport["user"] | null): string {
  if (!user) return "Candidate";
  if (user.firstName) {
    return `${user.firstName} ${user.lastName || ""}`.trim();
  }
  return user.email || "Candidate";
}
