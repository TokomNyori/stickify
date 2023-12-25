import { NextResponse } from "next/server"
import { UserModel } from "@/models/usermodel"
import { getResponseMsg } from "@/helper/getResponseMsg"
import { connectDB } from "@/helper/db"
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import mongoose from "mongoose";
import { EmailVeriOtpModel } from "@/models/emailVeriOtpmodel";
import { PassVeriOtpModel } from "@/models/passVeriOtpmodel";

connectDB()

// Get user by id
export async function GET(request, { params }) {
    const { userid } = params
    try {
        const user = await UserModel.findById({ _id: userid })
        if (!user) {
            const response = NextResponse.json({
                message: "Account not found or has been removed.",
                success: true,
            })

            response.cookies.set('userJwtCookie', '', {
                maxAge: new Date(0)
            })

            return response
        } else {
            return getResponseMsg(
                { message: `Dynamically Fetched User: ${userid}`, status: 200, success: true, body: user }
            )
        }
    } catch (error) {
        return getResponseMsg(
            { message: `Problem Fetching the User: ${userid}`, status: 500, success: false, body: error.message }
        )
    }
}

// Update user data by id
export async function PUT(request, { params }) {
    const { userid } = params
    const { username, email, password, avatar, operation, verifyOtp } = await request.json();

    // console.log("POST request received")
    // console.log("Username:", username);
    // console.log("Email:", email);
    // console.log("Password:", password);
    // console.log("Avatar:", avatar);
    // console.log("Operation:", operation);
    // console.log("Verify OTP:", verifyOtp);

    // Getting user cookie
    const userCookie = request.cookies.get('userJwtCookie')?.value
    const tokenPayload = jwt.verify(userCookie, process.env.JWT_SECRET)
    // Convert userid to an ObjectId
    const objectIdUserId = new mongoose.Types.ObjectId(tokenPayload._id);

    if (operation === 'verification') {
        // Validation
        const user = await UserModel.findById({ _id: objectIdUserId })

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            console.log('Invalid credentials')
            return getResponseMsg(
                { message: `Incorrect password`, status: 401, success: false }
            )
        } else if (email === user.email) {
            console.log('Same email address.')

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

            // Set Cookies using NextResponse
            const maxage = 30 * 24 * 60 * 60
            const response = NextResponse.json({
                message: 'Successfully updated',
                success: 'true',
            }, { status: 200 })
            //response.cookies.delete ('userJwtCookie')
            response.cookies.set('userJwtCookie', jwtToken, { maxAge: maxage })
            return response
        } else {
            return getResponseMsg(
                { message: `All clear`, status: 200, success: true }
            )
        }
    } else if (operation === 'edit-profile') {
        try {

            // Check if the otp has expired
            const otpRecord = await EmailVeriOtpModel.findOne({ userId: objectIdUserId });

            // If otp has expired
            if (!otpRecord) {
                // OTP has expired or never existed
                return getResponseMsg(
                    { message: `OTP has expired`, status: 401, success: false, body: { isVerified: false } }
                )
            }

            // If otp is incorrect
            if (otpRecord.otp !== verifyOtp.toString()) {
                return getResponseMsg(
                    { message: `Incorrect OTP`, status: 401, success: false, body: { isVerified: false } }
                )
            }

            // IF OTP IS VALID THEN UPDATE THE USER AND COOKIES

            // Validation
            const user = await UserModel.findById({ _id: objectIdUserId })

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

            //console.log(jwtToken)

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
    } else if (operation === 'edit-password') {

        const user = await UserModel.findById({ _id: objectIdUserId })
        // Checking if user exist
        if (!user) {
            return getResponseMsg(
                { message: `User does not exist`, status: 404, success: false, body: { message: `User does not exist` } }
            )
        }

        // Check if the otp has expired
        const otpRecord = await PassVeriOtpModel.findOne({ userId: objectIdUserId });

        // If otp has expired
        if (!otpRecord) {
            // OTP has expired or never existed
            return getResponseMsg(
                { message: `OTP has expired`, status: 401, success: false, body: { isVerified: false } }
            )
        }

        if (otpRecord.otp !== verifyOtp.toString()) {
            return getResponseMsg(
                { message: `Incorrect OTP`, status: 401, success: false, body: { isVerified: false } }
            )
        }

        // If otp is correct
        // Delete the otp record from the collection
        await otpRecord.deleteOne()

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
                { message: `Failed to create new password`, status: 500, success: false, body: error }
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