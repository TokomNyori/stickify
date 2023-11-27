import { connectDB } from "@/helper/db";
import { NoteModel } from "@/models/notemodel";
import { getResponseMsg } from "@/helper/getResponseMsg";

connectDB()

export async function GET(request) {
    try {
        const notes = await NoteModel.find().sort({ coreUpdated: -1 })
        return getResponseMsg(
            { message: 'Fetched notes', status: 200, success: true, body: notes }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to fetch notes', status: 500, success: false, body: error.message }
        )
    }
}

// Drop a collection
export async function DELETE(request) {
    try {
        const deletedNotes = await NoteModel.collection.drop()
        return getResponseMsg(
            { message: `Droped collection`, status: 200, success: true, body: deletedNotes }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to drop collection', status: 500, success: false, body: error.message }
        )
    }
}
