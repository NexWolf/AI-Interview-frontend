import { AdminUser } from "@repo/shared";

/**
 * Returns role badge styling classes
 */
export function getUserRoleBadgeClass(role?: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "ADMIN":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default:
      return "bg-muted text-muted-foreground border-border/50";
  }
}

/**
 * Returns status badge styling classes
 */
export function getUserStatusBadgeClass(isActive: boolean): string {
  return isActive
    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
    : "bg-rose-500/10 text-rose-500 border border-rose-500/20";
}

/**
 * Formats user full name or falls back to email
 */
export function getUserDisplayName(
  user?: Pick<AdminUser, "firstName" | "lastName" | "email"> | null
): string {
  if (!user) return "User";
  if (user.firstName) {
    return `${user.firstName} ${user.lastName || ""}`.trim();
  }
  return user.email || "User";
}

/**
 * Returns initials for user avatar display
 */
export function getUserInitials(
  user?: Pick<AdminUser, "firstName" | "email"> | null
): string {
  if (!user) return "U";
  return user.firstName?.[0]?.toUpperCase() || user.email[0]?.toUpperCase() || "U";
}

/**
 * Returns user handle (e.g. @johndoe)
 */
export function getUserHandle(
  user?: Pick<AdminUser, "userName" | "email"> | null
): string {
  if (!user) return "@user";
  return `@${user.userName || user.email.split("@")[0]}`;
}
