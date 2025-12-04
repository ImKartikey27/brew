import {Request , Response} from "express"
import { asyncHandler } from "../middlewares/asyncHandler"

interface loginBody{
    email: string; 
    password: string;
}

export const login = asyncHandler(async(
    req: Request<{},{},loginBody> ,
    res: Response) => {

        const {email, password} = req.body

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                email,
                password
            }
        })

})


