"use client";

import { Briefcase, ExternalLink } from "lucide-react";
import { AdminInterview, cn } from "@repo/shared";

interface RecentInterviewsFeedProps {
  interviews: AdminInterview[];
  onSelectTab: (tab: string) => void;
  onViewInterview: (id: string | number) => void;
}

export function RecentInterviewsFeed({
  interviews,
  onSelectTab,
  onViewInterview,
}: RecentInterviewsFeedProps) {
  return (
    <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Recent Candidate Interviews
          </h3>
          <p className="text-xs text-muted-foreground">Latest interview sessions and performance scores</p>
        </div>
        <button
          onClick={() => onSelectTab("interviews")}
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
        >
          View all ({interviews.length})
        </button>
      </div>

      <div className="divide-y divide-border/40">
        {interviews.slice(0, 5).map((interview) => {
          const score = interview.reports?.[0]?.overallScore;
          return (
            <div
              key={interview.id}
              onClick={() => onViewInterview(interview.id)}
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-muted/40 px-3 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0 text-sm">
                  {interview.user.firstName?.[0] || interview.user.email[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground truncate">
                      {interview.user.firstName
                        ? `${interview.user.firstName} ${interview.user.lastName || ""}`
                        : interview.user.email}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase",
                        interview.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : interview.status === "Running"
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse"
                          : "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                      )}
                    >
                      {interview.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span>{interview.difficultyLevel}</span>
                    <span>•</span>
                    <span>{interview.interviewLanguage}</span>
                    <span>•</span>
                    <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {score !== undefined && score !== null ? (
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground font-medium">Score</div>
                    <div
                      className={cn(
                        "text-sm font-bold",
                        score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500",
                      )}
                    >
                      {score}%
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">In progress</span>
                )}
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
