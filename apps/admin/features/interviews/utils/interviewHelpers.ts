import { AdminInterview } from "@repo/shared";

/**
 * Returns color CSS classes for a given score percentage
 */
export function getInterviewScoreColor(score?: number | null): string {
  if (score === undefined || score === null) return "text-muted-foreground";
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-rose-500";
}

/**
 * Returns Tailwind badge classes based on interview status
 */
export function getInterviewStatusBadgeClass(status?: string): string {
  switch (status) {
    case "Completed":
      return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
    case "Running":
      return "bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse";
    case "Pending":
      return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
    case "Paused":
      return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
    default:
      return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
  }
}

/**
 * Formats duration from seconds into minutes string
 */
export function formatInterviewDuration(durationInSeconds?: number | null): string {
  if (!durationInSeconds) return "—";
  return `${Math.round(durationInSeconds / 60)} min`;
}

/**
 * Formats candidate full name or falls back to email or candidate object
 */
export function getCandidateDisplayName(
  user?: AdminInterview["user"] | null,
  candidate?: AdminInterview["candidate"] | null
): string {
  if (user?.firstName) {
    return `${user.firstName} ${user.lastName || ""}`.trim();
  }
  if (user?.userName) {
    return user.userName;
  }
  if (user?.email) {
    return user.email;
  }
  if (candidate?.fullName) {
    return candidate.fullName;
  }
  if (candidate?.email) {
    return candidate.email;
  }
  return "Candidate";
}

/**
 * Returns the candidate initial letter for avatars
 */
export function getCandidateInitials(
  user?: AdminInterview["user"] | null,
  candidate?: AdminInterview["candidate"] | null
): string {
  if (user?.firstName?.[0]) return user.firstName[0].toUpperCase();
  if (user?.userName?.[0]) return user.userName[0].toUpperCase();
  if (user?.email?.[0]) return user.email[0].toUpperCase();
  if (candidate?.fullName?.[0]) return candidate.fullName[0].toUpperCase();
  if (candidate?.email?.[0]) return candidate.email[0].toUpperCase();
  return "C";
}
