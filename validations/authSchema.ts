import z from "zod";

/* extraction schema data for use hook form */
export type signinInput = z.infer<typeof SigninSchema>
export type signupInput = z.infer<typeof SignupSchema>


export const SignupSchema = z.object({
  firstname : z.string().min(3 , "must be at least 3 characters"),
  lastname : z.string().min(3, "must be at least 3 characters"),
  username : z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, underscores, and dots are allowed")
    .transform((val) => val.toLowerCase().trim()),
  email : z.string()
    .min(1, "Email is required") 
    .email("Invalid email address")
    .transform((val) => val.toLowerCase().trim()),
    password : z.string().min(6 , "password must be at least 6 characters")
})

export const SigninSchema = z.object({
    email : z.string()
    .min(1, "Email is required") 
    .email("Invalid email address")
    .transform((val) => val.toLowerCase().trim()),
    password : z.string().min(6 , "password must be at least 6 characters")
})