import { CreateUserFormState, UserFilterOption } from "../types/users.types";

export const USER_ROLE_FILTER_OPTIONS: UserFilterOption[] = [
  { label: "All Roles", value: "ALL" },
  { label: "User (Candidate)", value: "USER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

export const USER_STATUS_FILTER_OPTIONS: UserFilterOption[] = [
  { label: "All Accounts", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "INACTIVE" },
];

export const USER_ROLE_CREATE_OPTIONS: { label: string; value: CreateUserFormState["role"] }[] = [
  { label: "User (Candidate)", value: "USER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

export const EMPTY_CREATE_USER_FORM: CreateUserFormState = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  role: "USER",
};
