import mongoose, { Schema } from "mongoose";

const EmailVeriOtpSchema = new Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        index: { expires: '1m' } // TTL for 5 minutes
    },
});

export const EmailVeriOtpModel = mongoose.models.EmailVeriOtp || mongoose.model('EmailVeriOtp', EmailVeriOtpSchema);
