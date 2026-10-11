"use client";

import { useLanguage } from "../context/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();
  const isArabic = language === "ar";

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl 
                 bg-card/70 hover:bg-muted text-foreground border border-border/60 
                 hover:border-primary/40 active:scale-95 text-xs font-semibold 
                 transition-all duration-200 cursor-pointer shadow-sm ${className}`}
      title={isArabic ? "Switch to English" : "التحويل إلى اللغة العربية"}
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-primary" />
      <span className="font-medium tracking-wide">
        {isArabic ? "English" : "العربية"}
      </span>
    </button>
  );
}
