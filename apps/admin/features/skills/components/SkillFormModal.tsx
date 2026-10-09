"use client";

import { SkillFormState } from "../types/skills.types";

interface SkillFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  form: SkillFormState;
  busy: boolean;
  onChange: (form: SkillFormState) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function SkillFormModal({
  isOpen,
  isEditing,
  form,
  busy,
  onChange,
  onClose,
  onSubmit,
}: SkillFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
      <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-xl space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {isEditing ? "Edit Skill" : "Create New Skill"}
        </h3>

        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Skill Name (English)</label>
            <input
              type="text"
              placeholder="e.g. Node.js, React, Docker, Python"
              value={form.nameEn}
              onChange={(e) => onChange({ ...form, nameEn: e.target.value })}
              className="w-full mt-1.5 px-3.5 py-2.5 text-sm bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              autoFocus
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
              type="button"
              disabled={busy}
              onClick={onSubmit}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {busy ? "Saving..." : isEditing ? "Update Skill" : "Create Skill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
