"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { useLogout } from "../../hooks/useLogout";
import DashboardBrand from "./DashboardBrand";
import DashboardNavLinks from "./DashboardNavLinks";
import LanguageToggleButton from "./LanguageToggleButton";
import ThemeToggleButton from "./ThemeToggleButton";
import DashboardUserCard from "./DashboardUserCard";
import { cn } from "@/shared/lib/utils";

interface DashboardMobileNavProps {
  className?: string;
}

export default function DashboardMobileNav({ className }: DashboardMobileNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { handleLogout, loggingOut } = useLogout(() => setMobileMenuOpen(false));

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <header
        className={cn(
          "md:hidden sticky top-0 z-40 h-14 border-b border-border/60 bg-background/80 backdrop-blur px-4 flex items-center justify-between",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
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
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-2 rounded-lg text-muted-foreground hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
            title={t("dashboard.nav.logout")}
            aria-label={t("dashboard.nav.logout")}
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
            onClick={closeMenu}
          />
          <div className="absolute left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 w-72 max-w-[80vw] bg-card border-r rtl:border-r-0 rtl:border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-left rtl:slide-in-from-right duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-border/50">
              <DashboardBrand onClick={closeMenu} />
              <button
                type="button"
                onClick={closeMenu}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              <DashboardNavLinks onLinkClick={closeMenu} />
            </nav>

            <div className="px-3 py-2.5 border-t border-border/50 flex items-center justify-between gap-2">
              <LanguageToggleButton className="flex-1" />
              <ThemeToggleButton />
            </div>

            <DashboardUserCard showLogout={false} />
          </div>
        </div>
      )}
    </>
  );
}
