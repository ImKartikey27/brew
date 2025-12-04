import {Request, Response, NextFunction} from 'express'
import { verifyAccessToken } from '../utils/token';
import User, { IUser } from '../models/user.model';


declare global{
    namespace Express{
        interface Request{
            user?: IUser
        }
    }
}
export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction)
    {
        try {
            //extract token 
            const authHeader = req.headers.authorization
            if(!authHeader || !authHeader.startsWith('Bearer ')){
                const error = new Error('Missing or invalid authorization header') as any
                error.statusCode = 401
                throw error;
            }
            const token = authHeader.split(" ")[1]

            //verify token 
            const payload = verifyAccessToken(token)

            //fetch user from database
            const user = await User.findById(payload.sub)
            if(!user){
                const error = new Error("User not found") as any
                error.statusCode = 401
                throw error;
            }
            req.user = user
            next()
            
        } catch (error:any) {
            if(error.name === "JsonWebTokenError" || error.name ==="TokenExpiredError"){
                error.status = 401
                error.message = "Invalid or expired token"
            }
            next(error)
        }
    }