import React, { useState } from 'react';
import { ShieldAlert, Clock, PhoneOff, Loader2 } from 'lucide-react';

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <>
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
            onClick={() => setShowConfirmModal(true)}
            disabled={isFinishing}
            title="End Interview Call"
            className="group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-xs shadow-md shadow-red-600/30 hover:shadow-red-600/40 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFinishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="hidden sm:inline">Finishing...</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-12">
                  <PhoneOff className="w-3 h-3 text-white" />
                </div>
                <span className="hidden sm:inline">End Call</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Custom Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300 p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-card border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <PhoneOff className="w-6 h-6 text-red-500" />
              </div>
              <div className="pt-1">
                <h2 className="text-lg font-bold text-foreground">إنهاء المقابلة</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  هل أنت متأكد من أنك تريد إنهاء المقابلة الآن؟ سيتم تحويلك مباشرة لصفحة التقرير لعرض نتيجتك.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground bg-muted hover:bg-muted/80 transition-colors"
              >
                تراجع
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handleFinishInterview();
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md shadow-red-600/20"
              >
                نعم، إنهاء المقابلة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
