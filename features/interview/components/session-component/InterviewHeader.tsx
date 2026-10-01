import React from 'react';
import { ShieldAlert, Clock } from 'lucide-react';

interface InterviewHeaderProps {
  RoomData: any;
  liveConnected: boolean;
  warningCount: number;
  formattedTime: string;
  isFinishing: boolean;
  handleFinishInterview: () => void;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  RoomData,
  liveConnected,
  warningCount,
  formattedTime,
  isFinishing,
  handleFinishInterview,
}) => {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/20">
          AI
        </div>
        <div>
          <h1 className="font-bold text-sm flex items-center gap-2">
            AI Technical Interview
            <span className="text-muted-foreground font-mono text-xs hidden sm:inline">
              #{RoomData?.id}
            </span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {RoomData?.status || "Running"}
            </span>
            {liveConnected && (
              <span className="flex items-center gap-1 text-green-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Live
              </span>
            )}
            <span>• Level: {RoomData?.difficultyLevel}</span>
            <span>• Language: {RoomData?.interviewLanguage}</span>
          </div>
        </div>
      </div>

      {/* Timer & Controls */}
      <div className="flex items-center gap-3">
        {warningCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{warningCount} Warnings</span>
          </div>
        )}

        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border border-border shadow-inner">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm">
            {formattedTime}
          </span>
        </div>

        <button
          onClick={handleFinishInterview}
          disabled={isFinishing}
          className="px-3.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 active:scale-95 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
        >
          {isFinishing ? "Finishing..." : "End Interview"}
        </button>
      </div>
    </header>
  );
};
