import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { NoteModel } from "@/models/notemodel"
import jwt from "jsonwebtoken"
import { UserModel } from "@/models/usermodel"
import { NextResponse } from "next/server"

connectDB()

// Post Note
export async function POST(request) {

    //Fetch work data from request
    const { title, content, userId, status, color, isPrivate, ytVideo, isOriginal, originId, userAvatar, username } = await request.json()
    const createdNote = new NoteModel({
        title,
        status,
        color,
        content,
        isPrivate,
        userId: userId,
        userAvatar: userAvatar,
        username: username,
        ytVideo,
        likes: 0,
        likedBy: [],
        copies: 0,
        copiedBy: [],
        isOriginal: isOriginal,
        originId: originId,
    })

    try {
        // Saving new object to the works collection
        const note = await createdNote.save()
        return getResponseMsg(
            { message: 'Successfully created note', status: 200, success: true, body: note }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to create note', status: 500, success: false, body: error.message }
        )
    }
}

// Delete note by originId and userId
export async function DELETE(request, { params }) {
    const { noteid } = params
    const { userId } = await request.json()
    try {
        const deletedNote = await NoteModel.findOneAndDelete({ originId: noteid, userId: userId, isOriginal: false })

        if (!deletedNote) {
            return getResponseMsg(
                { message: `Note not found`, status: 404, success: false }
            )
        }

        return getResponseMsg(
            { message: `Note deleted successfully: ${noteid}`, status: 200, success: true, body: deletedNote }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to delete note', status: 500, success: false, body: error.message }
        )
    }
}