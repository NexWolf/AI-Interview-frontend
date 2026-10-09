export const statusStyles: Record<string, string> = {
  Running: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  Completed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  Paused: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Pending: "bg-slate-500/10 text-slate-300 border-slate-600/30",
  Failed: "bg-red-500/10 text-red-400 border-red-500/30",
};

export const toNumber = (score: number | string | null | undefined): number =>
  typeof score === "number" ? score : Number(score ?? 0);

export const formatDate = (iso?: string | null): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const greeting = (isAr: boolean): string => {
  const hour = new Date().getHours();
  if (isAr) {
    if (hour < 12) return "صباح الخير";
    return "مساء الخير";
  }
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};
