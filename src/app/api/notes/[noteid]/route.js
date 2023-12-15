import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { NoteModel } from "@/models/notemodel"
import { UserModel } from "@/models/usermodel"
import { NextResponse } from "next/server"

connectDB()

// Get Note by NoteId
export async function GET(request, { params }) {
    const { noteid } = params
    try {
        console.log('note')
        const note = await NoteModel.findById({ _id: noteid })
        //console.log(note)
        return getResponseMsg(
            { message: 'Note fetched successfully', status: 200, success: true, body: note }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to fetch note', status: 500, success: false, body: error.message }
        )
    }
}

// Delete note by noteId
export async function DELETE(request, { params }) {
    const { noteid } = params
    const { isItOriginalNote, userId } = await request.json()
    try {
        let deletedNote
        if (isItOriginalNote) {
            deletedNote = await NoteModel.findByIdAndDelete({ _id: noteid })
        } else {
            deletedNote = await NoteModel.findOneAndDelete({ originId: noteid, userId: userId, isOriginal: false })
        }
        if (!deletedNote) {
            return getResponseMsg(
                { message: `Note not found`, status: 404, success: false }
            )
        }
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
    console.log('EDIT NOTE API was called')
    const { noteid } = params
    //Fetch work data from request
    const { title, content, status, color, isPrivate, ytVideo } = await request.json()

    try {
        const note = await NoteModel.findById({ _id: noteid })
        note.title = title
        note.content = content
        note.status = status
        note.color = color
        note.isPrivate = isPrivate
        note.ytVideo = ytVideo
        note.updated = new Date()
        note.coreUpdated = new Date()

        const updatedNote = await note.save()
        console.log(updatedNote)

        return getResponseMsg(
            { message: `Dynamically updated note: ${noteid}`, status: 200, success: true, body: updatedNote }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to update note', status: 500, success: false, body: error.message }
        )
    }
}