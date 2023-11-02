import { connectDB } from "@/helper/db";
import { UserModel } from "@/models/usermodel";
import { getResponseMsg } from "@/helper/getResponseMsg";
import { NextResponse } from "next/server";

connectDB()

export async function GET() {
    try {
        const users = await UserModel.find()
        return getResponseMsg(
            { message: 'Fetched Users', status: 200, success: true, body: users }
        )
    } catch (error) {
        return getResponseMsg(
            { message: 'Failed to fetch Users', status: 500, success: false, body: error.message }
        )
    }
}

