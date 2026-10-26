"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/shared/lib/utils";

interface DashboardBrandProps {
  className?: string;
  onClick?: () => void;
}

export default function DashboardBrand({ className, onClick }: DashboardBrandProps) {
  const { t } = useLanguage();

  return (
    <Link
      href="/dashboard"
      onClick={onClick}
      className={cn("flex items-center gap-2.5 group", className)}
    >
      <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-border/60 shadow-md shadow-primary/10 transition-transform group-hover:scale-105 shrink-0">
        <Image
          src="/nexwolf.jpeg"
          alt="NexWolf Logo"
          fill
          className="object-cover"
          sizes="36px"
          priority
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm tracking-wide leading-tight truncate text-foreground group-hover:text-primary transition-colors">
          NEXWOLF
        </p>
        <p className="text-[11px] text-muted-foreground truncate">{t("dashboard.nav.candidate")}</p>
      </div>
    </Link>
  );
}
