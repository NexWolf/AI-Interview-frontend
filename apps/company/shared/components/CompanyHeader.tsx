"use client";

import { Building2, Bell, Menu, ExternalLink } from "lucide-react";

interface CompanyHeaderProps {
  onMenuClick?: () => void;
  companyName?: string;
}

export function CompanyHeader({
  onMenuClick,
  companyName = "Acme Corp",
}: CompanyHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-card/60 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Building2 className="w-4 h-4" />
            <span>{companyName}</span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Enterprise Portal
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/40 transition-all"
        >
          <span>Candidate Room</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary uppercase">
          {companyName.slice(0, 2)}
        </div>
      </div>
    </header>
  );
}
