import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { NoteModel } from "@/models/notemodel"
import { Types } from 'mongoose';

connectDB()

// Edit only note status by noteId
export async function PUT(request, { params }) {
    const { noteid } = params
    //Fetch work data from request
    const { copiedBy, func } = await request.json()
    const { ObjectId } = Types;

    try {
        // Check if likedBy is provided
        if (!copiedBy) {
            return getResponseMsg({
                message: 'Oops! Something went wrong',
                status: 400,
                success: false,
                body: 'Operation requires a valid copiedBy parameter.'
            });
        }

        // Convert noteid to ObjectId
        const noteObjectId = new ObjectId(noteid);
        const copiedByObjectId = new ObjectId(copiedBy);

        let update;
        if (func === 'copy') {
            update = { $inc: { copies: 1 }, $addToSet: { copiedBy: copiedByObjectId } };
        } else {
            update = { $inc: { copies: -1 }, $pull: { copiedBy: copiedByObjectId } };
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
            {
                message: func === 'copy' ? `Copied to your notes` : `Removed from your notes`, status: 200,
                success: true, body: updatedNote
            }
        )
    } catch (error) {
        console.log(error)
        return getResponseMsg(
            { message: 'Failed to remove copy', status: 500, success: false, body: error.message }
        )
    }
}