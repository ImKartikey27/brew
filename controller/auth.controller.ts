import {Request , Response} from "express"
import { asyncHandler } from "../middlewares/asyncHandler"
import User from "../models/user.model";
import bcrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token";

interface loginBody{
    email: string; 
    password: string;
}

interface registerBody{
    name: string;
    email: string;
    password: string;

}

async function hashPassword(password: string){
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)
}

export const login = asyncHandler(async(
    req: Request<{},{},loginBody> ,
    res: Response) => {

        const {email, password} = req.body

        //check for existing user 
        const user = await User.findOne({email})
        if(!user){
            const error = new Error("User not found") as any
            error.statusCode = 404
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            const error = new Error("Invalid credentials") as any
            error.statusCode = 401
            throw error;
        }


        const accessToken = generateAccessToken(user._id.toString(), user.email)
        const refreshToken = generateRefreshToken(user._id.toString(),user.email)

        user.refreshToken = refreshToken
        await user.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15*60*1000
        })

        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            data:{
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        })

})

export const register = asyncHandler(async(
    req: Request<{},{},registerBody> ,
    res: Response) => {

        const {name, email, password} = req.body

        //check existing user 
        const user = await User.findOne({email})
        if(user){
            const error = new Error("User already exists") as any
            error.statusCode = 409
            throw error;
        }

        const hashedPassword = await hashPassword(password)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })

    }
)

export const logout = asyncHandler(async(
    req: Request,
    res: Response) => {
        const user = req.user
        if(!user){
            const error = new Error("User not found") as any
            error.statusCode = 404
            throw error;
        }
        user.refreshToken = ""
        await user.save()
        res.clearCookie("refreshToken")
        res.clearCookie("accessToken")
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    }
)

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        const error = new Error("Refresh token missing") as any;
        error.status = 401;
        throw error;
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(payload.sub);
    if (!user || user.refreshToken !== refreshToken) {
        const error = new Error("Invalid refresh token") as any;
        error.status = 401;
        throw error;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id.toString(), user.email);

    // Set new access token cookie
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
        status: "success",
        message: "Token refreshed successfully",
    });
});

