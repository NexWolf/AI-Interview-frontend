"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Building2, X, Activity } from "lucide-react";
import { CompanySidebarNav } from "./CompanySidebarNav";
import { CompanyHeader } from "./CompanyHeader";
import { useLanguage } from "../context/LanguageContext";
import { useCompanyProfile } from "@repo/shared";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

export function CompanyLayout({ children }: CompanyLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isArabic } = useLanguage();
  const { data: profile } = useCompanyProfile(pathname !== "/login");

  const companyName = profile?.company?.name || "Company";
  const initials = (companyName.slice(0, 2) || "CO").toUpperCase();

  if (pathname === "/login") {
    return <main className="min-h-screen bg-background text-foreground">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row w-full transition-colors duration-200">
      {/* =========================================================================
          1. Desktop Sidebar (Sticky H-Screen - Exactly like Admin)
      ========================================================================= */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-e border-border/60 bg-card/60 backdrop-blur sticky top-0 h-screen z-30 transition-colors duration-200">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center font-bold text-primary-foreground shadow-md shadow-primary/25 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                NexWolf
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                  {isArabic ? "شركات" : "Business"}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground font-medium">
                {isArabic ? "لوحة التوظيف" : "Hiring Console"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {isArabic ? "نشط" : "Live"}
          </div>
        </div>

        {/* Sidebar Nav Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-primary" />
              <span>{isArabic ? "مساحة العمل" : "Employer Console"}</span>
            </div>
            <CompanySidebarNav />
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-border/50 shrink-0 bg-card/40">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-muted/30 border border-border/40">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 text-primary flex items-center justify-center font-bold text-xs shrink-0 uppercase">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">{companyName}</div>
              <div className="text-[10px] text-muted-foreground truncate">
                {isArabic ? "بوابة التوظيف" : "Recruiter Portal"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          2. Mobile Drawer (Sheet)
      ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] bg-card border-e border-border h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-start duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-border/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold">
                  {isArabic ? "لوحة الشركة" : "Company Navigation"}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <CompanySidebarNav onItemClick={() => setMobileMenuOpen(false)} />
            </div>

            <div className="p-4 border-t border-border/50">
              <div className="text-[11px] text-muted-foreground text-center">
                NexWolf Business • Employer Command Center
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. Shared Header & Main Content Area
      ========================================================================= */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <CompanyHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
