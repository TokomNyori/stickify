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