import { ReportApi } from "@/features/interview/types/interviewRoom";

export interface DetailedEvaluation {
  questionId?: string;
  questionOrder?: number;
  question?: string;
  skill?: string;
  skillId?: string;
  difficulty?: string;
  score?: number | string;
  feedback?: string;
  answer?: string;
  modelAnswer?: string;
  improvement?: string;
  strengths?: string[];
  weaknesses?: string[];
  [key: string]: unknown;
}

export const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const statusStyles: Record<string, string> = {
  Running: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  Completed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  Paused: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Pending: "bg-slate-500/10 text-slate-300 border-slate-600/30",
  Failed: "bg-red-500/10 text-red-400 border-red-500/30",
};

export const scoreColor = (score: number) =>
  score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400";

export const scoreRingColor = (score: number) =>
  score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#f43f5e";

export function parseDetailedAnalysis(report: ReportApi | null): DetailedEvaluation[] {
  const raw = report?.detailedAnalysis;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as DetailedEvaluation[];
  if (raw && typeof raw === "object") {
    const val =
      (raw as Record<string, unknown>).evaluations ??
      (raw as Record<string, unknown>).questions;
    if (Array.isArray(val)) return val as DetailedEvaluation[];
  }
  return [];
}

export function parseRecommendations(report: ReportApi | null): string[] {
  const raw = report?.recommendations;
  if (!raw) return [];
  if (typeof raw === "string") return [raw];
  if (Array.isArray(raw)) {
    return raw.map((r) => (typeof r === "string" ? r : JSON.stringify(r)));
  }
  const arr =
    (raw as Record<string, unknown>).list ??
    (raw as Record<string, unknown>).recommendations;
  if (Array.isArray(arr)) {
    return arr.map((r) => (typeof r === "string" ? r : JSON.stringify(r)));
  }
  return [];
}
