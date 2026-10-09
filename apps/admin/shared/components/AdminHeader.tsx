"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Shield,
  RefreshCw,
  LogOut,
  Menu,
  Activity,
  Sparkles,
} from "lucide-react";
import {
  useUserInfo,
  clearCachedAccessToken,
  cn,
} from "@repo/shared";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: "Command Center Overview",
    subtitle: "High-level metrics, real-time activity stream, and executive platform telemetry.",
  },
  interviews: {
    title: "Live Interviews & Sessions",
    subtitle: "Inspect candidate recordings, session status transitions, and duration metrics.",
  },
  users: {
    title: "Users & Access Control",
    subtitle: "Manage candidate and admin accounts, activate or suspend accounts, and view roles.",
  },
  ai: {
    title: "AI Inference Telemetry",
    subtitle: "Monitor token consumption, token cost tracking, and model response latency.",
  },
  violations: {
    title: "Integrity & Proctoring Alerts",
    subtitle: "Audit cheating detection triggers, background audio anomalies, and face track events.",
  },
  reports: {
    title: "Candidate Evaluations",
    subtitle: "Inspect generated candidate scorecards, skill proficiency ratings, and improvement plans.",
  },
  skills: {
    title: "Skills & Taxonomy Catalog",
    subtitle: "Manage technical skill categories, active catalog state, and interview taxonomy.",
  },
};

function AdminHeaderContent({ onOpenMobileMenu }: AdminHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "overview";
  const { data: user } = useUserInfo();
  const queryClient = useQueryClient();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const tabInfo = TAB_TITLES[activeTab] || {
    title: "Admin Command Center",
    subtitle: "Administrative console and telemetry dashboard for NexWolf AI Interview platform.",
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin"] }),
        queryClient.invalidateQueries({ queryKey: ["skills"] }),
      ]);
      toast.success("Dashboard metrics refreshed");
    } catch {
      toast.error("Failed to refresh metrics");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearCachedAccessToken();
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Sign out failed");
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="border-b border-border/60 bg-card/50 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        {/* Left Side: Mobile Menu Button + Title & Breadcrumbs */}
        <div className="flex items-start gap-3 min-w-0">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden mt-0.5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {tabInfo.title}
              </h1>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  {user?.role || "ADMIN"}
                </span>

                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/60 border border-border/50 text-[11px] text-muted-foreground font-medium">
                  <Sparkles className="w-3 h-3 text-primary" />
                  v1.0 Live
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
              {tabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Status Badge, Refresh, and Sign Out */}
        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Live</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border/60 bg-card hover:bg-muted text-foreground transition-all cursor-pointer shadow-xs disabled:opacity-60"
            title="Refresh dashboard data"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-primary")} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer disabled:opacity-60"
            title="Sign out of Admin Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function AdminHeaderSkeleton() {
  return (
    <header className="border-b border-border/60 bg-card/50 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="space-y-1.5">
          <div className="h-6 w-56 rounded-lg bg-muted/50 animate-pulse" />
          <div className="h-3.5 w-80 rounded-lg bg-muted/30 animate-pulse" />
        </div>
        <div className="h-9 w-24 rounded-xl bg-muted/40 animate-pulse" />
      </div>
    </header>
  );
}

export function AdminHeader(props: AdminHeaderProps) {
  return (
    <Suspense fallback={<AdminHeaderSkeleton />}>
      <AdminHeaderContent {...props} />
    </Suspense>
  );
}
