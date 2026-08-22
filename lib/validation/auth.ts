import z from "zod";


export const forgetPasswordSchema = z.object({
    email : z.string().min(1 , {message : "Email is required"}).email({message : "Invalid email address"})
})


export const confirmPasswordSchema = z.object({
    password : z.string().min(6 , "password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // يحدد مكان ظهور الخطأ في الـ UI
      });

      export type ConfirmPasswordInput = z.infer<typeof confirmPasswordSchema>
      export type ForgotPasswordInput = z.infer<typeof forgetPasswordSchema>;
