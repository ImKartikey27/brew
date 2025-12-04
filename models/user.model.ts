import mongoose, {Document, Schema} from "mongoose"

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}
const userSchema = new Schema<IUser>({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken:{
        type: String,
        required: true
    }
}, {timestamps: true})

userSchema.index({email:1}, {unique: true})

export default mongoose.model<IUser>("User", userSchema)