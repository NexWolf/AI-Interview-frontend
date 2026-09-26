"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { learningService } from "./learning.service";

export default function CommunityPage() {
  const params = useSearchParams();
  const level = Math.max(1, Number(params.get("level")) || 1);
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const key = ["community-messages", level];
  const { data: messages = [], isLoading, isError } = useQuery({ queryKey: key, queryFn: () => learningService.messages(level), refetchInterval: 5000 });
  const post = useMutation({
    mutationFn: () => learningService.postMessage(level, body),
    onSuccess: (message) => { queryClient.setQueryData(key, [...messages, message]); setBody(""); },
  });
  const handleSubmit = (event: FormEvent) => { event.preventDefault(); if (body.trim()) post.mutate(); };

  return <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/70">
    <header className="flex items-center gap-4 border-b border-border p-5"><Link href="/dashboard/learn" className="rounded-lg p-2 hover:bg-muted"><ArrowLeft className="h-4 w-4" /></Link><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><MessageCircle className="h-5 w-5" /></div><div><h1 className="font-bold">Level {level} community</h1><p className="text-xs text-muted-foreground">Students on the same specialization and level</p></div></header>
    <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">
      {isLoading && <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
      {isError && <p className="py-16 text-center text-sm text-muted-foreground">This community unlocks when you reach its level.</p>}
      {!isLoading && !isError && messages.length === 0 && <div className="py-16 text-center"><MessageCircle className="mx-auto h-9 w-9 text-muted-foreground/50" /><p className="mt-3 text-sm text-muted-foreground">Be the first to start a useful conversation.</p></div>}
      {messages.map((message) => <article key={message.id} className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-bold text-primary">
          {message.user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={message.user.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : message.user.firstName[0]}
        </div>
        <div className="min-w-0 rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3"><div className="flex items-baseline gap-2"><p className="text-xs font-semibold">{message.user.firstName} {message.user.lastName}</p><p className="text-[10px] text-muted-foreground">@{message.user.userName}</p></div><p className="mt-1 whitespace-pre-wrap text-sm leading-5">{message.body}</p></div>
      </article>)}
    </div>
    {!isError && <form onSubmit={handleSubmit} className="flex gap-3 border-t border-border p-4"><input value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} placeholder="Ask a question or share what you learned..." className="min-w-0 flex-1 rounded-xl border border-input-border bg-input px-4 py-3 text-sm outline-none focus:border-primary" /><button disabled={!body.trim() || post.isPending} className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50" aria-label="Send message">{post.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</button></form>}
  </div>;
}
