"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle2, XCircle } from "lucide-react";

interface ReportStrengthsWeaknessesProps {
  strengths?: string | null;
  weaknesses?: string | null;
}

export const ReportStrengthsWeaknesses: React.FC<ReportStrengthsWeaknessesProps> = ({
  strengths,
  weaknesses,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Strengths Card */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-3">
        <h2 className="font-bold text-sm text-emerald-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Strengths
        </h2>
        <div className="text-sm leading-relaxed text-foreground/90">
          {strengths ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="my-1.5">{children}</p>,
                ul: ({ children }) => (
                  <ul className="my-1.5 space-y-1.5 pl-4 list-disc marker:text-emerald-500">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-1.5 space-y-1.5 pl-4 list-decimal marker:text-emerald-500">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="pl-1">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
              }}
            >
              {strengths}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground text-xs italic">
              No strengths recorded.
            </p>
          )}
        </div>
      </div>

      {/* Areas for Improvement / Weaknesses Card */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-3">
        <h2 className="font-bold text-sm text-rose-400 flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          Areas for Improvement
        </h2>
        <div className="text-sm leading-relaxed text-foreground/90">
          {weaknesses ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="my-1.5">{children}</p>,
                ul: ({ children }) => (
                  <ul className="my-1.5 space-y-1.5 pl-4 list-disc marker:text-rose-400">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-1.5 space-y-1.5 pl-4 list-decimal marker:text-rose-400">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="pl-1">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
              }}
            >
              {weaknesses}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground text-xs italic">
              No areas recorded.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportStrengthsWeaknesses;
