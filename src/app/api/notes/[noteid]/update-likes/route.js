import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { NoteModel } from "@/models/notemodel"

connectDB()

// Edit only note status by noteId
export async function PUT(request, { params }) {
    const { noteid } = params
    //Fetch work data from request
    const { likedBy, likes } = await request.json()

    try {
        const note = await NoteModel.findById({ _id: noteid })
        note.likes = likes
        note.likedBy = likedBy

        const updatedNote = await note.save()

        return getResponseMsg(
            { message: `Dynamically updated likes: ${noteid}`, status: 200, success: true, body: updatedNote }
        )
    } catch (error) {
        console.log(error)
        return getResponseMsg(
            { message: 'Failed to update likes', status: 500, success: false, body: error.message }
        )
    }
}