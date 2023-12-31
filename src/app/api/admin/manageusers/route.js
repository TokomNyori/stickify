import { connectDB } from "@/helper/db";
import { UserModel } from "@/models/usermodel";
import { getResponseMsg } from "@/helper/getResponseMsg";

connectDB()

export async function PUT(request) {
    try {
        const users = await UserModel.find()
        return getResponseMsg(
            { message: 'Fetched Users', status: 200, success: true, body: users }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to fetch users', status: 500, success: false, body: error.message }
        )
    }
}

