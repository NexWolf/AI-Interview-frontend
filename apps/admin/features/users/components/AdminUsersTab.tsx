"use client";

import { useState } from "react";
import {
  AdminUser,
  useAdminUsers,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
  useDebounce,
  DeleteConfirmModal,
} from "@repo/shared";
import { EMPTY_CREATE_USER_FORM } from "../constants/users.constants";
import { CreateUserFormState, UserToDelete } from "../types/users.types";
import { getUserDisplayName } from "../utils/userHelpers";
import { UsersToolbar } from "./UsersToolbar";
import { UsersTable } from "./UsersTable";
import { CreateUserModal } from "./CreateUserModal";

export function AdminUsersTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserToDelete | null>(null);
  const [newUserForm, setNewUserForm] = useState<CreateUserFormState>(EMPTY_CREATE_USER_FORM);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useAdminUsers({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
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

  const handleRequestDelete = (user: AdminUser) => {
    setUserToDelete({
      id: user.id,
      email: user.email,
      name: getUserDisplayName(user),
    });
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        setUserToDelete(null);
      },
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(newUserForm, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewUserForm(EMPTY_CREATE_USER_FORM);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar: Search, Filters, Add User */}
      <UsersToolbar
        search={search}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* Users Table */}
      <UsersTable
        users={users}
        isLoading={isLoading}
        pagination={pagination}
        page={page}
        limit={limit}
        isUpdatingStatus={updateStatusMutation.isPending}
        isDeleting={deleteUserMutation.isPending}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleRequestDelete}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateOpen}
        form={newUserForm}
        isPending={createUserMutation.isPending}
        onChange={setNewUserForm}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* Delete User Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete User Account"
        itemType="user account"
        itemName={userToDelete ? (userToDelete.name ? `${userToDelete.name} (${userToDelete.email})` : userToDelete.email) : undefined}
        description="Are you sure you want to deactivate this user account? The user will be logged out and unable to sign in, while their interview results and records will remain preserved."
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
}
