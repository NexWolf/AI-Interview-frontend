export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface CreateUserFormState {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: UserRole;
}

export interface UserToDelete {
  id: string;
  email: string;
  name?: string;
}

export interface UserFilterOption {
  label: string;
  value: string;
}
