import mongoose, { Schema } from "mongoose";

const PassVeriOtpSchema = new Schema({
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
        index: { expires: '5m' } // TTL for 5 minutes
    },
});

export const PassVeriOtpModel = mongoose.models.PassVeriOtp || mongoose.model('PassVeriOtp', PassVeriOtpSchema);
