"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorBoundary({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Global Error Caught]:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/70 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none bg-destructive" />

        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg border bg-destructive/10 text-destructive border-destructive/20">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          حدث خطأ غير متوقع
        </h1>

        <p className="text-xs text-muted-foreground mt-1 font-mono">
          An unexpected application error occurred
        </p>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          {error?.message ||
            "واجه النظام خطأ أثناء معالجة الطلب. يمكنك المحاولة مجدداً أو العودة للصفحة الرئيسية."}
        </p>

        <div className="w-full flex flex-col sm:flex-row gap-2.5 mt-6">
          <Button
            onClick={() => {
              if (typeof reset === "function") {
                reset();
              } else {
                window.location.reload();
              }
            }}
            className="flex-1 h-10 gap-2 font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </Button>

          <Button asChild variant="outline" className="flex-1 h-10 gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
