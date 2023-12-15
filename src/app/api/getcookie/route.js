import { connectDB } from "@/helper/db"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export const GET = async (request) => {
    // console.log('userCookie called!!!!!!!!!!!!')
    try {
        const userCookie = request.cookies.get('userJwtCookie')?.value
        const tokenPayload = jwt.verify(userCookie, process.env.JWT_SECRET)
        //console.log(userCookie)
        return NextResponse.json({
            success: true,
            message: 'Successfully got cookies',
            body: tokenPayload,
        }, { status: 200 })
    } catch (error) {
        //console.log('userCookie error callleeedd!!!!!!!!!!!!')
        return NextResponse.json({
            success: false,
            message: 'Error getting user cookie'
        }, { status: 500 })
    }
}