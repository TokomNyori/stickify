import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { NoteModel } from "@/models/notemodel"
import { Types } from 'mongoose';

connectDB()

// Edit only note status by noteId
export async function PUT(request, { params }) {
    const { noteid } = params
    //Fetch work data from request
    const { likedBy, func } = await request.json()
    const { ObjectId } = Types;

    try {
        // Check if likedBy is provided
        if (!likedBy) {
            return getResponseMsg({
                message: 'Oops! Something went wrong',
                status: 400,
                success: false,
                body: 'Operation requires a valid likedBy parameter.'
            });
        }

        // Convert noteid to ObjectId
        const noteObjectId = new ObjectId(noteid);
        const likedByObjectId = new ObjectId(likedBy);

        let update;
        if (func === 'like') {
            update = { $inc: { likes: 1 }, $addToSet: { likedBy: likedByObjectId } };
        } else {
            // console.log(`likedBy before conversion: ${likedBy}, type: ${typeof likedBy}`)
            // const likedByObjectId = new ObjectId(likedBy)
            // console.log(`likedBy after conversion: ${likedByObjectId}, type: ${typeof likedByObjectId}`)
            update = { $inc: { likes: -1 }, $pull: { likedBy: likedByObjectId } };
        }

        const updatedNote = await NoteModel.findByIdAndUpdate(
            noteObjectId,
            update,
            { new: true, runValidators: true },
        );

        if (!updatedNote) {
            return getResponseMsg({
                message: 'Note not found or update failed',
                status: 404, // Using 404 to indicate "Not Found"
                success: false,
                body: 'The requested note could not be found or the update operation failed.'
            });
        }

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