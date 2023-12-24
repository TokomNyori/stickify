import mongoose, { Schema } from "mongoose";

const TempOtpSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
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

export const TempOtpModel = mongoose.models.TempOtp || mongoose.model('TempOtp', TempOtpSchema);
