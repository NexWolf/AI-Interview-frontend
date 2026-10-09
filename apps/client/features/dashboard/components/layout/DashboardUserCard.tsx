"use client";

import { LogOut } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import { useLogout } from "../../hooks/useLogout";
import { cn } from "@/shared/lib/utils";

interface DashboardUserCardProps {
  className?: string;
  showLogout?: boolean;
  onLogoutSuccess?: () => void;
}

export default function DashboardUserCard({
  className,
  showLogout = true,
  onLogoutSuccess,
}: DashboardUserCardProps) {
  const { t } = useLanguage();
  const { data: user } = useUserInfo();
  const { handleLogout, loggingOut } = useLogout(onLogoutSuccess);

  return (
    <div className={cn("p-3 border-t border-border/50", className)}>
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold overflow-hidden shrink-0">
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user?.firstName || "Avatar"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="uppercase">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            @{user?.userName}
          </p>
        </div>
        {showLogout && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            title={t("dashboard.nav.logout")}
            aria-label={t("dashboard.nav.logout")}
            className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
