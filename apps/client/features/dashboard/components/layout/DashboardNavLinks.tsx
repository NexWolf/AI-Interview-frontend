"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { DASHBOARD_NAV_ITEMS } from "../../constants/navigation.constants";

interface DashboardNavLinksProps {
  onLinkClick?: () => void;
}

export default function DashboardNavLinks({ onLinkClick }: DashboardNavLinksProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {DASHBOARD_NAV_ITEMS.map(({ href, labelKey, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={onLinkClick}
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

      <div className="!mt-6 pt-4 border-t border-border/40">
        <Link
          href="/interview/setup"
          onClick={onLinkClick}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-3.5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>{t("dashboard.nav.newInterview")}</span>
        </Link>
      </div>
    </>
  );
}
