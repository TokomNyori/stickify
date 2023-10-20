import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { Task } from "@/models/notemodel"

connectDB()

// Get Note by NoteId
export async function GET(request, { params }) {
    const { taskid } = params
    try {
        const task = await Task.findById({ _id: taskid })
        return getResponseMsg(
            { message: 'Task fetched successfully', status: 200, success: true, body: task }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to fetch task', status: 500, success: false, body: error.message }
        )
    }
}