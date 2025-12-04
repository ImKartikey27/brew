import express, {Application} from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import errorHandler from "./middlewares/errorHander";



const app = express() as Application

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
app.use(errorHandler)


app.get("/",(req,res) => {
    res.send("Hello world")
})

app.use(errorHandler)

export default app