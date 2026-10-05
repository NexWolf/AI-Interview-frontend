import React from 'react';
import { Loader2 } from 'lucide-react';

interface LiveReportOverlayProps {
  isFinishing: boolean;
  liveConnected: boolean;
  reportLiveText: string;
}

export const LiveReportOverlay: React.FC<LiveReportOverlayProps> = ({
  isFinishing,
  liveConnected,
  reportLiveText,
}) => {
  if (!isFinishing) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-card-foreground">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <div>
              <h3 className="text-sm font-bold text-card-foreground">Generating your AI report</h3>
              <p className="text-xs text-muted-foreground">Sara is analyzing your answers live...</p>
            </div>
          </div>
          {liveConnected && (
            <span className="flex items-center gap-1.5 text-green-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Live streaming
            </span>
          )}
        </div>
        <div className="p-5 max-h-[50vh] overflow-y-auto bg-muted/80">
          {reportLiveText ? (
            <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed">{reportLiveText}</pre>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
