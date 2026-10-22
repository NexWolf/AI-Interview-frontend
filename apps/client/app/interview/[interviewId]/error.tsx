"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, RotateCcw, Home, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface InterviewErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function InterviewErrorBoundary({
  error,
  reset,
}: InterviewErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log error for client observability
    console.error("[Interview Error Boundary Caught]:", error);
  }, [error]);

  const rawMsg = error?.message || "";
  const isNetworkOr101Error =
    rawMsg.toLowerCase().includes("101") ||
    rawMsg.toLowerCase().includes("network") ||
    rawMsg.toLowerCase().includes("websocket") ||
    rawMsg.toLowerCase().includes("failed to fetch") ||
    rawMsg.toLowerCase().includes("connection");

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/70 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div
          className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isNetworkOr101Error ? "bg-amber-500" : "bg-destructive"
          }`}
        />

        {/* Icon Badge */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg border ${
            isNetworkOr101Error
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {isNetworkOr101Error ? (
            <WifiOff className="w-8 h-8" />
          ) : (
            <AlertCircle className="w-8 h-8" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {isNetworkOr101Error
            ? "تعذر الاتصال بالخادم"
            : "حدث خطأ غير متوقع"}
        </h1>

        <p className="text-xs text-muted-foreground mt-1 font-mono">
          {isNetworkOr101Error
            ? "Network Error / Non-101 Protocol Handshake Failed"
            : "Application Runtime Error"}
        </p>

        {/* Description */}
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          {isNetworkOr101Error
            ? "تعذر تأسيس اتصال مباشر ومستقر مع خادم المقابلة (WebSocket Handshake). يرجى التأكد من تشغيل الخادم واتصالك بالإنترنت، ثم إعادة المحاولة."
            : "واجه النظام خطأ أثناء تشغيل جلسة المقابلة. يمكنك محاولة إعادة تحميل الجلسة أو العودة للوحة التحكم."}
        </p>

        {/* Actions */}
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
            <span>إعادة المحاولة (Try Again)</span>
          </Button>

          <Button asChild variant="outline" className="flex-1 h-10 gap-2">
            <Link href="/dashboard">
              <Home className="w-4 h-4" />
              <span>لوحة التحكم</span>
            </Link>
          </Button>
        </div>

        {/* Technical Details Toggle */}
        <div className="w-full mt-6 pt-4 border-t border-border/50">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
          >
            <span>تفاصيل الخطأ التقنية (Technical Details)</span>
            {showDetails ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showDetails && (
            <div className="mt-2 p-3 bg-muted/40 border border-border/60 rounded-xl text-left text-xs font-mono text-muted-foreground break-all max-h-32 overflow-y-auto">
              <p className="text-red-400 font-semibold mb-1">
                {rawMsg || "Unknown Error"}
              </p>
              {error?.digest && (
                <p className="text-[10px] text-muted-foreground/70">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
