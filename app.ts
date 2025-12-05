import express, {Application} from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import errorHandler from "./middlewares/errorHander";



const app = express() as Application

//middlewares
app.use(helmet())
app.use(cors({
    origin: '*',
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, 
  }))

//routes imports 
import authRoutes from "./routes/auth.routes"
import taskRoutes from "./routes/task.routes"
//use routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/tasks",taskRoutes )

app.use(errorHandler)

export default app