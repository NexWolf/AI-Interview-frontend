"use client";

import { useEffect, useState } from "react";
import { AdminUser } from "@repo/shared";
import { getUserDisplayName } from "../utils/userHelpers";

interface AddInterviewsModalProps {
  user: AdminUser | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

export function AddInterviewsModal({ user, isPending, onClose, onSubmit }: AddInterviewsModalProps) {
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    if (user) setAmount(1);
  }, [user]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
      <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-xl space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Add Interviews</h3>
        <p className="text-xs text-muted-foreground">
          {getUserDisplayName(user)} has used {user._count?.interviews || 0} of {user.interviewLimit} interviews.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Interviews to add</label>
            <input
              type="number"
              required
              min={1}
              max={100}
              step={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Add Interviews"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
