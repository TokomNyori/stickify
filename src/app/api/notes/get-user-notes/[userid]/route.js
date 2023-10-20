import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { NoteModel } from "@/models/notemodel"
import { NextResponse } from "next/server"

//connectDB()

export async function GET(request, { params }) {
    const { userid } = params
    try {
        const notes = await NoteModel.find({ userId: userid })
        return NextResponse.json({
            message: `Dynamically Fetched notes for user id: ${userid}`,
            success: true,
            "total notes": notes.length,
            body: notes,
        }, { status: 200 })
    } catch (error) {
        return getResponseMsg(
            { message: `Problem Fetching the notes for user: ${userid}`, status: 500, success: false, body: error.message }
        )
    }
}