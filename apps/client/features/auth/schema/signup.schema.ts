import z from "zod";

export const SignupSchema = z
  .object({
    firstname: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),
    lastname: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, underscores, and dots are allowed")
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address")
      .transform((val) => val.toLowerCase().trim()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* extraction schema data for use hook form */
export type signupInput = z.infer<typeof SignupSchema>;



