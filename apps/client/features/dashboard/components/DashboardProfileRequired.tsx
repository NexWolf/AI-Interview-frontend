"use client";

import Link from "next/link";
import { AlertTriangle, Sparkles } from "lucide-react";
import type { DashboardProfileRequiredProps } from "../types/dashboard.types";

export default function DashboardProfileRequired({ isAr }: DashboardProfileRequiredProps) {
  return (
    <div className="max-w-md mx-auto my-20 rounded-2xl border border-border bg-card/60 p-8 text-center shadow-sm">
      <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
      <h2 className="text-lg font-bold">
        {isAr ? "يلزم إعداد الملف الشخصي" : "Profile setup required"}
      </h2>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        {isAr
          ? "أكمل إعداد ملفك الشخصي لتفعيل لوحة التحكم، ومتابعة المهارات، وتقارير المقابلات."
          : "Complete your profile setup to unlock your dashboard, skills tracking and interview reports."}
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/onboarding"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          {isAr ? "إكمال إعداد الملف الشخصي" : "Complete Profile Setup"}
        </Link>
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center justify-center gap-2 border border-border px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          {isAr ? "عرض ملفي الشخصي" : "View My Profile"}
        </Link>
      </div>
    </div>
  );
}
