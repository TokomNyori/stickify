import { useEffect, useState } from "react";
import Image from "next/image"
import BoyAvatar1 from '@/assets/avatars/boy1.jpeg'
import BoyAvatar2 from '@/assets/avatars/boy2.jpeg'
import GirlAvatar1 from '@/assets/avatars/girl1.jpeg'
import GirlAvatar2 from '@/assets/avatars/girl2.jpeg'
import AnonymousAvatar from '@/assets/avatars/anonymous.jpeg'
import Emma from '@/assets/avatars/Emma.jpeg'
import Martha from '@/assets/avatars/Martha.jpeg'
import Kylie from '@/assets/avatars/Kylie.jpeg'
import David from '@/assets/avatars/David.jpeg'
import { AiOutlineSecurityScan } from 'react-icons/ai'
import { BiSolidSend } from 'react-icons/bi'
import { IoAddSharp } from "react-icons/io5";
import { editSelfHelper } from "@/helper/httpHelpers/httpUserHelper"
import toast, { Toaster } from 'react-hot-toast';
import Lottie from 'lottie-react'
import otpverifyAni from '@/assets/others/otpverifyAni.json'
import { existingUserOtpVerify } from "@/helper/nodemailer/handleOTPhelper";
import AvatarsManage from "./AvatarsManage";


