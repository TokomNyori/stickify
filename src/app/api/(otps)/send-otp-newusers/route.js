// import { transporter } from "@/helper/nodemailer/nodemailer";
import { getResponseMsg } from "@/helper/getResponseMsg";
import nodemailer from 'nodemailer'
import { UserModel } from "@/models/usermodel";
import crypto from 'crypto';
import { TempOtpModel } from "@/models/tempotpmodel";
import { connectDB } from "@/helper/db";

const email = process.env.NODEMAILER_USER
const pass = process.env.NODEMAILER_PASS

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: pass,
    }
})

connectDB()

export async function POST(request, response) {
    const { subject, text, email } = await request.json()
    try {
        // Check if the user already exists
        const user = await UserModel.findOne({ email: email })

        if (user) {
            return getResponseMsg(
                { message: `We sent an email to ${email}`, status: 200, success: true, body: { otpSent: false } }
            )
        }

        // Generate a random 6 digit OTP
        const temporaryOtp = crypto.randomInt(100000, 1000000).toString();

        // Check if an OTP already exists for this email
        const otpRecord = await TempOtpModel.findOne({ email: email });

        if (otpRecord) {
            // Update the existing OTP record
            otpRecord.otp = temporaryOtp;
            otpRecord.createdAt = new Date(); // Reset the createdAt time to restart TTL
            await otpRecord.save();
        } else {
            // Create user object with model
            const temporaryUser = new TempOtpModel({
                email,
                otp: temporaryOtp,
            })

            const createdTemporaryUser = await temporaryUser.save()
        }

        // Setting mail options
        const mailOptions = {
            from: 'stickify.notes@gmail.com',
            to: email,
        }

        const mail = await transporter.sendMail({
            ...mailOptions,
            subject: subject,
            text: text,
            html: `<h1>${subject}</h1>
            <h3>${text}<h3>
            <h2>OTP: ${temporaryOtp} <span style="font-size: 0.85rem;"> (This OTP is valid for 5 minutes)</p></span>`
        })
        //console.log()
        return getResponseMsg(
            { message: `Success`, status: 200, success: true, body: { otpSent: true } }
        )
    } catch (error) {
        console.log(error)
        return getResponseMsg(
            { message: `Failed`, status: 400, success: false, body: error }
        )
    }
}