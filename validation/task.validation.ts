import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    description: z.string().max(1000, "Description too long").optional(),
    priority: z.enum(["low", "medium", "high"]),
    status: z.enum(["To Do", "In Progress", "Done"]),
    dueDate: z.iso.date().optional()  // ISO date string
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    status: z.enum(["To Do", "In Progress", "Done"]).optional(),
    dueDate: z.iso.date().optional()
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});