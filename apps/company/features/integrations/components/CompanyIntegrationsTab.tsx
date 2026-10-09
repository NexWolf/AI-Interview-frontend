"use client";

import { useState } from "react";
import {
  KeyRound,
  Copy,
  Check,
  Code2,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export function CompanyIntegrationsTab() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState<string | null>(null);

  const rawMockKey = "sk_live_acmecorp_4f89d31a89b012e84c9101";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(rawMockKey);
    setCopiedKey(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCurl(id);
    toast.success("Snippet copied to clipboard");
    setTimeout(() => setCopiedCurl(null), 2000);
  };

  const createInterviewSnippet = `curl -X POST https://api.nexwolf.com/api/v1/integrations/interviews \\
  -H "Authorization: Bearer ${rawMockKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "candidateId": "UUID_OF_CANDIDATE",
    "difficultyLevel": "Intermediate",
    "duration": 45,
    "skillIds": [1, 2],
    "interviewLanguage": "English"
  }'`;

  const getResultSnippet = `curl -X GET https://api.nexwolf.com/api/v1/integrations/interviews/1045/result \\
  -H "Authorization: Bearer ${rawMockKey}"`;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* API Key Box */}
      <div className="p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Live Integration API Key</h3>
              <p className="text-xs text-muted-foreground">Keep this key secret. Use in the Authorization header.</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="password"
            value={rawMockKey}
            readOnly
            className="w-full px-4 py-2.5 text-xs font-mono bg-background border border-border rounded-xl focus:outline-none text-foreground select-all"
          />
          <button
            onClick={handleCopyKey}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shrink-0 cursor-pointer shadow-sm"
          >
            {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedKey ? "Copied" : "Copy Key"}
          </button>
        </div>
      </div>

      {/* Developer Documentation Cheat Sheet */}
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-bold text-foreground">B2B Integration Quickstart</h3>
          <p className="text-xs text-muted-foreground">Connect candidate application webhooks and fetch reports</p>
        </div>

        {/* Endpoint 1 */}
        <div className="p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                POST
              </span>
              <span className="font-semibold text-foreground">/api/v1/integrations/interviews</span>
            </div>
            <button
              onClick={() => copySnippet(createInterviewSnippet, "create-interview")}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              {copiedCurl === "create-interview" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              Copy cURL
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Creates an AI interview room for a candidate and returns the unique invitation URL (`invitationUrl`).
          </p>

          <pre className="p-3.5 rounded-xl bg-background border border-border/50 text-[11px] font-mono text-muted-foreground overflow-x-auto leading-relaxed">
            {createInterviewSnippet}
          </pre>
        </div>

        {/* Endpoint 2 */}
        <div className="p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20">
                GET
              </span>
              <span className="font-semibold text-foreground">/api/v1/integrations/interviews/:id/result</span>
            </div>
            <button
              onClick={() => copySnippet(getResultSnippet, "get-result")}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              {copiedCurl === "get-result" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              Copy cURL
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Fetches complete scores, strengths, weaknesses, and recommendation report after candidate finishes the interview.
          </p>

          <pre className="p-3.5 rounded-xl bg-background border border-border/50 text-[11px] font-mono text-muted-foreground overflow-x-auto leading-relaxed">
            {getResultSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
