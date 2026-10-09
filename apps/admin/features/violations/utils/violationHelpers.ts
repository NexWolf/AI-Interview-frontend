import { AdminViolation } from "@repo/shared";

/**
 * Formats enum style category string into human readable title (e.g. TAB_SWITCH -> TAB SWITCH)
 */
export function formatViolationCategory(category?: string): string {
  if (!category) return "";
  return category.replace(/_/g, " ");
}

/**
 * Returns risk badge text and styling classes
 */
export function getViolationRiskBadge(isCheating: boolean): { text: string; className: string } {
  if (isCheating) {
    return {
      text: "Cheating Risk",
      className: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
    };
  }
  return {
    text: "Technical Glitch",
    className: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  };
}

/**
 * Formats candidate display name or falls back to email
 */
export function getViolationCandidateName(user?: AdminViolation["user"] | null): string {
  if (!user) return "Candidate";
  if (user.firstName) {
    return `${user.firstName} ${user.lastName || ""}`.trim();
  }
  return user.email || "Candidate";
}
