import { connectDB } from "@/helper/db"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { NoteModel } from "@/models/notemodel"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

connectDB()

export async function GET(request) {
    const userCookie = request.cookies.get('userJwtCookie')?.value
    // if (!userCookie) {
    //     return NextResponse.json({
    //         message: 'User is not logged in'
    //     })
    // }
    const tokenPayload = jwt.verify(userCookie, process.env.JWT_SECRET)

    try {
        const notes = await NoteModel.find({ userId: tokenPayload._id }).sort({ updated: -1 })
        console.log('GET NOTES CALLED')
        console.log(notes)
        return NextResponse.json({
            message: `Dynamically Fetched notes`,
            success: true,
            "total notes": notes.length,
            body: notes,
        }, { status: 200 })
    } catch (error) {
        return getResponseMsg(
            { message: `Problem Fetching notes`, status: 500, success: false, body: error.message }
        )
    }
}