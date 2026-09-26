"use client";

import { API_URL } from "@/constants/routes";
import { CheckCircle2, Clock3, Loader2, Send, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type GuestInterview = {
  candidateName: string;
  roleTitle: string;
  specialization: string;
  difficulty: string;
  expiresAt: string;
  organization: { name: string; websiteUrl?: string | null };
  questions: { id: string; prompt: string; category: string }[];
};

export default function GuestInterviewPage({ token }: { token: string }) {
  const [interview, setInterview] = useState<GuestInterview | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ overallScore: number; summary: string } | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/partners/guest-interviews/${encodeURIComponent(token)}`)
      .then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.message || "Interview unavailable"); return payload.data.interview; })
      .then(setInterview).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
  }, [token]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!interview) return;
    setSubmitting(true); setError("");
    try {
      const response = await fetch(`${API_URL}/api/v1/partners/guest-interviews/${encodeURIComponent(token)}/complete`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ answers: interview.questions.map((question) => ({ questionId: question.id, answer: answers[question.id] || "" })) }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Could not submit interview");
      setResult(payload.data.result);
    } catch (reason: unknown) { setError(reason instanceof Error ? reason.message : "Could not submit interview"); } finally { setSubmitting(false); }
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-7 w-7 animate-spin text-primary" /></main>;
  if (error && !interview) return <main className="flex min-h-screen items-center justify-center bg-background p-6"><div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center"><h1 className="text-xl font-bold">Interview unavailable</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p></div></main>;
  if (result) return <main className="flex min-h-screen items-center justify-center bg-background p-6"><div className="max-w-lg rounded-3xl border border-emerald-500/30 bg-card p-8 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" /><h1 className="mt-4 text-2xl font-bold">Interview submitted</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{result.summary}</p><p className="mt-5 text-xs text-muted-foreground">Your responses and structured feedback are now available to {interview?.organization.name}. You may close this page.</p></div></main>;

  return <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:py-12"><form onSubmit={submit} className="mx-auto max-w-3xl space-y-6">
    <header className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-7 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{interview?.organization.name} invited you</p><h1 className="mt-2 text-3xl font-bold">{interview?.roleTitle} interview</h1><p className="mt-2 text-sm text-muted-foreground">Hello {interview?.candidateName}. Answer in your own words and use concrete examples from your experience.</p><div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="rounded-full border border-border bg-background/60 px-3 py-1.5">{interview?.specialization}</span><span className="rounded-full border border-border bg-background/60 px-3 py-1.5">{interview?.difficulty}</span><span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5"><Clock3 className="h-3 w-3" /> Expires {new Date(interview!.expiresAt).toLocaleDateString()}</span></div></header>
    <div className="rounded-xl border border-border bg-card/60 p-4 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-500" />Your answers will be evaluated by AI and shared with the inviting organization. Do not include passwords, government IDs, health information, or other sensitive personal data.</div>
    {interview?.questions.map((question, index) => <section key={question.id} className="rounded-2xl border border-border/70 bg-card/70 p-5 sm:p-6"><p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{question.category} · Question {index + 1}</p><label htmlFor={question.id} className="mt-2 block font-semibold leading-6">{question.prompt}</label><textarea id={question.id} required minLength={10} rows={6} value={answers[question.id] || ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Write a detailed answer in your own words..." className="mt-4 w-full rounded-xl border border-input-border bg-input px-4 py-3 text-sm leading-6 outline-none focus:border-primary" /></section>)}
    {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">{error}</p>}
    <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground disabled:opacity-50">{submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating interview...</> : <><Send className="h-4 w-4" /> Submit final answers</>}</button>
  </form></main>;
}
