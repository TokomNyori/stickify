import { NextResponse } from "next/server"
import { UserModel } from "@/models/usermodel"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { connectDB } from "@/helper/db"

connectDB()

// Get user by id
export async function GET(request, { params }) {
    const { userid } = params
    try {
        const user = await UserModel.findById({ _id: userid })
        return getResponseMsg(
            { message: `Dynamically Fetched User: ${userid}`, status: 200, success: true, body: user }
        )
    } catch (error) {
        return getResponseMsg(
            { message: `Problem Fetching the User: ${userid}`, status: 500, success: false, body: error.message }
        )
    }
}

// Update user data by id
export async function PUT(request, { params }) {
    const { userid } = params
    const { name, email, password, about, profileUrl } = await request.json();
    try {
        const user = await UserModel.findById({ _id: userid })

        user.name = name
        user.email = email
        user.password = password
        user.about = about
        user.profileUrl = profileUrl

        const updatedUser = await user.save()

        return getResponseMsg(
            { message: `Dynamically Updated User: ${userid}`, status: 200, success: true, body: updatedUser }
        )
    } catch (error) {
        return getResponseMsg(
            { message: `Problem Updating the User: ${userid}`, status: 500, success: false, body: error.message }
        )
    }
}

// Delete user by ID
export async function DELETE(request, { params }) {
    const { userid } = params
    try {
        const user = await UserModel.deleteOne({ _id: userid })
        return getResponseMsg(
            { message: `Dynamically Deleted User: ${userid}`, status: 200, success: true, body: user }
        )
    } catch (error) {
        return getResponseMsg(
            { message: `Problem Deleting the User: ${userid}`, status: 500, success: false, body: error.message }
        )
    }
}