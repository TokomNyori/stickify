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
        let update;
        if (func === 'copy') {
            update = {
                $inc: { copies: 1 },
                $addToSet: { copiedBy: new ObjectId(copiedBy) }, // Add to set to ensure unique entries
            };
        } else {
            update = { $inc: { copies: -1 }, $pull: { copiedBy: new ObjectId(copiedBy) } };
        }

        const updatedNote = await NoteModel.findByIdAndUpdate(noteid, update, { new: true });

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