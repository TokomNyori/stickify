import { connectDB } from "@/helper/db";
import { UserModel } from "@/models/usermodel";
import { getResponseMsg } from "@/helper/getResponseMsg";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

connectDB()

export async function POST(request) {
    console.log('LOGIN API CALLED!!!')

    //Fetch user request from request
    const { email, password } = await request.json();

    try {
        // Validation
        const user = await UserModel.findOne({ email: email })

        // Checking if user exist
        if (!user) {
            throw new Error('User does not exist')
        }

        // Checking if the input password is correct
        const passwordTest = await bcrypt.compare(password, user.password)

        if (!passwordTest) {
            throw new Error('Oops! Incorrect password')
        }

        // Creating Jwt Token
        const jwtToken = jwt.sign({
            _id: user._id,
            avatar: user.avatar,
            username: user.username,
            email: user.email,
        }, process.env.JWT_SECRET)

        //console.log(jwtToken)

        // Set Cookies using NextResponse
        const maxage = 30 * 24 * 60 * 60
        const response = NextResponse.json({
            message: 'Welcome back',
            success: 'true',
        }, { status: 200 })
        //response.cookies.delete ('userJwtCookie')
        response.cookies.set('userJwtCookie', jwtToken, { maxAge: maxage })

        return response

    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            message: error.message,
            success: false,
        }, { status: 500 })
    }

    // Create user object with model
    // const newUser = new User({
    //     email,
    //     password,
    // })

    // try {
    //     //Saving user to the collection
    //     const createdUser = await newUser.save()

    //     return getResponseMsg(
    //         { message: "You've successfully logged in", status: 200, success: true, body: createdUser }
    //     )
    // } catch (error) {
    //     return getResponseMsg(
    //         { message: 'Oops! Login failed', status: 500, success: false, body: error.message }
    //     )
    // }
}