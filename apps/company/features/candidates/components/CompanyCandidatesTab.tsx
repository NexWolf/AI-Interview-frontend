"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Mail,
  Phone,
  Briefcase,
  Play,
} from "lucide-react";
import { toast } from "sonner";

export function CompanyCandidatesTab() {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mock initial candidate roster for visualization
  const candidates = [
    {
      id: "cand-1",
      externalId: "APP-9941",
      name: "Kareem Hamad",
      email: "kareem.hamad@example.com",
      phone: "+966 50 123 4567",
      targetRole: "Senior React Engineer",
      interviewStatus: "Completed",
      score: "92%",
      invitationUrl: "http://localhost:3000/interview/1045",
      appliedAt: "2026-10-04",
    },
    {
      id: "cand-2",
      externalId: "APP-9942",
      name: "Sara Al-Khatib",
      email: "sara.khatib@example.com",
      phone: "+966 55 987 6543",
      targetRole: "Node.js Backend Developer",
      interviewStatus: "Completed",
      score: "88%",
      invitationUrl: "http://localhost:3000/interview/1046",
      appliedAt: "2026-10-05",
    },
    {
      id: "cand-3",
      externalId: "APP-9943",
      name: "Omar Nabil",
      email: "omar.nabil@example.com",
      phone: "+971 50 456 7890",
      targetRole: "Full Stack Engineer",
      interviewStatus: "Invitation Sent",
      score: "Pending",
      invitationUrl: "http://localhost:3000/interview/1047",
      appliedAt: "2026-10-06",
    },
  ];

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Interview invitation link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.externalId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidate by name, email, or ATS ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>

        <button
          onClick={() => toast.info("Opening candidate registration flow...")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Candidates List */}
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/50 text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Candidate Details</th>
                <th className="py-3 px-4">ATS External ID</th>
                <th className="py-3 px-4">Role / Skill Track</th>
                <th className="py-3 px-4">Interview Status</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredCandidates.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground text-sm">{c.name}</p>
                      <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {c.email}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {c.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                    <span className="px-2 py-0.5 rounded-md bg-muted border border-border/60 text-[11px]">
                      {c.externalId}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-foreground font-medium">
                    {c.targetRole}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        c.interviewStatus === "Completed"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}
                    >
                      {c.interviewStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-sm font-bold text-foreground">
                      {c.score}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCopyLink(c.invitationUrl, c.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-border hover:bg-muted text-foreground transition-all cursor-pointer"
                        title="Copy direct candidate interview link"
                      >
                        {copiedId === c.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span>{copiedId === c.id ? "Copied" : "Copy Link"}</span>
                      </button>

                      <a
                        href={c.invitationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                        title="Open Candidate Room"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
