'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signupHelper } from '@/helper/httpHelpers/httpUserHelper';
import Image from 'next/image';
import Kylie from '@/assets/avatars/Kylie.jpeg'
import David from '@/assets/avatars/David.jpeg'
import Elezabeth from '@/assets/avatars/Elezabeth.jpeg'
import Charlotte from '@/assets/avatars/Charlotte.jpeg'
import toast, { Toaster } from 'react-hot-toast';
import { newUserOtpVerify } from '@/helper/nodemailer/handleOTPhelper';
import Lottie from 'lottie-react'
import otpverifyAni from '@/assets/others/otpverifyAni.json'
import { AiOutlineSecurityScan } from 'react-icons/ai'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IoAddSharp } from "react-icons/io5";
import AvatarsModal from './AvatarsModal';

const ModalSignup = (
    {
        toggleLoading, togglePasswordLoading, toggleVerificationLoading, toggleSyncLoading, theme, toggleIsLogin, toggleMirrorIsOtpSent,
        changeModalWelcomeState, modalWelcomeRef, getUserCookie, changeSyncLoader
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
    const [avatarModalState, setAvatarModalState] = useState(false)

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
            if (res.body.otpSent === false) {
                toast.success('Fake', {
                    duration: 4000,
                })
                //return
            }
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
            changeModalWelcomeState(false)
            toggleVerificationLoading(false)

            // Stop the timer and prevent further OTP resends
            setIsOtpSent(false)
            setCanResend(false);
            setTimer(0);

            setFormData({
                avatar: '',
                username: '',
                email: '',
                password: '',
                verifyOtp: '',
            })

            changeSyncLoader(true)
            getUserCookie()

            setTimeout(() => {
                changeSyncLoader(false)
                toast.success(res.message, {
                    duration: 3000
                })
            }, 2000);
        } catch (error) {
            toggleVerificationLoading(false)
            toast.error(error.message, {
                duration: 4000
            })
        }
    }

    function toggleAvatarModalState() {
        setAvatarModalState(prev => !prev)
    }

    console.log(formData)

    return (
        <div className={`signup-form-container2 bg-zinc-900 shadow-2xl rounded-3xl
        text-zinc-100`}
            ref={modalWelcomeRef}
        >
            <div className='flex justify-between items-center mb-4'>
                <div className='inline opacity-0'>
                    <AiOutlineCloseCircle className={`sm:text-3xl text-4xl`} />
                </div>
                <div className={`text-lg ${isOtpSent && 'glow-texts'}`}>
                    {isOtpSent ? 'Verify your email' : 'Sign Up to Unlock 🌟⚡'}
                </div>
                <div className='inline'
                    onClick={() => changeModalWelcomeState(false)}
                >
                    <AiOutlineCloseCircle className={`sm:text-3xl text-4xl hover:text-red-400`} />
                </div>
            </div>
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
                                className='rounded-xl block w-full p-2.5 py-4 sm:py-3 text-md placeholder-gray-400 
                                text-zinc-100 dbg-zinc-800 shadow-md
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
                            <div className='avatars'>
                                {/* <p className='text-md text-center'>Select an avatar</p> */}
                                <p className={`text-sm font-light text-red-400 ${isAvatar && 'hidden'}`}>Please select an avatar</p>
                                <div className="radio-inputs mb-1 flex justify-center gap-3 mt-2">
                                    <div>
                                        <input type="radio" id="Kylie" name="avatar"
                                            className={`hidden modal-signup-radio-btn ${theme}`}
                                            value="Kylie"
                                            onChange={handleChange} checked={formData.avatar === 'Kylie'}
                                        />
                                        <label htmlFor="Kylie"
                                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                            <Image src={Kylie} width={400} height={400} className='rounded-full' />
                                        </label>
                                    </div>
                                    <div>
                                        <input type="radio" id="Charlotte" name="avatar"
                                            className={`hidden modal-signup-radio-btn ${theme}`}
                                            value="Charlotte"
                                            onChange={handleChange} checked={formData.avatar === 'Charlotte'}
                                        />
                                        <label htmlFor="Charlotte"
                                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                            <Image src={Charlotte} width={400} height={400} className='rounded-full' />
                                        </label>
                                    </div>
                                    <div>
                                        <input type="radio" id="David" name="avatar"
                                            className={`hidden modal-signup-radio-btn ${theme}`}
                                            value="David"
                                            onChange={handleChange} checked={formData.avatar === 'David'}
                                        />
                                        <label htmlFor="David"
                                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                            <Image src={David} width={400} height={400} className='rounded-full' />
                                        </label>
                                    </div>
                                    <div>
                                        <input type="radio" id="Elezabeth" name="avatar"
                                            className={`hidden modal-signup-radio-btn ${theme}`}
                                            value="Elezabeth"
                                            onChange={handleChange} checked={formData.avatar === 'Elezabeth'}
                                        />
                                        <label htmlFor="Elezabeth"
                                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                            <Image src={Elezabeth} width={400} height={400} className=' rounded-full' />
                                        </label>
                                    </div>
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
                            <input
                                className={`rounded-xl bg-zinc-800 block w-full placeholder-zinc-500
                                            p-2.5 py-4 sm:py-3 text-md focus:ring-blue-500 focus:border-blue-500`}
                                type="text"
                                name="username"
                                placeholder="Full name"
                                value={formData.username}
                                onChange={handleChange} required
                            />
                            <input
                                className={`rounded-xl bg-zinc-800 block w-full placeholder-zinc-500
                                p-2.5 py-4 sm:py-3 text-md focus:ring-blue-500 focus:border-blue-500 
                                    ${invalidEmailPattern ?
                                        'border border-red-500 focus:ring-red-500 focus:ring-1 focus:outline-none' : 'border-none'}`}
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange} required
                            />
                            <input
                                className={`rounded-xl bg-zinc-800 block w-full placeholder-zinc-500
                                p-2.5 py-4 sm:py-3 text-md focus:ring-blue-500 focus:border-blue-500
                                    ${invalidPasswordPattern ?
                                        'border border-red-500 focus:ring-red-500 focus:ring-1 focus:outline-none' : 'border-none'}`}
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange} required
                            />
                            <button className='border border-gray-100 focus:outline-none font-medium rounded-xl text-md px-5 py-4 
                                    sm:py-3 mb-2 text-whiteborder-gray-600 hover:border-[1.4px]
                                    focus:ring-gray-700 block w-full '
                                type="button" onClick={handleOtp}
                            >
                                Sign Up
                            </button>
                        </>
                    }
                </div>
            </form>
            <button className={`border border-gray-100 focus:outline-none font-medium rounded-xl text-md px-5 py-4 
                sm:py-3 mb-2 text-whiteborder-gray-600  hover:border-[1.4px]
                            focus:ring-gray-700 block w-full ${isOtpSent && 'hidden'}`}
                onClick={() => toggleIsLogin(true)}
            >
                Already have an account?
            </button>
            <AvatarsModal toggleAvatarModalState={toggleAvatarModalState} avatarModalState={avatarModalState}
                formData={formData} handleChange={handleChange} theme={theme} />
        </div>
    )
}

export default ModalSignup