import { User } from "@/models/usermodel"
import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGODB_URI, { dbName: "work_manager" })
        console.log('Database Connection')
    } catch (error) {
        console.log('Failed to connect to Database')
        console.log(error)
    }
}