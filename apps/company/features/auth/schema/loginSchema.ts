import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Work email is required")
    .email("Please enter a valid business email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
