import { UserModel } from "@/models/usermodel"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { connectDB } from "@/helper/db"

connectDB()

// Get user by id
export async function GET(request, { params }) {
    const { userid } = params
    try {
        const user = await UserModel.findById({ _id: userid })
        return getResponseMsg(
            { message: `Dynamically Fetched User: ${userid}`, status: 200, success: true, body: user }
        )
    } catch (error) {
        return getResponseMsg(
            { message: `Problem Fetching the User: ${userid}`, status: 500, success: false, body: error.message }
        )
    }
}