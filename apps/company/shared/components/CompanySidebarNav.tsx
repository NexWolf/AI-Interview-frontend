"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  KeyRound,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@repo/shared";

interface CompanySidebarNavProps {
  onItemClick?: () => void;
}

function CompanySidebarNavContent({ onItemClick }: CompanySidebarNavProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "overview";

  const navItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Hiring analytics & overview",
    },
    {
      id: "candidates",
      label: "Candidates",
      icon: Users,
      description: "Candidate pipeline & tests",
    },
    {
      id: "assessments",
      label: "Assessments",
      icon: Briefcase,
      description: "Interviews & score reports",
    },
    {
      id: "integrations",
      label: "API & Integrations",
      icon: KeyRound,
      description: "API keys & ATS connection",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Company profile & team",
    },
  ];

  return (
    <div className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const href = `?tab=${item.id}`;

        return (
          <Link
            key={item.id}
            href={href}
            onClick={onItemClick}
            className={cn(
              "group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer",
              isActive
                ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110",
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                )}
              />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function CompanySidebarNav(props: CompanySidebarNavProps) {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse bg-muted/40 rounded-xl" />}>
      <CompanySidebarNavContent {...props} />
    </Suspense>
  );
}
