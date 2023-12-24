import { is } from "date-fns/locale";
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    avatar: { type: String },
    username: {
        type: String,
        required: [true, "Name required"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password required"],
    },
    created: { type: Date, default: Date.now },
    notifications: { type: [String] },
    isVerified: { type: Boolean, default: false },
})

export const UserModel = mongoose.models.users || mongoose.model('users', UserSchema)