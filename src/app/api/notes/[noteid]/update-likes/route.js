import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { NoteModel } from "@/models/notemodel"

connectDB()

// Edit only note status by noteId
export async function PUT(request, { params }) {
    const { noteid } = params
    //Fetch work data from request
    const { likedBy, func } = await request.json()
    console.log(func)
    try {
        let update;
        if (func === 'like') {
            update = {
                $inc: { likes: 1 },
                $addToSet: { likedBy: likedBy }, // Add to set to ensure unique entries
            };
        } else {
            update = { $inc: { likes: -1 }, $pull: { likedBy: likedBy } };
        }

        const updatedNote = await NoteModel.findByIdAndUpdate(noteid, update, { new: true });

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