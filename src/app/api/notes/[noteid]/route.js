import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { NoteModel } from "@/models/notemodel"
import { UserModel } from "@/models/usermodel"
import { NextResponse } from "next/server"

//connectDB()

// Delete note by noteId
export async function DELETE(request, { params }) {
    const { noteid } = params
    try {
        const deletedNote = await NoteModel.deleteOne({ _id: noteid })
        return getResponseMsg(
            { message: `Dynamically Deleted note: ${noteid}`, status: 200, success: true, body: deletedNote }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to delete note', status: 500, success: false, body: error.message }
        )
    }
}

// Edit note by noteId
export async function PUT(request, { params }) {
    const { nodeid } = params
    //Fetch work data from request
    const { title, content, status } = await request.json()

    try {
        const note = await NoteModel.findById({ _id: nodeid })
        note.title = title
        note.content = content
        note.status = status

        const updatedNote = await note.save()

        return getResponseMsg(
            { message: `Dynamically updated note: ${nodeid}`, status: 200, success: true, body: updatedNote }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to update note', status: 500, success: false, body: error.message }
        )
    }
}