"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, BookOpen, CheckCircle2, Circle, Code2, Loader2, Lock, MessageCircle, Rocket, Sparkles, Trophy } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { learningService } from "./learning.service";
import { LearningTask } from "./types";

const JOURNEY_KEY = ["learning-journey"];
type ApiError = { response?: { data?: { message?: string } } };
const apiMessage = (error: unknown, fallback: string) => (error as ApiError)?.response?.data?.message || fallback;

export default function LearningJourneyPage() {
  const queryClient = useQueryClient();
  const { data: journey, isLoading } = useQuery({ queryKey: JOURNEY_KEY, queryFn: learningService.journey });
  const { data: questions = [] } = useQuery({ queryKey: ["specialization-questions"], queryFn: learningService.questions, enabled: journey === null });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeTask, setActiveTask] = useState<LearningTask | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [defenseAnswer, setDefenseAnswer] = useState("");

  const assess = useMutation({
    mutationFn: () => learningService.assess(questions.map((question) => ({ questionId: question.id, answer: answers[question.id] || "" }))),
    onSuccess: (data) => { queryClient.setQueryData(JOURNEY_KEY, data); toast.success("Your personal roadmap is ready"); },
    onError: () => toast.error("We could not create your roadmap. Please try again."),
  });
  const submit = useMutation({
    mutationFn: () => learningService.submitTask(activeTask!.id, { submissionUrl, notes }),
    onSuccess: (task) => { setActiveTask(task); queryClient.invalidateQueries({ queryKey: JOURNEY_KEY }); toast.success("AI review complete — answer the ownership question"); },
    onError: (error: unknown) => toast.error(apiMessage(error, "Submission failed")),
  });
  const defend = useMutation({
    mutationFn: () => learningService.defendTask(activeTask!.id, defenseAnswer),
    onSuccess: (result) => { toast.success(result.task.status === "Completed" ? "Work verified and XP awarded" : "Please revise your work and try again"); setActiveTask(null); setNotes(""); setSubmissionUrl(""); setDefenseAnswer(""); queryClient.invalidateQueries({ queryKey: JOURNEY_KEY }); },
    onError: (error: unknown) => toast.error(apiMessage(error, "Interview answer failed")),
  });

  const answeredCount = useMemo(() => questions.filter((question) => answers[question.id]?.trim()).length, [answers, questions]);

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>;

  if (!journey) {
    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-7 sm:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" /> AI specialization guide</div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Find the programming path that fits you</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">There is no wrong starting point. Your answers help the coach recommend one focused specialization and build a level-by-level roadmap around your goals.</p>
        </div>
        <div className="space-y-5">
          {questions.map((question, index) => (
            <section key={question.id} className="rounded-2xl border border-border/70 bg-card/70 p-5 sm:p-6">
              <p className="mb-4 font-semibold"><span className="mr-2 text-primary">{index + 1}.</span>{question.prompt}</p>
              {question.type === "single" ? (
                <div className="grid gap-2 sm:grid-cols-2">{question.options?.map((option) => <button type="button" key={option} onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))} className={`rounded-xl border px-4 py-3 text-left text-sm transition ${answers[question.id] === option ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40 hover:bg-muted/50"}`}>{option}</button>)}</div>
              ) : (
                <textarea value={answers[question.id] || ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} rows={3} placeholder="Write a few sentences..." className="w-full rounded-xl border border-input-border bg-input px-4 py-3 text-sm outline-none focus:border-primary" />
              )}
            </section>
          ))}
        </div>
        <button disabled={answeredCount !== questions.length || assess.isPending} onClick={() => assess.mutate()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground disabled:opacity-50">{assess.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Designing your roadmap...</> : <>Create my roadmap <ArrowRight className="h-4 w-4" /></>}</button>
      </div>
    );
  }

  const completed = journey.levels.flatMap((level) => level.tasks).filter((task) => task.status === "Completed").length;
  const total = journey.levels.flatMap((level) => level.tasks).length;
  return (
    <div className="space-y-7">
      <header className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/20 via-card to-card p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your specialization</p><h1 className="text-3xl font-bold">{journey.specializationName}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{journey.specializationReason}</p></div>
          <div className="flex gap-3"><div className="rounded-2xl border border-border bg-background/60 px-5 py-3 text-center"><p className="text-2xl font-bold text-primary">{journey.xp}</p><p className="text-[11px] text-muted-foreground">XP earned</p></div><div className="rounded-2xl border border-border bg-background/60 px-5 py-3 text-center"><p className="text-2xl font-bold">{completed}/{total}</p><p className="text-[11px] text-muted-foreground">Tasks verified</p></div></div>
        </div>
      </header>

      <div className="space-y-5">
        {journey.levels.map((level) => {
          const unlocked = level.levelNumber <= journey.currentLevel;
          return <section key={level.id} className={`rounded-2xl border bg-card/70 p-5 sm:p-6 ${unlocked ? "border-border/70" : "border-border/40 opacity-65"}`}>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div className="flex gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold ${unlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{unlocked ? level.levelNumber : <Lock className="h-4 w-4" />}</div><div><h2 className="text-lg font-bold">{level.title}</h2><p className="mt-1 text-sm text-muted-foreground">{level.description}</p></div></div>{unlocked && <Link href={`/dashboard/community?level=${level.levelNumber}`} className="inline-flex items-center gap-2 self-start rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted"><MessageCircle className="h-3.5 w-3.5" /> Level community</Link>}</div>
            <div className="space-y-3">{level.tasks.map((task) => <button key={task.id} disabled={task.status === "Locked"} onClick={() => { setActiveTask(task); setSubmissionUrl(task.submissionUrl || ""); }} className="flex w-full items-center gap-4 rounded-xl border border-border/70 bg-background/40 p-4 text-left transition hover:border-primary/40 disabled:cursor-not-allowed">
              <span className="text-muted-foreground">{task.status === "Completed" ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : task.status === "Locked" ? <Lock className="h-4 w-4" /> : task.type === "Project" ? <Rocket className="h-5 w-5 text-primary" /> : task.type === "Lesson" ? <BookOpen className="h-5 w-5 text-primary" /> : <Code2 className="h-5 w-5 text-primary" />}</span>
              <span className="min-w-0 flex-1"><span className="block font-medium">{task.title}</span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{task.description}</span></span><span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide">{task.status}</span>
            </button>)}</div>
          </section>;
        })}
      </div>

      {activeTask && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveTask(null); }}><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">{activeTask.type} · +{activeTask.xpReward} XP</p><h2 className="mt-1 text-xl font-bold">{activeTask.title}</h2></div><button onClick={() => setActiveTask(null)} className="text-sm text-muted-foreground">Close</button></div>
        <p className="text-sm leading-6 text-muted-foreground">{activeTask.description}</p>
        <div className="mt-5"><p className="mb-2 text-sm font-semibold">Done means:</p><ul className="space-y-1 text-sm text-muted-foreground">{activeTask.acceptanceCriteria.map((criterion) => <li key={criterion} className="flex gap-2"><Circle className="mt-1 h-3 w-3 shrink-0" />{criterion}</li>)}</ul></div>
        {activeTask.status === "Completed" ? <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"><p className="flex items-center gap-2 font-semibold text-emerald-500"><Trophy className="h-4 w-4" /> Verified work</p><p className="mt-1 text-sm text-muted-foreground">Ownership interview score: {activeTask.defenseScore}%</p></div> : activeTask.status === "DefensePending" ? <form onSubmit={(event) => { event.preventDefault(); defend.mutate(); }} className="mt-6 space-y-4"><div className="rounded-xl border border-primary/30 bg-primary/10 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-primary">AI ownership interview</p><p className="mt-2 text-sm font-medium">{activeTask.defenseQuestion}</p></div><textarea required minLength={40} rows={6} value={defenseAnswer} onChange={(event) => setDefenseAnswer(event.target.value)} placeholder="Explain your reasoning, tradeoffs, and how you verified the result..." className="w-full rounded-xl border border-input-border bg-input px-4 py-3 text-sm outline-none focus:border-primary" /><button disabled={defend.isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50">{defend.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Submit interview answer</button></form> : <form onSubmit={(event: FormEvent) => { event.preventDefault(); submit.mutate(); }} className="mt-6 space-y-4"><input type="url" value={submissionUrl} onChange={(event) => setSubmissionUrl(event.target.value)} placeholder="Repository or live demo URL (optional)" className="w-full rounded-xl border border-input-border bg-input px-4 py-3 text-sm outline-none focus:border-primary" /><textarea required minLength={20} rows={5} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Describe what you built, your decisions, testing, and anything that was difficult..." className="w-full rounded-xl border border-input-border bg-input px-4 py-3 text-sm outline-none focus:border-primary" /><button disabled={submit.isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50">{submit.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Submit for AI review</button></form>}
      </div></div>}
    </div>
  );
}
