'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signupHelper } from '@/helper/httpHelpers/httpUserHelper';
import Image from 'next/image';
import BoyAvatar1 from '@/assets/avatars/boy1.jpeg'
import BoyAvatar2 from '@/assets/avatars/boy2.jpeg'
import GirlAvatar1 from '@/assets/avatars/girl1.jpeg'
import GirlAvatar2 from '@/assets/avatars/girl2.jpeg'
import AnonymousAvatar from '@/assets/avatars/anonymous.jpeg'
import toast, { Toaster } from 'react-hot-toast';
import { newUserOtpVerify } from '@/helper/nodemailer/handleOTPhelper';
import Lottie from 'lottie-react'
import otpverifyAni from '@/assets/others/otpverifyAni.json'
import { AiOutlineSecurityScan } from 'react-icons/ai'

const Signup = (
    {
        toggleLoading, togglePasswordLoading, toggleVerificationLoading, toggleSyncLoading, theme, toggleIsLogin, toggleMirrorIsOtpSent
    }
) => {

    const [formData, setFormData] = useState({
        avatar: '',
        username: '',
        email: '',
        password: '',
        verifyOtp: '',
    });
    const [isAvatar, setIsAvatar] = useState(true)
    const [isOtpSent, setIsOtpSent] = useState(false);

    const RESEND_INTERVAL = 60; // Resend interval in seconds (60 for 1 minute)
    const MAX_RESEND_COUNT = 3; // Maximum number of resends allowed
    const [timer, setTimer] = useState(RESEND_INTERVAL);
    const [canResend, setCanResend] = useState(false);
    const [resendCount, setResendCount] = useState(0);

    const [invalidEmailPattern, setInvalidEmailPattern] = useState(false)
    const [invalidPasswordPattern, setInvalidPasswordPattern] = useState(false)

    const router = useRouter()

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

    useEffect(() => {
        if (invalidEmailPattern) {
            // Turn InvalidEmailPattern to false if email is valid
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(formData.email)) {
                setInvalidEmailPattern(false)
            }
        }
        if (invalidPasswordPattern) {
            // Turn InvalidPasswordPattern to false if password is valid
            if (formData.password.length >= 6) {
                setInvalidPasswordPattern(false)
            }
        }
    }, [formData])

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


    // Handle OTP logic here
    const handleOtp = async (e) => {
        e.preventDefault()

        // Check if any required field is empty
        if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!formData.avatar) {
            setIsAvatar(false)
            toast.error(`Please select an avatar`, {
                icon: '🤖',
                duration: 3000,
            })
            return
        }

        // Validation for Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setInvalidEmailPattern(true)
            toast.error("Please enter a valid email address.");
            return;
        }

        // Validation for Password Length
        if (formData.password.length < 6) {
            setInvalidPasswordPattern(true)
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (resendCount >= MAX_RESEND_COUNT) {
            toast.error("Maximum OTP resend attempts reached.");
            return;
        }

        togglePasswordLoading(true)

        const data = {
            subject: 'Email Verification for Your Account',
            text: `Thank you for registering with us. To complete your email verification, 
            please use the following One-Time Password.`,
            // Additional fields or information can be added here as needed
            email: formData.email,
        };

        try {
            const res = await newUserOtpVerify({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: data,
            })
            togglePasswordLoading(false)
            // if (res.body.otpSent === false) {
            //     toast.success('Fake OTP', {
            //         duration: 4000,
            //     })
            //     return
            // }
            setIsOtpSent(true)
            toggleMirrorIsOtpSent(true)
            toast.success(`We sent an email to ${formData.email}`, {
                duration: 4000,
            })

            // Reset timer and increment resend count
            setTimer(RESEND_INTERVAL);
            setCanResend(false);
            setResendCount(count => count + 1);
            //setIsOtpSent(true);

        } catch (error) {
            togglePasswordLoading(false)
            toast.error(error.message, {
                duration: 3000,
            })
        }
    }

    // Handle Signup logic here
    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleVerificationLoading(true)

        try {
            const res = await signupHelper({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: formData
            })
            //localStorage.setItem('userData', JSON.stringify(res.body))
            toggleVerificationLoading(false)
            // Stop the timer and prevent further OTP resends
            setCanResend(false);
            setTimer(0);

            toggleLoading(true)

            setFormData({
                avatar: '',
                username: '',
                email: '',
                password: '',
            })
            router.push('/')
            setTimeout(() => {
                toggleLoading(false)
                toast.success(res.message, {
                    duration: 3000
                })
            }, 1000);
        } catch (error) {
            toggleVerificationLoading(false)
            toast.error(error.message, {
                duration: 4000
            })
        }
    }

    return (
        <div className={`signup-form-container sm:ml-12 rounded-3xl
        text-gray-800 dark:text-gray-300 ${isOtpSent ? 'mt-0 sm:mt-10' : 'mt-0 sm:mt-0  '}`}
        >
            <h1 className={`text-lg ${isOtpSent && 'glow-texts'}`}>
                {isOtpSent ? 'Verify your email' : 'Sign Up'}
            </h1>
            <form onSubmit={handleSubmit}>
                <div className='input-group flex flex-col gap-3 w-full'>
                    {isOtpSent ?
                        <div className="flex flex-col gap-3 mb-4 items-center">
                            <div className="text-2xl -mt-2 font-bold text-[#f1f5f9] w-[55%] sm:w-[40%]">
                                <Lottie className="text-sm" animationData={otpverifyAni} loop={true} />
                            </div>
                            <div className='text-center'>
                                We sent an email to
                                <div className="">
                                    {formData.email}
                                </div>
                            </div>
                            <input
                                className='rounded-xl block w-full p-2.5 py-4 sm:py-3 text-md dark:placeholder-gray-500 
                                dark:text-zinc-100 dark:bg-zinc-800 bg-white shadow-md  placeholder-gray-400 
                                focus:ring-blue-500 focus:border-blue-500'
                                id="SignupVerifyOtp"
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
                                <span className="dark:text-zinc-100 text-zinc-800 flex items-center justify-center gap-2">
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
                        :
                        // If OTP is not sent, show the signup form
                        <>
                            <div className='avatars flex flex-col items-center justify-center'>
                                {/* <p className='text-md mb-1'>Select an avatar</p> */}
                                <p className={`text-sm font-light text-red-400 ${isAvatar && 'hidden'}`}>Please select an avatar</p>
                                <div className="radio-inputs mb-1 flex gap-3 mt-2">
                                    <div>
                                        <input type="radio" id="boy1" name="avatar"
                                            className={`hidden signup-radio-btn ${theme}`}
                                            value="boy1"
                                            onChange={handleChange} checked={formData.avatar === 'boy1'}
                                        />
                                        <label htmlFor="boy1"
                                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                            <Image src={BoyAvatar1} width={400} height={400} className='rounded-full' />
                                        </label>
                                    </div>
                                    <div>
                                        <input type="radio" id="girl1" name="avatar"
                                            className={`hidden signup-radio-btn ${theme}`}
                                            value="girl1"
                                            onChange={handleChange} checked={formData.avatar === 'girl1'}
                                        />
                                        <label htmlFor="girl1"
                                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                            <Image src={GirlAvatar1} width={400} height={400} className='rounded-full' />
                                        </label>
                                    </div>
                                    <div>
                                        <input type="radio" id="boy2" name="avatar"
                                            className={`hidden signup-radio-btn ${theme}`}
                                            value="boy2"
                                            onChange={handleChange} checked={formData.avatar === 'boy2'}
                                        />
                                        <label htmlFor="boy2"
                                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                            <Image src={BoyAvatar2} width={400} height={400} className='rounded-full' />
                                        </label>
                                    </div>
                                    <div>
                                        <input type="radio" id="girl2" name="avatar"
                                            className={`hidden signup-radio-btn ${theme}`}
                                            value="girl2"
                                            onChange={handleChange} checked={formData.avatar === 'girl2'}
                                        />
                                        <label htmlFor="girl2"
                                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                            <Image src={GirlAvatar2} width={400} height={400} className=' rounded-full' />
                                        </label>
                                    </div>
                                    <div>
                                        <input type="radio" id="anonymous" name="avatar"
                                            className={`hidden signup-radio-btn ${theme}`}
                                            value="anonymous"
                                            onChange={handleChange} checked={formData.avatar === 'anonymous'}
                                        />
                                        <label htmlFor="anonymous"
                                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                            <Image src={AnonymousAvatar} width={400} height={400} className=' rounded-full' />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <input
                                className={`rounded-xl dark:border-zinc-600 block w-full p-2.5 py-4 sm:py-3 text-md 
                                focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-500 dark:text-zinc-100
                                dark:bg-zinc-800 bg-white shadow-md  placeholder-gray-400`}
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange} required
                            />
                            <input
                                className={`rounded-xl block w-full p-2.5 py-4 sm:py-3 text-md 
                                dark:placeholder-gray-500 dark:text-zinc-100
                                dark:bg-zinc-800 bg-white shadow-md  placeholder-gray-400 
                                    ${invalidEmailPattern ?
                                        'border border-red-500 focus:ring-red-500 focus:ring-1 focus:outline-none' : 'border-none'}`}
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange} required
                            />
                            <input
                                className={`rounded-xl  block w-full p-2.5 py-4 sm:py-3 text-md 
                                dark:placeholder-gray-500 dark:text-zinc-100
                                dark:bg-zinc-800 bg-white shadow-md  placeholder-gray-400
                                    ${invalidPasswordPattern ?
                                        'border border-red-500 focus:ring-red-500 focus:ring-1 focus:outline-none' : 'border-none'}`}
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange} required
                            />
                            <button className='border hover:border-[1.4px] dark:border-gray-100
                                focus:outline-none font-medium mt-1
                                rounded-xl text-md px-5 py-4 sm:py-3 mb-2 focus:ring-gray-700 block w-full border-zinc-800'
                                type="button" onClick={handleOtp}
                            >
                                Sign Up
                            </button>
                        </>
                    }
                </div>
            </form>
            <button className={`border hover:border-[1.4px] dark:border-gray-100 focus:outline-none font-medium mt-1
                                rounded-xl text-md px-5 py-4 sm:py-3 mb-2 focus:ring-gray-700 block w-full 
                                border-zinc-800 ${isOtpSent && 'hidden'}`}
                onClick={() => toggleIsLogin(true)}
            >
                Already have an account?
            </button>
        </div>
    )
}

export default Signup