"use client";

import {
  Users,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  KeyRound,
  Plus,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface CompanyOverviewTabProps {
  onNavigateTab: (tab: string) => void;
}

export function CompanyOverviewTab({ onNavigateTab }: CompanyOverviewTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 via-card/40 to-primary/10 backdrop-blur-xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Technical Assessments
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            Welcome to your Hiring Command Center
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Invite candidates to realistic AI voice interviews, review automated scoring reports, and streamline technical screening with zero human scheduling overhead.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab("candidates")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Invite New Candidate
            </button>
            <button
              onClick={() => onNavigateTab("integrations")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-background/80 border border-border/60 hover:bg-muted text-foreground transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              View API Credentials
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Candidates</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">24</p>
          <p className="text-[11px] text-emerald-500 font-medium">+8 invited this month</p>
        </div>

        <div className="p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Completed Interviews</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">19</p>
          <p className="text-[11px] text-muted-foreground font-medium">79% completion rate</p>
        </div>

        <div className="p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Average Score</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">84%</p>
          <p className="text-[11px] text-muted-foreground font-medium">Benchmark across skills</p>
        </div>

        <div className="p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">API Integration</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">Connected</p>
          <p className="text-[11px] text-emerald-500 font-medium">Live webhook sync</p>
        </div>
      </div>

      {/* Quick Access Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidates Pipeline Summary */}
        <div className="p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Candidate Pipeline</h3>
            <button
              onClick={() => onNavigateTab("candidates")}
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { name: "Kareem Hamad", role: "Frontend Engineer (React)", score: "92%", status: "Passed", date: "Today" },
              { name: "Sara Al-Khatib", role: "Backend Developer (Node.js)", score: "88%", status: "Passed", date: "Yesterday" },
              { name: "Omar Nabil", role: "Full Stack Engineer", score: "—", status: "Pending Interview", date: "3 days ago" },
            ].map((c, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-border/40 bg-background/50 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.role} &bull; {c.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-foreground">{c.score}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      c.status === "Passed"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Fast Start */}
        <div className="p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">API Automation (ATS)</h3>
            <button
              onClick={() => onNavigateTab("integrations")}
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              Developer Docs
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Connect your Greenhouse, Lever, or custom HR system to trigger interview invitations automatically when candidates apply.
          </p>

          <div className="p-3.5 rounded-xl bg-background border border-border/60 font-mono text-xs text-muted-foreground overflow-x-auto space-y-1">
            <p className="text-primary font-semibold"># Invite candidate via API</p>
            <p>POST /api/v1/integrations/interviews</p>
            <p className="text-[11px] text-muted-foreground/80">Header: Authorization: Bearer sk_live_...</p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab("integrations")}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer"
            >
              Manage API Keys & Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
