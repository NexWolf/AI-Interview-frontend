"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "../../lib/utils";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-9 h-9 rounded-xl bg-card/60 border border-border/50 animate-pulse",
          className,
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex items-center justify-center w-9 h-9 rounded-xl",
        "bg-card/70 hover:bg-muted text-foreground border border-border/60",
        "hover:border-primary/40 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs",
        className,
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 scale-100 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-purple-600 transition-transform rotate-0 scale-100 duration-300" />
      )}
    </button>
  );
}
