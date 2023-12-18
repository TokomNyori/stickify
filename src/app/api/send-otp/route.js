// import { transporter } from "@/helper/nodemailer/nodemailer";
import { getResponseMsg } from "@/helper/getResponseMsg";
import nodemailer from 'nodemailer'
import { UserModel } from "@/models/usermodel";
import crypto from 'crypto';

const email = process.env.NODEMAILER_USER
const pass = process.env.NODEMAILER_PASS

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: pass,
    }
})

export async function POST(request, response) {
    const { mailOptions, subject, text, userid } = await request.json()
    try {
        const user = await UserModel.findById({ _id: userid })
        const otp = crypto.randomInt(100000, 1000000).toString();
        user.otp = otp
        //user.otpExpires = new Date(new Date().getTime() + (30 * 1000)); // 30 seconds from now
        user.otpExpires = new Date(new Date().getTime() + (5 * 60 * 1000)); // 5 minutes
        const updatedOtp = await user.save()

        const mail = await transporter.sendMail({
            ...mailOptions,
            subject: subject,
            text: text,
            html: `<h1>${subject}</h1>
            <h3>${text}<h3>
            <h2>OTP: ${otp} <span style="font-size: 0.85rem;"> (This OTP is valid for 5 minutes)</p></span>`
        })
        //console.log(mail)
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