/**
 * Filters a skills list by case-insensitive search query
 */
export function filterSkills<T extends { nameEn?: string; name?: string }>(
  skills: T[] | undefined,
  search: string
): T[] {
  if (!skills) return [];
  const q = search.trim().toLowerCase();
  if (!q) return skills;
  return skills.filter((s) => (s.nameEn || s.name || "").toLowerCase().includes(q));
}

/**
 * Returns status badge classes for active/inactive skill states
 */
export function getSkillStatusBadgeClass(isActive: boolean): string {
  return isActive
    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
    : "bg-muted text-muted-foreground border-border/50";
}
