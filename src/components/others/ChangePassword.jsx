import { generateAndsendOTP, verifyOTP } from "@/helper/nodemailer/handleOTPhelper";
import { useEffect, useState } from "react"; //BiSolidSend
import toast from "react-hot-toast";
import { BiSolidSend } from 'react-icons/bi'
import { AiOutlineSecurityScan } from 'react-icons/ai'
import { editSelfHelper } from "@/helper/httpHelpers/httpUserHelper";
import { useRouter } from "next/navigation";


const ChangePassword = ({ user, togglePasswordLoading, getUserCookie, toggleLoading, toggleVerificationLoading, theme }) => {
    const [formData, setFormData] = useState({
        password: '',
        verifyOtp: '',
        operation: 'edit-password',
    });
    const [isOtpSent, setIsOtpSent] = useState(false);
    const router = useRouter()

    const RESEND_INTERVAL = 60; // Resend interval in seconds (60 for 1 minute)
    const MAX_RESEND_COUNT = 3; // Maximum number of resends allowed
    const [timer, setTimer] = useState(RESEND_INTERVAL);
    const [canResend, setCanResend] = useState(false);
    const [resendCount, setResendCount] = useState(0);

    useEffect(() => {
        let interval;

        if (timer > 0 && isOtpSent) {
            interval = setInterval(() => {
                setTimer(timer => timer - 1);
            }, 1000);
        } else if (isOtpSent) {
            setCanResend(true);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timer, isOtpSent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleOtp = async (e) => {
        e.preventDefault()

        if (resendCount >= MAX_RESEND_COUNT) {
            toast.error("Maximum OTP resend attempts reached.");
            return;
        }

        togglePasswordLoading(true)

        const data = {
            mailOptions: { from: 'stickify.notes@gmail.com', to: user.email },
            subject: 'One-Time Password (OTP) for Password Setup',
            text: `You have requested to reset your password. To complete this process, 
                please use the following One-Time Password:`,
            userid: user._id,
        }

        try {
            const res = await generateAndsendOTP({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: data,
            })
            togglePasswordLoading(false)
            setIsOtpSent(true)
            toast.success(`OTP sent to ${user.email}`, {
                duration: 4000,
            })

            // Reset timer and increment resend count
            setTimer(RESEND_INTERVAL);
            setCanResend(false);
            setResendCount(count => count + 1);
            setIsOtpSent(true);

        } catch (error) {
            togglePasswordLoading(false)
            toast.error(error.message, {
                duration: 3000,
            })
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        toggleVerificationLoading(true)
        try {
            const data = {
                userid: user._id,
                typedOtp: formData.verifyOtp,
            }
            const res = await verifyOTP({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: data,
            })
            //console.log(res.body)
            toggleVerificationLoading(false)

            if (res.body.isVerified) {
                toast.success(res.message)
                toggleLoading(true)

                // Stop the timer and prevent further OTP resends
                setCanResend(false);
                setTimer(0);

                try {
                    const res = await editSelfHelper(
                        {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            id: user._id,
                            body: formData,
                        })
                    getUserCookie()
                    toggleLoading(false)
                    toast.success(res.message)
                    //setIsOtpSent(false)
                    router.push('/')
                } catch (error) {
                    toggleLoading(false)
                    console.log(error)
                    toast.error(error.message)
                }
            } else {
                toast.error('Invalid OTP')
            }
        } catch (error) {
            console.log(error)
            toggleVerificationLoading(false)
            toast.error(error.message)
        }
    }


    function generateOTP() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    console.log(formData)

    return (
        <div className="mt-4 w-[85%] lg:w-[30%] sm:w-[40%]">
            <form onSubmit={isOtpSent ? handleSubmit : handleOtp}>
                <div className="input-section flex flex-col gap-3 mb-4">
                    {
                        !isOtpSent ?
                            <>
                                <input
                                    className='rounded-xl block w-full 
                                    p-2.5 py-4 sm:py-3 text-md dark:placeholder-gray-400 dark:text-gray-100 
                                    dark:bg-zinc-800 bg-white shadow-sm 
                                focus:ring-blue-500 focus:border-blue-500'
                                    type="password"
                                    name="password"
                                    placeholder="Enter a new password"
                                    value={formData.password}
                                    onChange={handleChange} required
                                />
                                <button className='border hover:border-[1.4px] dark:border-gray-100 
                                focus:outline-none font-medium mt-1
                                rounded-lg text-md px-5 py-4 sm:py-3 mb-2 focus:ring-gray-700 block w-full border-zinc-800'
                                    type="submit"
                                >
                                    <span className="dark:text-gray-100 text-gray-800 flex items-center justify-center gap-2">
                                        Send OTP <BiSolidSend className="inline text-lg" />
                                    </span>
                                </button>
                            </>
                            :
                            <div className="flex flex-col gap-3 mb-4">
                                <div>
                                    {
                                        isOtpSent &&
                                        <label htmlFor="verifyOtp" className="block mb-2 text-sm font-medium text-green-500">
                                            OTP sent to {user.email}
                                        </label>
                                    }
                                    <input
                                        className='rounded-lg block w-full p-2.5 py-4 sm:py-3 text-md dark:placeholder-gray-400 
                                        dark:text-gray-100 dark:bg-zinc-800 bg-white shadow-sm 
                                        focus:ring-blue-500 focus:border-blue-500'
                                        id="verifyOtp"
                                        type="number"
                                        name="verifyOtp"
                                        placeholder="Enter 4-digit OTP"
                                        value={formData.verifyOtp}
                                        onChange={handleChange} required
                                    />
                                </div>
                                <button className='border hover:border-[1.4px] dark:border-gray-100
                                focus:outline-none font-medium mt-1
                                rounded-lg text-md px-5 py-4 sm:py-3 mb-2 focus:ring-gray-700 block w-full border-zinc-800'
                                    type="submit"
                                >
                                    <span className="dark:text-gray-100 text-gray-800 flex items-center justify-center gap-2">
                                        Verify OTP <AiOutlineSecurityScan className="inline text-lg" />
                                    </span>
                                </button>
                                {
                                    isOtpSent && (
                                        <div className={`flex justify-center ${canResend ? 'text-green-500' : 'text-red-500'}
                                        ${resendCount >= MAX_RESEND_COUNT && 'text-red-500'}`}>
                                            {canResend ? (
                                                <button onClick={handleOtp} disabled={resendCount >= MAX_RESEND_COUNT} >
                                                    {resendCount >= MAX_RESEND_COUNT ?
                                                        'Maximum OTP resend attempts reached.'
                                                        :
                                                        'Resend OTP'}
                                                </button>
                                            ) : (
                                                <p>Resend OTP in {timer} seconds</p>
                                            )}
                                        </div>
                                    )
                                }
                            </div>
                    }

                </div>

            </form>
        </div>
    )
}

export default ChangePassword