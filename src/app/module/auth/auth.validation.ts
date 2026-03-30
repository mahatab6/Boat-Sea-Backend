import { z } from "zod";

export const loginZodSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string()
        .min(1, "Password is required")
        .min(2, "Password must be at least 8 chareacters log")
})


export const registerZodSchema = z.object({
    name : z.string("User name is required"),
    email : z.string("Enter your email"),
    password : z.string().min(1, "Password is required").min(8, "Password must be at least 8 chareacters log"),
    role : z.string().optional()
})


export type IRegisterPayload = z.infer<typeof registerZodSchema>

export type ILoginPayload = z.infer<typeof loginZodSchema>