const ChangeProfile = ({ user, getUserCookie, toggleLoading, theme, toggleVerificationLoading, togglePasswordLoading }) => {
    const [formData, setFormData] = useState({
        avatar: '',
        username: '',
        email: '',
        password: '',
        verifyOtp: '',
        operation: 'edit-profile'
    });
    const [isAvatar, setIsAvatar] = useState(true)
    const [passwordStage, setPasswordStage] = useState(false)
    const [stages, setStages] = useState('default')
    const [isOtpSent, setIsOtpSent] = useState(false);

    const RESEND_INTERVAL = 60; // Resend interval in seconds (60 for 1 minute)
    const MAX_RESEND_COUNT = 3; // Maximum number of resends allowed
    const [timer, setTimer] = useState(RESEND_INTERVAL);
    const [canResend, setCanResend] = useState(false);
    const [resendCount, setResendCount] = useState(0);

    const [avatarModalState, setAvatarModalState] = useState(false)

    useEffect(() => {
        setFormData({
            avatar: user.avatar,
            username: user.username,
            email: user.email,
            password: '',
            verifyOtp: '',
            operation: 'edit-profile',
        })
    }, [user])

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
        if (name === 'avatar') {
            setIsAvatar(true)
        }
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

        if (!formData.password) {
            toast.error("Please enter your password.");
            return;
        }

        toggleVerificationLoading(true)

        const verify = {
            ...formData,
            userid: user._id,
            operation: 'verification',
        };

        const data = {
            ...formData,
            subject: 'Email Reset Confirmation',
            text: `To confirm your email reset, please use this One-Time Password:`,
            userid: user._id,
        };

        try {
            const verification = await editSelfHelper(
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    id: user._id,
                    body: verify,
                })

            if (verification.message === 'Successfully updated') {
                toggleVerificationLoading(false)
                toggleLoading(true)
                changeStages(e, 'default')
                getUserCookie()
                setTimeout(() => {
                    toggleLoading(false)
                    toast.success(verification.message)
                }, 1000);
                return;
            }

            toggleVerificationLoading(false)
            togglePasswordLoading(true)

            const res = await existingUserOtpVerify({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: data,
            })

            togglePasswordLoading(false)
            changeStages(e, 'otp')
            setIsOtpSent(true)

            toast.success(`OTP sent to ${formData.email}`, {
                duration: 4000,
            })

            // Reset timer and increment resend count
            setTimer(RESEND_INTERVAL);
            setCanResend(false);
            setResendCount(count => count + 1);
            //setIsOtpSent(true);

        } catch (error) {
            toggleVerificationLoading(false)
            togglePasswordLoading(false)
            toast.error(error.message, {
                duration: 3000,
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        toggleVerificationLoading(true)
        try {
            const res = await editSelfHelper(
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    id: user._id,
                    body: formData,
                })
            toggleVerificationLoading(false)
            toggleLoading(true)
            changeStages(e, 'default')
            getUserCookie()
            setTimeout(() => {
                toggleLoading(false)
                toast.success(res.message)
            }, 1000);
        } catch (error) {
            toggleVerificationLoading(false)
            console.log(error)
            toast.error(error.message)
        }
    }

    // function changeToPasswordStage(e) {
    //     e.preventDefault()
    //     setPasswordStage(true)
    // }

    function changeStages(e, stage) {
        e.preventDefault()
        if (stage === 'password') {
            // Validation for Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error("Please enter a valid email address.");
                return;
            }
        }

        setStages(stage);
    }

    function toggleAvatarModalState() {
        setAvatarModalState(prev => !prev)
    }


    // JSXs
    const renderDefaultStage = () => (
        <>
            <div className='avatars'>
                <div className="radio-inputs mb-4 flex justify-center gap-3 mt-2">
                    <div>
                        <input type="radio" id="Kylie" name="avatar" className={`hidden manage-radio-btn ${theme}`}
                            value="Kylie" onChange={handleChange} checked={formData.avatar === 'Kylie'}
                        />
                        <label htmlFor="Kylie"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px] hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Kylie} width={400} height={400} className='rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Emma" name="avatar" className={`hidden manage-radio-btn ${theme}`}
                            value="Emma"
                            onChange={handleChange} checked={formData.avatar === 'Emma'}
                        />
                        <label htmlFor="Emma"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px] hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Emma} width={400} height={400} className='rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="David" name="avatar" className={`hidden manage-radio-btn ${theme}`}
                            value="David"
                            onChange={handleChange} checked={formData.avatar === 'David'}
                        />
                        <label htmlFor="David"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px] hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={David} width={400} height={400} className='rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Martha" name="avatar" className={`hidden manage-radio-btn ${theme}`}
                            value="Martha"
                            onChange={handleChange} checked={formData.avatar === 'Martha'}
                        />
                        <label htmlFor="Martha"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px] hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Martha} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    {/* <div>
                        <input type="radio" id="anonymousOne" name="avatar" className={`hidden manage-radio-btn ${theme}`}
                            value="anonymous"
                            onChange={handleChange} checked={formData.avatar === 'anonymous'}
                        />
                        <label htmlFor="anonymousOne"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px] hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={AnonymousAvatar} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div> */}
                    <div
                        className="w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px] flex justify-center items-center hover:scale-110 transition-transform 
                                            duration-200 ease-in-out cursor-pointer"
                        onClick={toggleAvatarModalState}
                    >
                        <IoAddSharp
                            className="text-[2.15rem] sm:text-[1.7rem]"
                        />
                    </div>
                </div>
            </div>
            <div className="input-section flex flex-col gap-2 mb-4">
                <input
                    className='rounded-xl block w-full 
                                    p-2.5 py-4 sm:py-3 text-md dark:placeholder-gray-400 dark:text-gray-100 
                                dark:bg-zinc-800 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500'
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange} required
                />
                <input
                    className='rounded-xl block w-full 
                                    p-2.5 py-4 sm:py-3 text-md dark:placeholder-gray-400 dark:text-gray-100 
                                    dark:bg-zinc-800 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500'
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange} required
                />
            </div>
            <button className='border hover:border-[1.4px] dark:border-gray-100 focus:outline-none font-medium 
                                rounded-xl text-md px-5 py-4 sm:py-3 mb-2 focus:ring-gray-700 block w-full border-zinc-800'
                type="button" onClick={(e) => changeStages(e, 'password')}
            >
                <span className="dark:text-gray-100 text-gray-800">Save</span>
            </button>
            <AvatarsManage handleChange={handleChange} formData={formData} avatarModalState={avatarModalState} theme={theme}
                toggleAvatarModalState={toggleAvatarModalState} />
        </>
    );

    const renderPasswordStage = () => (
        <div className="flex flex-col gap-4 mt-4">
            <input
                className='rounded-xl block w-full 
                                    p-2.5 py-4 sm:py-3 text-md dark:placeholder-gray-400 dark:text-gray-100 
                                    dark:bg-zinc-800 bg-white shadow-sm 
                                focus:ring-blue-500 focus:border-blue-500'
                type="password"
                name="password"
                placeholder="Enter Current Password"
                value={formData.password}
                onChange={handleChange} required
            />
            <button className='border hover:border-[1.4px] dark:border-gray-100 
                                focus:outline-none font-medium 
                                rounded-xl text-md px-5 py-4 sm:py-3 mb-2 focus:ring-gray-700 block w-full border-zinc-800'
                type="button" onClick={handleOtp}
            >
                <span className="dark:text-gray-100 text-gray-800 flex items-center justify-center gap-2">
                    Verify Password <AiOutlineSecurityScan className="inline text-lg" />
                </span>
            </button>
        </div>
    );

    const renderOtpStage = () => (
        <div className="flex flex-col gap-4 mt-4 items-center">
            <div className="text-xl -mt-2 font-bold text-center">
                {/* <Lottie className="text-sm" animationData={otpverifyAni} loop={true} /> */}
                Verify your email
            </div>
            <div className='text-center'>
                We sent an OTP to
                <div className="">
                    {formData.email}
                </div>
            </div>
            <input
                className='rounded-xl block w-full p-2.5 py-4 sm:py-3 text-md dark:placeholder-gray-400 
                                        dark:text-gray-100 dark:bg-zinc-800 bg-white shadow-sm 
                                        focus:ring-blue-500 focus:border-blue-500'
                id="verifyOtp"
                type="number"
                name="verifyOtp"
                placeholder="Enter 6-digit OTP"
                value={formData.verifyOtp}
                onChange={handleChange} required
            />
            <button className='border hover:border-[1.4px] dark:border-gray-100
                                focus:outline-none font-medium mt-1
                                rounded-xl text-md px-5 py-4 sm:py-3 mb-2 focus:ring-gray-700 block w-full border-zinc-800'
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
    );

    console.log(formData)

    return (
        <div className="w-[85%] lg:w-[30%] sm:w-[60%]">
            <form className="" onSubmit={handleSubmit} >
                {stages === 'password' && renderPasswordStage()}
                {stages === 'otp' && renderOtpStage()}
                {stages !== 'password' && stages !== 'otp' && renderDefaultStage()}
            </form>
        </div>
    )
}

export default ChangeProfile