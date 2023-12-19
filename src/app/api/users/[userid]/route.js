import { NextResponse } from "next/server"
import { UserModel } from "@/models/usermodel"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { connectDB } from "@/helper/db"
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'

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
    const { username, email, password, avatar, operation } = await request.json();
    if (operation === 'edit-profile') {
        try {
            // Validation
            const user = await UserModel.findById({ _id: userid })

            // Checking if user already exist
            if (user.email !== email) {
                const newuserReq = await UserModel.findOne({ email: email })
                if (newuserReq) {
                    console.log('Oops! An account with this email already exists')
                    return getResponseMsg(
                        { message: `Oops! An account with this email already exists`, status: 409, success: false }
                    )
                }
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                console.log('Invalid credentials')
                return getResponseMsg(
                    { message: `Incorrect password`, status: 401, success: false }
                )
            }

            user.avatar = avatar
            user.username = username
            user.email = email
            const updatedUser = await user.save()

            // Creating Jwt Token
            const jwtToken = jwt.sign({
                _id: updatedUser._id,
                avatar: updatedUser.avatar,
                username: updatedUser.username,
                email: updatedUser.email,
            }, process.env.JWT_SECRET)

            console.log(jwtToken)

            // Set Cookies using NextResponse
            const maxage = 30 * 24 * 60 * 60
            const response = NextResponse.json({
                message: 'Successfully updated',
                success: 'true',
            }, { status: 200 })
            //response.cookies.delete ('userJwtCookie')
            response.cookies.set('userJwtCookie', jwtToken, { maxAge: maxage })
            return response
        } catch (error) {
            return getResponseMsg(
                { message: `Failed to update`, status: 400, success: false, body: error }
            )
        }
    } else {
        const user = await UserModel.findById({ _id: userid })
        // Checking if user exist
        if (!user) {
            throw new Error('User does not exist')
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, salt)
        user.password = encryptedPassword
        try {
            const updatedUser = await user.save()
            return getResponseMsg(
                { message: `Password created successfully`, status: 200, success: true, body: updatedUser }
            )
        } catch (error) {
            return getResponseMsg(
                { message: `Failed to create new password`, status: 400, success: false, body: error }
            )
        }
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