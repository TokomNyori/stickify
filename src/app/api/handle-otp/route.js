import { getResponseMsg } from "@/helper/getResponseMsg";
import { UserModel } from "@/models/usermodel";

export async function POST(request, response) {
    const { typedOtp, userid } = await request.json()
    try {
        const user = await UserModel.findById({ _id: userid })
        const currentTime = new Date();
        if (user.otp === typedOtp.toString()) {
            if (currentTime < user.otpExpires) {
                user.otp = ""
                user.otpExpires = null; // Reset the expiration time
                const updatedOtp = await user.save()
                return getResponseMsg(
                    { message: `OTP Verified!`, status: 200, success: true, body: { isVerified: true } }
                )
            } else {
                return getResponseMsg({
                    message: `OTP has expired`,
                    status: 401, // or consider using 401 or 403 for an expired token
                    success: false,
                    body: { isVerified: false }
                });
            }
        } else {
            return getResponseMsg(
                { message: `Invalid OTP`, status: 401, success: false, body: { isVerified: false } }
            )
        }
    } catch (error) {
        console.log(error)
        return getResponseMsg(
            { message: `Server Error`, status: 500, success: false, body: error }
        )
    }
}