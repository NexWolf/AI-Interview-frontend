"use client";

import { useState } from "react";
import {
  Search,
  UserPlus,
  Shield,
  ShieldAlert,
  Power,
  Trash2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Briefcase,
  CreditCard,
  Loader2,
} from "lucide-react";
import { AdminUser } from "@/shared/types/admin";
import {
  useAdminUsers,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
} from "@/shared/hook/useAdmin";
import { AdminPagination } from "./AdminPagination";
import { cn } from "@/shared/lib/utils";

export function AdminUsersTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [newUserForm, setNewUserForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    role: "USER" as "USER" | "ADMIN" | "SUPER_ADMIN",
  });

  const { data, isLoading } = useAdminUsers({
    page,
    limit,
    search: search.trim() || undefined,
    role: roleFilter !== "ALL" ? roleFilter : undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter === "ACTIVE" ? "true" : "false",
  });

  const users: AdminUser[] = data?.users || [];
  const pagination = data?.pagination;

  const updateStatusMutation = useUpdateUserStatusMutation();
  const deleteUserMutation = useDeleteUserMutation();
  const createUserMutation = useCreateUserMutation();

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleToggleStatus = (user: AdminUser) => {
    updateStatusMutation.mutate({ id: user.id, isActive: !user.isActive });
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    deleteUserMutation.mutate(id);
    setConfirmDeleteId(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(newUserForm, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewUserForm({
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          role: "USER",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Action and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by name, username, or email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background/80 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User (Candidate)</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-background/80 border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Accounts</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Suspended</option>
          </select>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
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
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0 text-xs">
                          {user.firstName?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-1.5">
                            <span>{user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.email}</span>
                            {user.isVerified && (
                              <span title="Verified">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">@{user.userName || user.email.split("@")[0]} · {user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-md text-[11px] font-semibold border",
                          user.role === "SUPER_ADMIN"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : user.role === "ADMIN"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-muted text-muted-foreground border-border/50",
                        )}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5",
                          user.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border border-rose-500/20",
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
                          onClick={() => handleToggleStatus(user)}
                          disabled={updateStatusMutation.isPending}
                          className={cn(
                            "p-2 rounded-xl transition-colors cursor-pointer",
                            user.isActive
                              ? "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                              : "text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10",
                          )}
                          title={user.isActive ? "Suspend account" : "Activate account"}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteUserMutation.isPending}
                          className={cn(
                            "p-2 rounded-xl transition-colors cursor-pointer",
                            confirmDeleteId === user.id
                              ? "bg-rose-500 text-white animate-pulse"
                              : "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10",
                          )}
                          title={confirmDeleteId === user.id ? "Click again to confirm delete" : "Delete user"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <AdminPagination
          pagination={pagination}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          itemLabel="users"
        />
      </div>

      {/* Create User Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Create User Account</h3>
            <p className="text-xs text-muted-foreground">
              Add a new candidate or administrator directly to the system.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">First Name</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.firstName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, firstName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.lastName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, lastName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Username</label>
                <input
                  type="text"
                  required
                  value={newUserForm.userName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, userName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Role</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground cursor-pointer"
                >
                  <option value="USER">User (Candidate)</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {createUserMutation.isPending ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
