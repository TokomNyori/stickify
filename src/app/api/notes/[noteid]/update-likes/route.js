import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { NoteModel } from "@/models/notemodel"

connectDB()

// Edit only note status by noteId
export async function PUT(request, { params }) {
    const { noteid } = params
    //Fetch work data from request
    const { userId, operation } = await request.json()

    try {
        const note = await NoteModel.findById({ _id: noteid })
        if (operation === 'like') {
            const updatedLikedBy = [...note.likedBy, userId];
            note.likes += 1
            note.likedBy = updatedLikedBy
        }
        if (operation === 'unlike') {
            //const updatedLikedBy = note.likedBy.filter(likedUserId => likedUserId.toString() === userId.toString())
            //const userIds = [...note.likedBy]
            const updatedIds = note.likedBy.filter(ids => ids.toString() !== userId.toString())
            note.likes -= 1
            note.likedBy = [...updatedIds]
        }

        const updatedNote = await note.save()

        return getResponseMsg(
            { message: `Dynamically updated likes: ${noteid}`, status: 200, success: true, body: updatedNote }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to update likes', status: 500, success: false, body: error.message }
        )
    }
}