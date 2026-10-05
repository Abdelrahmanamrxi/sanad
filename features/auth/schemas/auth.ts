import {z} from 'zod'

export const userSchema=z.object({
    email:z.string().email("Please enter a valid email"),
    password:z.string().min(8,"Password must be at least 8 characters long").
    regex(/[a-z]/,"Password must contain a lowercase letter.").
    regex(/[A-Z]/,"Password must contain an uppercase letter.").
    regex(/[0-9]/,"Password must contain a number").
    regex(/[@#$%^&*]/,"Password must contain a special character"),
    confirmPassword:z.string().min(1,"Please confirm your password."),
}).refine(data=>data.password===data.confirmPassword,{
    message:"Passwords do not match",
    path:["confirmPassword"]
})

export type User=z.infer<typeof userSchema>

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(1, "Password is required."),
});

export type SignInInput = z.infer<typeof signInSchema>;