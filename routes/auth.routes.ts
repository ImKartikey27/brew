import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import {loginSchema, registerSchema} from "../validation/auth.validation"
import {login, logout, refresh, register} from "../controller/auth.controller"

const router = Router()

router.post("/login", validate(loginSchema), login)
router.post("/register", validate(registerSchema), register)
router.post("/refresh", refresh)
router.post("/logout", authMiddleware, logout)


export default router