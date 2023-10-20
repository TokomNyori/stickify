import { NextResponse } from "next/server"

export const getResponseMsg = ({ message, status, success, body }) => {
    return NextResponse.json(
        success === true ?
            {
                success: success,
                message: message,
                body: body,
            } :
            {
                success: success,
                message: message,
                "error message": body,
            }
        , { status: status })
}