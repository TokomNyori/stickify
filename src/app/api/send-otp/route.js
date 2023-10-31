import { NextResponse } from "next/server";
import { transporter } from "@/helper/nodemailer/nodemailer";
import { getResponseMsg } from "@/helper/getResponseMsg";

export async function POST(request, response) {
    const { mailOptions, subject, text, otp } = await request.json()
    try {
        console.log(subject)
        const mail = await transporter.sendMail({
            ...mailOptions,
            subject: subject,
            text: text,
            html: `<h1>${subject}</h1><h3>${text}<h3><h2>OTP: ${otp}</h2><h4>(This OTP is valid for 1 hour)</h4>`
        })
        console.log(mail)
        return getResponseMsg(
            { message: `Success`, status: 200, success: true, body: mail }
        )
    } catch (error) {
        console.log(error)
        return getResponseMsg(
            { message: `Failed`, status: 400, success: false, body: error }
        )
    }
}