import express from "express"
import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import {loginSchema, registerSchema} from "../validation/auth.validation"
import {login} from "../controller/auth.controller"

const router = Router()

router.post("/login", validate(loginSchema), login)


export default router