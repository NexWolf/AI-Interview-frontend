import React from "react";
import { Loader2 } from "lucide-react";

export const RoomLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-3 p-4">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        جاري تحميل غرفة المقابلة والاتصال بـ AI Interviewer...
      </p>
    </div>
  );
};
