import { NextResponse } from "next/server"

export const POST = async (request) => {
    const response = NextResponse.json({
        message: "You've been logged out. See you soon!",
        success: true,
    })

    response.cookies.set('userJwtCookie', '', {
        maxAge: new Date(0)
    })

    return response
}