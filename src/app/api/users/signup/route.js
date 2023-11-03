import { connectDB } from "@/helper/db";
import { UserModel } from "@/models/usermodel";
import { getResponseMsg } from "@/helper/getResponseMsg";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

connectDB()

export async function POST(request) {

    //Fetch user request from request
    const { username, email, password, avatar } = await request.json();

    // Encrypt password
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(password, salt)

    // Create user object with model
    const newUser = new UserModel({
        avatar,
        username,
        email,
        password: encryptedPassword,
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
                { message: `Oops! User already exists`, status: 500, success: false, body: error.message }
            )
        }
        return getResponseMsg(
            { message: `Oops! Something went wrong`, status: 500, success: false, body: error.message }
        )
    }
}