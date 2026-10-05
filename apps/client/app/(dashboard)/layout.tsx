"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  User,
  Settings,
  Shield,
  LogOut,
  Plus,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/shared/context/LanguageContext";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import { clearCachedAccessToken } from "@/shared/lib/AxiosAPI";

function ThemeToggleButton({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("w-9 h-9 rounded-xl bg-muted/40 border border-border/50", className)} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-xl border border-border/70 bg-card/80 text-foreground hover:bg-muted/80 transition-all cursor-pointer shadow-sm active:scale-95",
        className
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-500 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}

function LanguageToggleButton({ className }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("h-9 px-3 rounded-xl bg-muted/40 border border-border/50", className)} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={cn(
        "flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl border border-border/70 bg-card/80 text-xs font-semibold text-foreground hover:bg-muted/80 transition-all cursor-pointer shadow-sm active:scale-95",
        className
      )}
      title={language === "en" ? "التبديل إلى العربية" : "Switch to English"}
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-primary" />
      <span>{language === "en" ? "العربية" : "English"}</span>
    </button>
  );
}

const navItems = [
  { href: "/dashboard", labelKey: "dashboard.nav.dashboard" as const, icon: LayoutDashboard, exact: true },
  { href: "/dashboard/interviewDetails", labelKey: "dashboard.nav.myInterviews" as const, icon: Briefcase },
  { href: "/dashboard/profile", labelKey: "dashboard.nav.profile" as const, icon: User },
  { href: "/dashboard/setting", labelKey: "dashboard.nav.settings" as const, icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { data: user } = useUserInfo();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearCachedAccessToken();
      setMobileMenuOpen(false);
      router.push("/auth");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    } finally {
      setLoggingOut(false);
    }
  };

  const nav = (
    <>
      {navItems.map(({ href, labelKey, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
            isActive(href, exact)
              ? "bg-primary/10 text-primary font-semibold"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          <Icon className="w-[18px] h-[18px]" />
          <span>{t(labelKey)}</span>
        </Link>
      ))}

      {isAdmin && (
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
            isActive("/admin")
              ? "bg-primary/10 text-primary font-semibold"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          <Shield className="w-[18px] h-[18px]" />
          <span>{t("dashboard.nav.admin")}</span>
        </Link>
      )}

      <div className="!mt-6 pt-4 border-t border-border/40">
        <Link
          href="/interview/setup"
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-3.5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>{t("dashboard.nav.newInterview")}</span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r rtl:border-r-0 rtl:border-l border-border/60 bg-card/60 backdrop-blur sticky top-0 h-screen">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-border/50">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/20">
            AI
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm leading-tight truncate">{t("dashboard.brand")}</p>
            <p className="text-[11px] text-muted-foreground truncate">{t("dashboard.nav.candidate")}</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">{nav}</nav>

        {/* Sidebar Theme & Language controls */}
        <div className="px-3 py-2.5 border-t border-border/50 flex items-center justify-between gap-2">
          <LanguageToggleButton className="flex-1" />
          <ThemeToggleButton />
        </div>

        {/* User profile card */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="uppercase">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">@{user?.userName}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title={t("dashboard.nav.logout")}
              className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Desktop top header bar */}
        <header className="hidden md:flex sticky top-0 z-30 h-16 border-b border-border/50 bg-background/80 backdrop-blur px-8 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("dashboard.nav.candidate")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggleButton />
            <ThemeToggleButton />
          </div>
        </header>

        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 h-14 border-b border-border/60 bg-background/80 backdrop-blur px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer"
              title="Open menu"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
              AI
            </div>
            <span className="font-bold text-sm truncate max-w-[120px] sm:max-w-none">
              {t("dashboard.nav.dashboard")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggleButton className="h-8 px-2.5 text-[11px]" />
            <ThemeToggleButton className="w-8 h-8" />
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-muted-foreground hover:text-red-500"
              title={t("dashboard.nav.logout")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 w-72 max-w-[80vw] bg-card border-r rtl:border-r-0 rtl:border-l border-border flex flex-col shadow-2xl">
              <div className="h-16 flex items-center justify-between px-5 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/20">
                    AI
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">{t("dashboard.brand")}</p>
                    <p className="text-[11px] text-muted-foreground">{t("dashboard.nav.candidate")}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">{nav}</nav>

              <div className="px-3 py-2.5 border-t border-border/50 flex items-center justify-between gap-2">
                <LanguageToggleButton className="flex-1" />
                <ThemeToggleButton />
              </div>

              <div className="p-3 border-t border-border/50">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold overflow-hidden shrink-0">
                    {user?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="uppercase">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">@{user?.userName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}