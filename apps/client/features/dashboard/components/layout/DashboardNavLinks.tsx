"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    </>
  );
}
