"use client";

import { Loader2 } from "lucide-react";
import { AdminUser } from "@repo/shared";
import { AdminPagination } from "@/shared";
import { UserTableRow } from "./UserTableRow";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  pagination?: PaginationInfo;
  page: number;
  limit: number;
  isUpdatingStatus: boolean;
  isDeleting: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onToggleStatus: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function UsersTable({
  users,
  isLoading,
  pagination,
  page,
  limit,
  isUpdatingStatus,
  isDeleting,
  onPageChange,
  onLimitChange,
  onToggleStatus,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
            <tr>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Interviews Taken</th>
              <th className="px-5 py-3.5">Registered</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-muted-foreground text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span>Loading users directory...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isUpdatingStatus={isUpdatingStatus}
                  isDeleting={isDeleting}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        pagination={pagination}
        page={page}
        limit={limit}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        itemLabel="users"
      />
    </div>
  );
}
