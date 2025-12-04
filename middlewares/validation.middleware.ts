import {Request, Response, NextFunction} from "express"
import { ZodSchema } from "zod"

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction)=> {
        try {
            const validatedData = schema.parse(req.body)
            req.body = validatedData
            next()
        } catch (error) {
            next(error)
            
        }
    }
}
