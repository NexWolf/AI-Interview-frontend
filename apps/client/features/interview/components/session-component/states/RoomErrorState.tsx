import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface RoomErrorStateProps {
  errorMessage?: string;
  onRetry: () => void;
}

export const RoomErrorState: React.FC<RoomErrorStateProps> = ({
  errorMessage,
  onRetry,
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-4 shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-destructive">
        تعذر تحميل جلسة المقابلة
      </h2>
      <p className="text-xs text-muted-foreground mt-1.5 max-w-md">
        {errorMessage || "حدث خطأ غير متوقع أثناء محاولة جلب بيانات المقابلة."}
      </p>
      <button
        onClick={onRetry}
        className="mt-5 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>إعادة المحاولة (Try Again)</span>
      </button>
    </div>
  );
};
