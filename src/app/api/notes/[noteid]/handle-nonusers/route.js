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
        const note = await NoteModel.findById({ _id: noteid })

        if (!note) {
            return getResponseMsg(
                { message: 'Note not found', status: 404, success: false, body: null }
            )
        }

        if (note.isPrivate) {
            return getResponseMsg(
                { message: 'Note is private', status: 403, success: false, body: null }
            )
        }
        console.log("note-------------")
        console.log(note)
        return getResponseMsg(
            { message: 'Note fetched successfully', status: 200, success: true, body: note }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to fetch note', status: 500, success: false, body: error.message }
        )
    }
}