import z from "zod";



export const SigninSchema = z.object({
    email : z.string()
    .min(1, "Email is required") 
    .email("Invalid email address")
    .transform((val) => val.toLowerCase().trim()),
    password : z.string().min(6 , "password must be at least 6 characters")
})

/* extraction schema data for use hook form */
export type signinInput = z.infer<typeof SigninSchema>
