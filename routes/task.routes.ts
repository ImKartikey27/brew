import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import { 
    createTask, 
    displayTasksBasedOnFilter, 
    editTask, 
    deleteTask, 
    searchTasks
} from "../controller/task.controller"
import { createTaskSchema, updateTaskSchema } from "../validation/task.validation"


const router = Router()


router.get("/search", authMiddleware, searchTasks)
router.post("/create", authMiddleware, validate(createTaskSchema), createTask)
router.get("/get", authMiddleware, displayTasksBasedOnFilter)
router.patch("/:id", authMiddleware, validate(updateTaskSchema), editTask)
router.delete("/:id", authMiddleware, deleteTask)



export default router