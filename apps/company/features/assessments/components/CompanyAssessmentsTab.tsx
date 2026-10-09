"use client";

import { useState } from "react";
import {
  Briefcase,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Award,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export function CompanyAssessmentsTab() {
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const assessments = [
    {
      id: "1045",
      candidateName: "Kareem Hamad",
      role: "Senior React Engineer",
      difficulty: "Advanced",
      duration: "45 mins",
      completedAt: "2026-10-06 14:30",
      overallScore: 92,
      technicalScore: 94,
      communicationScore: 90,
      problemSolvingScore: 91,
      strengths: "Deep mastery of React 19 Concurrent mode, server components, and performance profiling.",
      weaknesses: "Could elaborate more on unit testing complex custom hooks.",
      recommendation: "Strong Hire",
    },
    {
      id: "1046",
      candidateName: "Sara Al-Khatib",
      role: "Node.js Backend Developer",
      difficulty: "Intermediate",
      duration: "40 mins",
      completedAt: "2026-10-05 11:15",
      overallScore: 88,
      technicalScore: 90,
      communicationScore: 85,
      problemSolvingScore: 89,
      strengths: "Solid understanding of event loop, Prisma ORM, and async pipeline architecture.",
      weaknesses: "Slight hesitation on database partitioning and sharding questions.",
      recommendation: "Hire",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Assessment Reports</h3>
          <p className="text-xs text-muted-foreground">Detailed AI evaluations, grading, and recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assessments.map((a) => (
          <div
            key={a.id}
            className="p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md hover:border-border transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-muted-foreground">Assessment #{a.id}</span>
                <h4 className="text-sm font-bold text-foreground">{a.candidateName}</h4>
                <p className="text-xs text-muted-foreground">{a.role} &bull; {a.difficulty}</p>
              </div>

              <div className="text-right">
                <span className="text-xl font-extrabold text-foreground">{a.overallScore}%</span>
                <p className="text-[10px] font-semibold text-emerald-500 uppercase">{a.recommendation}</p>
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-background/50 border border-border/40 text-center">
              <div>
                <p className="text-[10px] text-muted-foreground">Technical</p>
                <p className="text-xs font-bold text-foreground mt-0.5">{a.technicalScore}%</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Communication</p>
                <p className="text-xs font-bold text-foreground mt-0.5">{a.communicationScore}%</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Problem Solving</p>
                <p className="text-xs font-bold text-foreground mt-0.5">{a.problemSolvingScore}%</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="text-muted-foreground line-clamp-2">
                <strong className="text-foreground">Highlights:</strong> {a.strengths}
              </p>
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {a.completedAt}
              </span>

              <button
                onClick={() => setSelectedReport(a)}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer"
              >
                <span>View Full AI Report</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for full report view */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedReport.candidateName}</h3>
                <p className="text-xs text-muted-foreground">{selectedReport.role} &bull; Full Assessment Breakdown</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-primary">Verdict & Recommendation</p>
                <p className="text-lg font-bold text-foreground">{selectedReport.recommendation}</p>
              </div>
              <div className="text-2xl font-black text-foreground">{selectedReport.overallScore}%</div>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-foreground">Key Strengths</h5>
              <p className="text-muted-foreground bg-muted/40 p-3 rounded-xl">{selectedReport.strengths}</p>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-foreground">Areas for Growth</h5>
              <p className="text-muted-foreground bg-muted/40 p-3 rounded-xl">{selectedReport.weaknesses}</p>
            </div>

            <div className="pt-3 border-t border-border/50 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
