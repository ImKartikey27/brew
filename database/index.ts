import mongoose from "mongoose";

async function connectDB(uri: string){
    try {

        await mongoose.connect(uri);
        
        
    } catch (error) {
        throw new Error("Database connection failed")
    }
}

export default connectDB

