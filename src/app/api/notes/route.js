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
    const { title, content, userId, userAvatar, username, status, color, isPrivate, ytVideo } = await request.json()
    // const userCookie = request.cookies.get('userJwtCookie')?.value
    // const tokenPayload = jwt.verify(userCookie, process.env.JWT_SECRET)
    // Create object for the collection
    console.log('ytVideo............................')
    console.log(ytVideo)
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