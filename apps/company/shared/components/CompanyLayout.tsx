"use client";

import { useState } from "react";
import { Building2, Sparkles, X } from "lucide-react";
import { CompanySidebarNav } from "./CompanySidebarNav";
import { CompanyHeader } from "./CompanyHeader";

export function CompanyLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-40 bg-card/60 backdrop-blur-xl border-r border-border/50">
        {/* Brand Header */}
        <div className="flex items-center gap-3 h-16 px-6 border-b border-border/50">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">NexWolf Business</h1>
            <p className="text-[10px] text-muted-foreground font-mono">Enterprise Hiring</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-3 px-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
            Workspace
          </div>
          <CompanySidebarNav />
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/50">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">API Connection Active</p>
            <p className="text-[11px]">Ready for ATS webhook sync</p>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden animate-in fade-in-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 h-full bg-card border-r border-border p-6 space-y-6 animate-in slide-in-from-left-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-foreground">NexWolf Business</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CompanySidebarNav onItemClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <CompanyHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
