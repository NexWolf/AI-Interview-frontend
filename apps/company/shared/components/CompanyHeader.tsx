"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  RefreshCw,
  LogOut,
  Menu,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  clearCachedAccessToken,
  ThemeToggle,
  cn,
} from "@repo/shared";
import { toast } from "sonner";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "../context/LanguageContext";

interface CompanyHeaderProps {
  onOpenMobileMenu?: () => void;
}

export function CompanyHeader({ onOpenMobileMenu }: CompanyHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isArabic } = useLanguage();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getPageInfo = () => {
    if (pathname.startsWith("/candidates")) {
      return {
        title: isArabic ? "قائمة المرشحين والمتقدمين" : "Candidate Pipeline & Roster",
        subtitle: isArabic
          ? "إدارة ملفات المرشحين، تتبع معرّفات ATS، وتوليد دعوات المقابلات الذكية."
          : "Inspect candidate profiles, track ATS identifiers, and issue AI interview invitations.",
      };
    }
    if (pathname.startsWith("/assessments")) {
      return {
        title: isArabic ? "تقارير التقييم والنتائج" : "Evaluations & Scorecards",
        subtitle: isArabic
          ? "مراجعة تقييمات الذكاء الاصطناعي، وتحليل نقاط القوة والضعف للمرشحين."
          : "Audit candidate responses, AI strengths/weaknesses ratings, and hiring recommendations.",
      };
    }
    if (pathname.startsWith("/integrations")) {
      return {
        title: isArabic ? "الربط البرمجي ومفاتيح API" : "API & ATS Integrations",
        subtitle: isArabic
          ? "ربط منصة NexWolf مباشرة مع أنظمة التوظيف ATS وتوليد مفاتيح الربط البرمجي."
          : "Connect NexWolf AI directly into your recruitment pipeline, Greenhouse, Lever, or custom backend.",
      };
    }
    if (pathname.startsWith("/settings")) {
      return {
        title: isArabic ? "إعدادات مساحة العمل" : "Workspace & Organization Settings",
        subtitle: isArabic
          ? "إدارة ملف الشركة، وتفضيلات المظهر، وروابط استقبال إشعارات الـ Webhooks."
          : "Manage company profile, contact details, display preferences, and webhook notifications.",
      };
    }
    return {
      title: isArabic ? "مركز قيادة التوظيف" : "Employer Command Center",
      subtitle: isArabic
        ? "مؤشرات أداء التوظيف، ونشاط المقابلات المكتملة، وإحصائيات التقييم الشاملة."
        : "High-level candidate metrics, automated assessment pipeline, and hiring telemetry.",
    };
  };

  const pageInfo = getPageInfo();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      router.refresh();
      toast.success(isArabic ? "تم تحديث بيانات اللوحة بنجاح" : "Dashboard metrics refreshed");
    } catch {
      toast.error(isArabic ? "تعذر تحديث البيانات" : "Failed to refresh metrics");
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
      toast.success(isArabic ? "تم تسجيل الخروج بنجاح" : "Signed out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error(isArabic ? "فشل تسجيل الخروج" : "Sign out failed");
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="border-b border-border/60 bg-card/50 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        {/* Left Side: Mobile Menu Button + Title & Badges */}
        <div className="flex items-start gap-3 min-w-0">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden mt-0.5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {pageInfo.title}
              </h1>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  COMPANY
                </span>

                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/60 border border-border/50 text-[11px] text-muted-foreground font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  v1.0 Live
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Status Badge, Controls, Refresh, and Sign Out */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">
          {/* Live Telemetry Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isArabic ? "مزامنة حية" : "Live Sync"}</span>
          </div>

          {/* Language Switcher */}
          <LanguageToggle />

          {/* Shared Theme Switcher */}
          <ThemeToggle />

          {/* Candidate Room Link */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border/60 bg-card hover:bg-muted text-foreground transition-all"
            title={isArabic ? "غرفة المرشح للاختبار" : "Candidate Assessment Room"}
          >
            <span>{isArabic ? "غرفة المرشح" : "Candidate Room"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border/60 bg-card hover:bg-muted text-foreground transition-all cursor-pointer shadow-xs disabled:opacity-60"
            title={isArabic ? "تحديث بيانات الداشبورد" : "Refresh dashboard data"}
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-primary")} />
            <span className="hidden sm:inline">{isArabic ? "تحديث" : "Refresh"}</span>
          </button>

          {/* Logout Button (matching Admin style) */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-rose-500/20 bg-rose-500/5 text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer disabled:opacity-60"
            title="Sign out of Employer Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isLoggingOut
                ? (isArabic ? "جاري الخروج..." : "Signing out...")
                : (isArabic ? "تسجيل الخروج" : "Sign Out")}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
