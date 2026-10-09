"use client";

import { CreateUserFormState } from "../types/users.types";
import { USER_ROLE_CREATE_OPTIONS } from "../constants/users.constants";

interface CreateUserModalProps {
  isOpen: boolean;
  form: CreateUserFormState;
  isPending: boolean;
  onChange: (form: CreateUserFormState) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateUserModal({
  isOpen,
  form,
  isPending,
  onChange,
  onClose,
  onSubmit,
}: CreateUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
      <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-xl space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Create User Account</h3>
        <p className="text-xs text-muted-foreground">
          Add a new candidate or administrator directly to the system.
        </p>

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">First Name</label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => onChange({ ...form, firstName: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Last Name</label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => onChange({ ...form, lastName: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Username</label>
            <input
              type="text"
              required
              value={form.userName}
              onChange={(e) => onChange({ ...form, userName: e.target.value })}
              className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => onChange({ ...form, email: e.target.value })}
              className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Role</label>
            <select
              value={form.role}
              onChange={(e) => onChange({ ...form, role: e.target.value as CreateUserFormState["role"] })}
              className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground cursor-pointer"
            >
              {USER_ROLE_CREATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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
              {isPending ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
