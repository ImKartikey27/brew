import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  owner: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "To Do" | "In Progress" | "Done";
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    dueDate: {
      type: Date
    },
  },
  { timestamps: true }
);

// Compound index covers all query patterns
taskSchema.index({ owner: 1, status: 1, priority: 1 });

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;