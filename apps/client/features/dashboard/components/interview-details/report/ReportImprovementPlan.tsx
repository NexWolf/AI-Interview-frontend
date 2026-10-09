"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface ReportImprovementPlanProps {
  plan: string;
}

export const ReportImprovementPlan: React.FC<ReportImprovementPlanProps> = ({
  plan,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(plan);
      setCopied(true);
      toast.success("Improvement plan copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-card via-card to-amber-500/5 p-6 sm:p-7 space-y-5 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 shadow-inner">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base sm:text-lg tracking-tight text-foreground">
                Personalized Improvement Plan
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
                AI Roadmap
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Actionable recommendations & targeted challenges tailored from your interview answers
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card/80 hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer w-fit self-start sm:self-auto shrink-0 shadow-sm"
          title="Copy plan to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Copy Plan</span>
            </>
          )}
        </button>
      </div>

      <div className="text-sm leading-relaxed text-foreground/90 space-y-3">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <div className="pt-3 pb-1 border-b border-amber-500/20 first:pt-0">
                <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 shrink-0" />
                  {children}
                </h3>
              </div>
            ),
            h2: ({ children }) => (
              <div className="pt-3 pb-1 first:pt-0">
                <h4 className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 rounded-full bg-amber-500 shrink-0" />
                  {children}
                </h4>
              </div>
            ),
            h3: ({ children }) => (
              <h5 className="text-sm font-semibold text-foreground mt-3 mb-1 flex items-center gap-2">
                <span className="w-1 h-2.5 rounded-full bg-amber-500/70 shrink-0" />
                {children}
              </h5>
            ),
            h4: ({ children }) => (
              <h6 className="text-xs sm:text-sm font-semibold text-foreground/90 mt-2 mb-1">
                {children}
              </h6>
            ),
            p: ({ children }) => (
              <p className="text-sm leading-relaxed text-foreground/90 my-2">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="my-2.5 space-y-2 pl-4 list-disc marker:text-amber-500 marker:text-sm text-sm leading-relaxed text-foreground/90">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="my-2.5 space-y-2 pl-4 list-decimal marker:text-amber-500 dark:marker:text-amber-400 marker:font-bold text-sm leading-relaxed text-foreground/90">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">{children}</strong>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-3 rounded-xl border-l-4 border-amber-500 bg-amber-500/10 dark:bg-amber-500/5 px-4 py-3 text-sm italic text-foreground/90">
                {children}
              </blockquote>
            ),
            pre: ({ children }) => (
              <pre className="my-3 rounded-xl bg-muted/80 p-3.5 text-xs font-mono overflow-x-auto border border-border/70 text-foreground [&_code]:bg-transparent [&_code]:p-0 [&_code]:border-none [&_code]:text-foreground">
                {children}
              </pre>
            ),
            code: ({ children, className, ...props }) => (
              <code
                className="px-1.5 py-0.5 text-[12px] font-mono rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium"
                {...props}
              >
                {children}
              </code>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-3 rounded-xl border border-border/70 bg-card/50">
                <table className="w-full text-left text-xs border-collapse">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-muted/60 border-b border-border/70 text-foreground font-semibold">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-border/40">{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-muted/20 transition-colors">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="p-2.5 font-semibold text-foreground">{children}</th>
            ),
            td: ({ children }) => (
              <td className="p-2.5 text-foreground/90">{children}</td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 dark:text-amber-400 underline underline-offset-4 hover:text-amber-500 font-medium transition-colors"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="my-4 border-amber-500/20" />,
          }}
        >
          {plan}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ReportImprovementPlan;
