// import { transporter } from "@/helper/nodemailer/nodemailer";
import { getResponseMsg } from "@/helper/getResponseMsg";
import nodemailer from 'nodemailer'
import { UserModel } from "@/models/usermodel";
import crypto from 'crypto';
import jwt from "jsonwebtoken"
import { PassVeriOtpModel } from "@/models/passVeriOtpmodel";
import { connectDB } from "@/helper/db";
import mongoose from "mongoose";

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
    const { subject, text, userid } = await request.json()
    try {

        // Getting user cookie
        const userCookie = request.cookies.get('userJwtCookie')?.value
        const tokenPayload = jwt.verify(userCookie, process.env.JWT_SECRET)

        // Convert userid to an ObjectId
        const objectIdUserId = new mongoose.Types.ObjectId(tokenPayload._id);

        const otpRecord = await PassVeriOtpModel.findOne({ userId: objectIdUserId });
        const temporaryOtp = crypto.randomInt(100000, 1000000).toString();

        // Check if an OTP already exists for this email
        if (otpRecord) {
            // Update the existing OTP record
            otpRecord.otp = temporaryOtp;
            otpRecord.createdAt = new Date(); // Reset the createdAt time to restart TTL
            await otpRecord.save();
        } else {
            // Create user object with model
            const tempPassOtp = new PassVeriOtpModel({
                userId: objectIdUserId,
                otp: temporaryOtp,
            })

            const createdTempPassOtp = await tempPassOtp.save()
        }

        // Setting mail options
        const mailOptions = {
            from: 'stickify.notes@gmail.com',
            to: tokenPayload.email,
        }

        const mail = await transporter.sendMail({
            ...mailOptions,
            subject: subject,
            text: text,
            html: `<h1>${subject}</h1>
            <h3>${text}<h3>
            <h2>OTP: ${temporaryOtp} <span style="font-size: 0.85rem;"> (This OTP is valid for 5 minutes)</p></span>`
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