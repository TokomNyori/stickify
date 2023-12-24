// import { transporter } from "@/helper/nodemailer/nodemailer";
import { getResponseMsg } from "@/helper/getResponseMsg";
import nodemailer from 'nodemailer'
import { UserModel } from "@/models/usermodel";
import crypto from 'crypto';
import { TempOtpModel } from "@/models/tempotpmodel";
import { connectDB } from "@/helper/db";
import { EmailVeriOtpModel } from "@/models/emailVeriOtpmodel";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

connectDB()

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
    const { subject, text, userid, email, } = await request.json()
    // console.log("POST request received")
    // console.log("Subject:", subject);
    // console.log("Text:", text);
    // console.log("Email:", email);

    try {

        // Getting user cookie
        const userCookie = request.cookies.get('userJwtCookie')?.value
        const tokenPayload = jwt.verify(userCookie, process.env.JWT_SECRET)
        // Convert userid to an ObjectId
        const objectIdUserId = new mongoose.Types.ObjectId(tokenPayload._id);

        // Validation
        const user = await UserModel.findById({ _id: objectIdUserId })

        if (user.email !== email) {
            const isNewUserReq = await UserModel.findOne({ email: email })
            if (isNewUserReq) {
                console.log('Oops! An account with this email already exists')
                // Return fake success message to prevent email enumeration
                return getResponseMsg(
                    { message: `User already exists`, status: 200, success: true }
                )
            }
        }


        // IF THE USER IS VERIFIED, THEN SEND THE OTP

        // Generate a random 6 digit OTP
        const temporaryOtp = crypto.randomInt(100000, 1000000).toString();

        // Checking for existing OTP record
        const otpRecord = await EmailVeriOtpModel.findOne({ userId: objectIdUserId });

        if (otpRecord) {
            // Update the existing OTP record
            otpRecord.otp = temporaryOtp;
            otpRecord.createdAt = new Date(); // Reset the createdAt time to restart TTL
            await otpRecord.save();
        } else {
            // Create user object with model
            const tempEmailOtp = new EmailVeriOtpModel({
                userId: objectIdUserId,
                otp: temporaryOtp,
            })

            const createdTempEmailOtp = await tempEmailOtp.save()
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