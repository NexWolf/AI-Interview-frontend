"use client";

import { FolderGit2 } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";

export function ProjectEmptyState() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 rounded-xl border border-dashed border-border/80 bg-muted/10 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground">
        <FolderGit2 className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {isAr ? "لم تتم إضافة أي مشاريع بعد" : "No projects added yet"}
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          {isAr
            ? "أضف مشاريعك البرمجية أو اربط مستودع GitHub لتقييم كودك وإجراء مقابلات الذكاء الاصطناعي عليها."
            : "Add your software projects or link a GitHub repo to review your code and run AI interviews."}
        </p>
      </div>
    </div>
  );
}
