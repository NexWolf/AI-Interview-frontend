"use client";

import DashboardBrand from "./DashboardBrand";
import DashboardNavLinks from "./DashboardNavLinks";
import LanguageToggleButton from "./LanguageToggleButton";
import ThemeToggleButton from "./ThemeToggleButton";
import DashboardUserCard from "./DashboardUserCard";
import { cn } from "@/shared/lib/utils";

interface DashboardSidebarProps {
  className?: string;
}

export default function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden md:flex w-64 shrink-0 flex-col border-r rtl:border-r-0 rtl:border-l border-border/60 bg-card/60 backdrop-blur sticky top-0 h-screen",
        className,
      )}
    >
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <DashboardBrand />
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <DashboardNavLinks />
      </nav>

      {/* Sidebar Theme & Language controls */}
      <div className="px-3 py-2.5 border-t border-border/50 flex items-center justify-between gap-2">
        <LanguageToggleButton className="flex-1" />
        <ThemeToggleButton />
      </div>

      {/* User profile card */}
      <DashboardUserCard showLogout />
    </aside>
  );
}
