"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  User,
  Settings,
  Shield,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useUserInfo } from "@/shared/hook/useUserInfo";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/interviewDetails", label: "My Interviews", icon: Briefcase },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/setting", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useUserInfo();
  const [loggingOut, setLoggingOut] = useState(false);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth");
      router.refresh();
    } catch (e) {
      toast.error("Failed to log out");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-card/60 backdrop-blur sticky top-0 h-screen">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-border/50">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/20">
            AI
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">AI Interview Coach</p>
            <p className="text-[11px] text-muted-foreground">Candidate Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive(href, exact)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              <span>{label}</span>
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive("/admin")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Shield className="w-[18px] h-[18px]" />
              <span>Admin Panel</span>
            </Link>
          )}

          <div className="!mt-6 pt-4 border-t border-border/40">
            <Link
              href="/interview/setup"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-3.5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>New Interview</span>
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
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
              <p className="text-[11px] text-muted-foreground truncate">@{user?.userName}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign out"
              className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 h-14 border-b border-border/60 bg-background/80 backdrop-blur px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
              AI
            </div>
            <span className="font-bold text-sm">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/interview/setup"
              className="p-2 rounded-lg bg-primary/10 text-primary"
              title="New interview"
            >
              <Sparkles className="w-4 h-4" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-muted-foreground hover:text-red-500"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}