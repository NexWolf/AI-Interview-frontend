"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/shared/lib/utils";

export default function LanguageToggleButton({ className }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 px-3 rounded-xl bg-muted/40 border border-border/50",
          className,
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={cn(
        "flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl border border-border/70 bg-card/80 text-xs font-semibold text-foreground hover:bg-muted/80 transition-all cursor-pointer shadow-sm active:scale-95",
        className,
      )}
      title={language === "en" ? "التبديل إلى العربية" : "Switch to English"}
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-primary" />
      <span>{language === "en" ? "العربية" : "English"}</span>
    </button>
  );
}
