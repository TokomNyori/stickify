import { connectDB } from "@/helper/db";
import { UserModel } from "@/models/usermodel";
import { getResponseMsg } from "@/helper/getResponseMsg";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { TempOtpModel } from "@/models/tempotpmodel";

connectDB()

export async function POST(request) {

    //Fetch user request from request
    const { username, email, password, avatar, verifyOtp } = await request.json();

    // Check if the otp has expired
    const otpRecord = await TempOtpModel.findOne({ email: email });

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

    // Create user object with model
    const newUser = new UserModel({
        avatar,
        username,
        email,
        password: encryptedPassword,
        isVerified: true,
    })

    try {
        //Saving user to the collection
        const createdUser = await newUser.save()

        // Creating Jwt Token
        const jwtToken = jwt.sign({
            _id: createdUser._id,
            avatar: createdUser.avatar,
            username: createdUser.username,
            email: createdUser.email,
        }, process.env.JWT_SECRET)
        // console.log('JWT TOKEN---')
        // console.log(jwtToken)

        // Set Cookies using NextResponse
        const maxage = 30 * 24 * 60 * 60
        const response = NextResponse.json({
            message: 'Welcome aboard!',
            success: 'true'
        }, { status: 200 })
        //response.cookies.delete ('userJwtCookie')
        response.cookies.set('userJwtCookie', jwtToken, { maxAge: maxage })
        return response

    } catch (error) {
        if (error.message.includes('E11000 duplicate key error')) {
            return getResponseMsg(
                { message: `Oops! User already exists`, status: 409, success: false, body: error.message }
            )
        }
        return getResponseMsg(
            { message: `Oops! Something went wrong`, status: 500, success: false, body: error.message }
        )
    }
}