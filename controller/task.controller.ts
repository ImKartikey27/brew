import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import Task from "../models/task.model";
import mongoose from "mongoose";

interface taskBody {
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    status?: "To Do" | "In Progress" | "Done";
    dueDate: Date;
}

interface taskfilters {
    owner: mongoose.Types.ObjectId;
    priority?: "low" | "medium" | "high";
    status?: "To Do" | "In Progress" | "Done";
}

interface updateTaskBody {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    status?: "To Do" | "In Progress" | "Done";
    dueDate?: Date;
}

interface taskParams {
    id: string;
}

export const createTask = asyncHandler(
    async (req: Request<{}, {}, taskBody>, res: Response) => {
        const user = req.user;
        if (!user) {
            const error = new Error("Unauthorized") as any;
            error.status = 401;
            throw error;
        }

        const task = await Task.create({
            owner: user._id,
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            status: req.body.status,
            dueDate: req.body.dueDate,
        });
        res.status(201).json({
            status: "success",
            message: "Task created successfully",
            data: { task },
        });
    }
);

export const displayTasksBasedOnFilter = asyncHandler(
    async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) {
            const error = new Error("Unauthorized") as any;
            error.status = 401;
            throw error;
        }

        const filter: taskfilters = {
            owner: user._id,
        };

        if (req.query.priority) {
            filter.priority = req.query.priority as "low" | "medium" | "high";
        }
        if (req.query.status) {
            filter.status = req.query.status as "To Do" | "In Progress" | "Done";
        }

        const tasks = await Task.find(filter);

        res.status(200).json({
            status: "success",
            data: {
                count: tasks.length,
                tasks,
            },
        });
    }
);

export const editTask = asyncHandler(
    async (
        req: Request,
        res: Response
    ) => {
        const user = req.user;
        if (!user) {
            const error = new Error("Unauthorized") as any;
            error.status = 401;
            throw error;
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            const error = new Error("Task not found") as any;
            error.status = 404;
            throw error;
        }
        if (task.owner.toString() !== user._id.toString()) {
            const error = new Error("Forbidden: You don't own this task") as any;
            error.status = 403;
            throw error;
        }

        if (req.body.title !== undefined) task.title = req.body.title;
        if (req.body.description !== undefined)
            task.description = req.body.description;
        if (req.body.priority !== undefined) task.priority = req.body.priority;
        if (req.body.status !== undefined) task.status = req.body.status;
        if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;

        await task.save();

        res.status(200).json({
            status: "success",
            message: "Task updated successfully",
            data: { task },
        });
    }
);

export const deleteTask = asyncHandler(async(
    req: Request,
    res: Response
    ) => {
        const user = req.user;
        if (!user) {
            const error = new Error("Unauthorized") as any;
            error.status = 401;
            throw error;
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            const error = new Error("Task not found") as any;
            error.status = 404;
            throw error;
        }
        if (task.owner.toString() !== user._id.toString()) {
            const error = new Error("Forbidden: You don't own this task") as any;
            error.status = 403;
            throw error;
        }

        await task.deleteOne();

        res.status(200).json({
            status: "success",
            message: "Task deleted successfully",
        });
    })

