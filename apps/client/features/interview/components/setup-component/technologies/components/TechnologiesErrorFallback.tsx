"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { AppButton } from "@/shared/components/ui/AppButton";

export interface TechnologiesErrorFallbackProps {
  isAr: boolean;
  onRetry: () => void;
}

export const TechnologiesErrorFallback: React.FC<TechnologiesErrorFallbackProps> = ({
  isAr,
  onRetry,
}) => {
  return (
    <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
      <div className="flex items-center gap-2 text-destructive text-sm font-semibold">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>
          {isAr
            ? "تعذر تحميل قائمة المهارات من الخادم."
            : "Unable to load technologies from the server."}
        </span>
      </div>
      <AppButton
        variant="outline"
        size="sm"
        onClick={onRetry}
        icon={<RefreshCw className="w-3.5 h-3.5" />}
        iconPosition="start"
      >
        {isAr ? "إعادة المحاولة" : "Retry Loading"}
      </AppButton>
    </div>
  );
};

export default TechnologiesErrorFallback;
