import * as z from "zod"; 

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(20)
})

const registerSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6).max(20),
    
})