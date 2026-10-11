"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  KeyRound,
  Settings,
} from "lucide-react";
import { cn, useCompanyOverview } from "@repo/shared";
import { useLanguage } from "../context/LanguageContext";

interface CompanySidebarNavProps {
  onItemClick?: () => void;
}

export function CompanySidebarNav({ onItemClick }: CompanySidebarNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { data: overview } = useCompanyOverview();

  const navItems = [
    {
      id: "overview",
      href: "/",
      label: t("nav.overview"),
      icon: LayoutDashboard,
      isActive: pathname === "/" || pathname === "/overview",
    },
    {
      id: "candidates",
      href: "/candidates",
      label: t("nav.candidates"),
      icon: Users,
      count: overview?.totalCandidates,
      isActive: pathname.startsWith("/candidates"),
    },
    {
      id: "assessments",
      href: "/assessments",
      label: t("nav.assessments"),
      icon: Briefcase,
      count: overview?.completedInterviews ?? overview?.totalInterviews,
      isActive: pathname.startsWith("/assessments"),
    },
    {
      id: "integrations",
      href: "/integrations",
      label: t("nav.integrations"),
      icon: KeyRound,
      isActive: pathname.startsWith("/integrations"),
    },
    {
      id: "settings",
      href: "/settings",
      label: t("nav.settings"),
      icon: Settings,
      isActive: pathname.startsWith("/settings"),
    },
  ];

  return (
    <div className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer",
              item.isActive
                ? "bg-primary/10 text-primary border border-primary/20 shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  item.isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="truncate">{item.label}</span>
            </div>

            {item.count !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-colors",
                  item.isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-card",
                )}
              >
                {item.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
