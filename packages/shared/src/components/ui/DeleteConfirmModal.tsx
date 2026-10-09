"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: React.ReactNode;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning";
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description,
  itemName,
  itemType = "item",
  confirmText = "Delete Permanently",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}: DeleteConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-200 animate-in fade-in"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Card */}
      <div
        className={cn(
          "relative w-full max-w-md rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-7 shadow-2xl backdrop-blur-xl",
          "transition-all duration-200 animate-in zoom-in-95 fade-in z-10"
        )}
      >
        {/* Close Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icon Badge */}
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform shadow-inner",
              variant === "danger"
                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-rose-500/10"
                : "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-amber-500/10"
            )}
          >
            {variant === "danger" ? (
              <Trash2 className="w-6 h-6 animate-in zoom-in-50" />
            ) : (
              <AlertTriangle className="w-6 h-6 animate-in zoom-in-50" />
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </h3>

          {/* Description */}
          <div className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-sm">
            {description ? (
              description
            ) : (
              <>
                Are you sure you want to delete this {itemType}? This action cannot be undone.
              </>
            )}
          </div>

          {/* Item Name Badge (if provided) */}
          {itemName && (
            <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-muted/60 border border-border/60 text-xs font-semibold text-foreground max-w-full truncate font-mono">
              {itemName}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 w-full mt-6">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-border bg-background hover:bg-muted/70 text-foreground transition-all cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50",
                variant === "danger"
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                  : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
