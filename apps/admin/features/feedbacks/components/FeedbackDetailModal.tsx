"use client";

import { X, MessageSquare, Star, User, Briefcase, Calendar, Trash2 } from "lucide-react";
import { AdminFeedback } from "@repo/shared";

interface FeedbackDetailModalProps {
  feedback: AdminFeedback | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string | number) => void;
}

export function FeedbackDetailModal({
  feedback,
  isOpen,
  onClose,
  onDelete,
}: FeedbackDetailModalProps) {
  if (!isOpen || !feedback) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
      <div className="w-full max-w-lg bg-card border border-border/80 rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Candidate Feedback Details</h3>
              <p className="text-xs text-muted-foreground">ID #{feedback.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating & Category */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= feedback.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
            <span className="text-sm font-bold text-foreground ml-2">
              {feedback.rating} / 5
            </span>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {feedback.category.replace("_", " ")}
          </span>
        </div>

        {/* User & Interview Info */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-border/50 bg-background/50 space-y-1">
            <p className="text-muted-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Candidate
            </p>
            <p className="font-semibold text-foreground">
              {feedback.user
                ? `${feedback.user.firstName || ""} ${feedback.user.lastName || ""}`.trim() || feedback.user.userName
                : "Candidate"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">{feedback.user?.email || "—"}</p>
          </div>

          <div className="p-3 rounded-xl border border-border/50 bg-background/50 space-y-1">
            <p className="text-muted-foreground flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Interview
            </p>
            <p className="font-semibold text-foreground">Interview #{feedback.interviewId}</p>
            <p className="text-[11px] text-muted-foreground">
              {feedback.interview?.difficultyLevel || "Assessment"} &bull; {feedback.interview?.interviewLanguage || "En"}
            </p>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-3">
          {feedback.commentEn && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">English Comment</label>
              <div className="p-3 rounded-xl bg-background border border-border/60 text-sm text-foreground">
                {feedback.commentEn}
              </div>
            </div>
          )}

          {feedback.commentAr && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground text-right block">
                التعليق بالعربية
              </label>
              <div
                dir="rtl"
                className="p-3 rounded-xl bg-background border border-border/60 text-sm text-foreground font-sans"
              >
                {feedback.commentAr}
              </div>
            </div>
          )}

          {!feedback.commentEn && !feedback.commentAr && (
            <p className="text-xs text-muted-foreground italic text-center py-2">
              No written comments provided with this rating.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Submitted {new Date(feedback.createdAt).toLocaleString()}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDelete(feedback.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Feedback
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
