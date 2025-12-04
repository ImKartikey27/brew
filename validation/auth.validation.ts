import * as z from "zod"; 

const loginSchema = z.object({
    email: z.email("Enter Valid email"),
    password: z.string("Enter Valid Password").min(6).max(20)
})

const registerSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6).max(20),

})

export {
    loginSchema,
    registerSchema
}