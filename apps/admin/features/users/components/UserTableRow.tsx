"use client";

import { CheckCircle2, Briefcase, Power, Trash2 } from "lucide-react";
import { AdminUser, cn } from "@repo/shared";
import {
  getUserRoleBadgeClass,
  getUserStatusBadgeClass,
  getUserDisplayName,
  getUserInitials,
  getUserHandle,
} from "../utils/userHelpers";

interface UserTableRowProps {
  user: AdminUser;
  isUpdatingStatus: boolean;
  isDeleting: boolean;
  onToggleStatus: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function UserTableRow({
  user,
  isUpdatingStatus,
  isDeleting,
  onToggleStatus,
  onDelete,
}: UserTableRowProps) {
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const handle = getUserHandle(user);

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0 text-xs">
            {initials}
          </div>
          <div>
            <div className="font-medium text-foreground flex items-center gap-1.5">
              <span>{displayName}</span>
              {user.isVerified && (
                <span title="Verified">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {handle} · {user.email}
            </div>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-md text-[11px] font-semibold border",
            getUserRoleBadgeClass(user.role),
          )}
        >
          {user.role}
        </span>
      </td>

      <td className="px-5 py-4">
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5",
            getUserStatusBadgeClass(user.isActive),
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {user.isActive ? "Active" : "Suspended"}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-semibold text-foreground">{user._count?.interviews || 0}</span> sessions
        </div>
      </td>

      <td className="px-5 py-4 text-xs text-muted-foreground">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>

      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onToggleStatus(user)}
            disabled={isUpdatingStatus}
            className={cn(
              "p-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50",
              user.isActive
                ? "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                : "text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10",
            )}
            title={user.isActive ? "Suspend account" : "Activate account"}
          >
            <Power className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(user)}
            disabled={isDeleting}
            className="p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
