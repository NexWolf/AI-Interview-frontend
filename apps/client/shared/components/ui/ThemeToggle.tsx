"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // التأكد من أن المكون يعمل على العميل فقط لمنع مشاكل الـ Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // حماية من ظهور خطأ التزامن أثناء التحميل الأولي
  if (!mounted) {
    return (
      <div className="w-[110px] h-[30px] rounded-lg bg-card border border-card-border animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg 
                 bg-card text-foreground border border-card-border text-xs font-semibold 
                 hover:border-primary/50 hover:bg-muted/50 
                 active:scale-95 transition-all duration-200"
      aria-label="Toggle Theme"
    >
      {/* مؤشر نقطي ملون يعكس الوضع الحالي */}
      <span
        className={`h-2 w-2 rounded-full transition-colors duration-300 ${
          isDark
            ? "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]"
            : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
        }`}
      />

      {/* النص الذي يتغير بناءً على الثيم */}
      <span className="tracking-wide uppercase">
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
}