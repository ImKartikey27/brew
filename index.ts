import "dotenv/config"
import http from "http"
import connectDB from "./database"
import app from "./app"


const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI as string

async function main(){
    try {

        await connectDB(MONGODB_URI)
        const server = http.createServer(app)
        server.listen(PORT,() => {
            console.log(`Server started running at PORT ${PORT}`);
        })
        
    } catch (error) {
        console.log("Failed to start the server");
        process.exit(1)
    }
}

main()