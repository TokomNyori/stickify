import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { NoteModel } from "@/models/notemodel"

connectDB()

// Edit only note status by noteId
export async function PUT(request, { params }) {
    const { noteid } = params
    //Fetch work data from request
    const { ytVideo } = await request.json()

    try {
        const note = await NoteModel.findById({ _id: noteid })
        note.ytVideo = ytVideo
        note.updated = new Date()

        const updatedNote = await note.save()

        return getResponseMsg(
            { message: `Deleted video: ${noteid}`, status: 200, success: true, body: updatedNote }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to delete video', status: 500, success: false, body: error.message }
        )
    }
}