import { sendOTP } from "@/helper/nodemailer/sendOTP";
import { useEffect, useState } from "react"; //BiSolidSend
import toast from "react-hot-toast";
import { BiSolidSend } from 'react-icons/bi'
import { AiOutlineSecurityScan } from 'react-icons/ai'
import { editSelfHelper } from "@/helper/httpHelpers/httpUserHelper";
import { useRouter } from "next/navigation";


const ChangePassword = ({ user, togglePasswordLoading, getUserCookie, toggleLoading }) => {
    const [formData, setFormData] = useState({
        password: '',
        otp: '',
        verifyOtp: '',
        operation: 'edit-password',
    });
    const [isOtpSent, setIsOtpSent] = useState(false);
    const router = useRouter()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleOtp = async (e) => {
        e.preventDefault()
        togglePasswordLoading(true)
        const oTp = generateOTP()
        setFormData(prev => ({
            ...prev,
            otp: oTp.toString(),
        }))

        const data = {
            mailOptions: { from: 'stickify.notes@gmail.com', to: 'tokom.nyori@gmail.com' },
            subject: 'One-Time Password (OTP) for Password Setup',
            text: `You have requested to reset your password. To complete this process, 
                please use the following One-Time Password:`,
            otp: oTp
        }

        try {
            const res = await sendOTP({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: data,
            })
            togglePasswordLoading(false)
            setIsOtpSent(true)
            console.log(res)
            toast.success(`OTP sent to ${user.email}`, {
                duration: 4000,
            })
        } catch (error) {
            togglePasswordLoading(false)
            toast.error(error.message, {
                duration: 3000,
            })
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (formData.otp === formData.verifyOtp) {
            toast.success('OTP Verified!')
            toggleLoading(true)
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
            toast.error('Incorrect OTP')
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
                                    p-2.5 py-4 sm:py-3 text-md dark:placeholder-gray-400 dark:text-white dark:bg-gray-800
                                focus:ring-blue-500 focus:border-blue-500'
                                    type="password"
                                    name="password"
                                    placeholder="Type a new password"
                                    value={formData.username}
                                    onChange={handleChange} required
                                />
                                <button className='border hover:border-[1.4px] dark:border-[#e6e9e7] focus:outline-none font-medium 
                                rounded-lg text-md px-5 py-4 sm:py-3 mb-2 focus:ring-gray-700 block w-full border-gray-800'
                                    type="submit"
                                >
                                    <span className="dark:text-[#e6e9e7] text-gray-800 flex items-center justify-center gap-2">
                                        Send OTP <BiSolidSend className="inline text-lg" />
                                    </span>
                                </button>
                            </>
                            :
                            <div className="flex flex-col gap-2 mb-4">
                                <div>
                                    <label htmlFor="verifyOtp" className="block mb-2 text-sm font-medium">Enter OTP</label>
                                    <input
                                        className='rounded-lg block w-full p-2.5 py-4 sm:py-3 text-md dark:placeholder-gray-400 
                                        dark:text-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500'
                                        id="verifyOtp"
                                        type="number"
                                        name="verifyOtp"
                                        placeholder="Enter 4-digit OTP"
                                        value={formData.email}
                                        onChange={handleChange} required
                                    />
                                </div>
                                <button className='border hover:border-[1.4px] dark:border-[#e6e9e7] focus:outline-none font-medium 
                                rounded-lg text-md px-5 py-4 sm:py-3 mb-2 focus:ring-gray-700 block w-full border-gray-800'
                                    type="submit"
                                >
                                    <span className="dark:text-[#e6e9e7] text-gray-800 flex items-center justify-center gap-2">
                                        Verify <AiOutlineSecurityScan className="inline text-lg" />
                                    </span>
                                </button>
                            </div>
                    }

                </div>

            </form>
        </div>
    )
}

export default ChangePassword