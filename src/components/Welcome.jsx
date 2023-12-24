'use client'
import { useEffect, useState } from 'react';
import '../app/signup.css'
import { useDispatch } from 'react-redux';
import { addUser } from '@/redux_features/user/userSlice';
import { useTheme } from 'next-themes';
import { MdOutlineDarkMode } from 'react-icons/md'
import { MdOutlineLightMode } from 'react-icons/md'
import { PiStickerLight } from 'react-icons/pi'
import ClipLoader from "react-spinners/SquareLoader";
import SyncLoader from "react-spinners/SyncLoader";
import ClockLoader from "react-spinners/ClockLoader";
import PuffLoader from "react-spinners/PuffLoader";
import { addTheme } from '@/redux_features/theme/themeSlice';
import Typewriter from 'typewriter-effect'
import { addPage } from '@/redux_features/pages/pageSlice';
import { changePageLoader } from '@/redux_features/reduxPageLoader/reduxPageLoaderSlice';
import Login from './Login';
import Signup from './Signup';

const Welcome = () => {
    const [isLogin, setIsLogin] = useState(false);
    //const [userCookie, setUserCookie] = useState({})
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [verificationLoading, setVerificationLoading] = useState(false)
    const [syncLoading, setSyncLoading] = useState(false)
    const [mirrorIsOtpSent, setMirrorIsOtpSent] = useState(false)

    const dispatch = useDispatch()
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        dispatch(addPage('/welcome'))
        dispatch(changePageLoader(false))
    }, [])

    function toggleTheme(mode) {
        if (mode === 'light') {
            setTheme('light')
            dispatch(addTheme('light'))
        } else if (mode === 'dark') {
            setTheme('dark')
            dispatch(addTheme('dark'))
        }
    }

    function toggleLoading(val) {
        setLoading(val)
    }

    function togglePasswordLoading(val) {
        setPasswordLoading(val)
    }

    function toggleVerificationLoading(val) {
        setVerificationLoading(val)
    }

    function toggleSyncLoading(val) {
        setSyncLoading(val)
    }

    function toggleIsLogin(val) {
        setIsLogin(val)
    }

    function toggleMirrorIsOtpSent(val) {
        setMirrorIsOtpSent(val)
    }

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-0 justify-center items-center 
        ${mirrorIsOtpSent ? 'mt-4 sm:-mt-4 ' : '-mt-4'}`}>
            <div className='text-center flex flex-col justify-center items-center'>
                <div className={`${mirrorIsOtpSent ? 'mb-0 sm:mb-8' : 'mb-6 sm:mb-8'}`}>
                    {
                        theme === 'light' ?
                            <MdOutlineDarkMode
                                className="text-4xl font-light text-gray-500 hover:text-black cursor-pointer"
                                onClick={() => toggleTheme('dark')} /> :
                            <MdOutlineLightMode
                                className="text-4xl font-light hover:text-gray-400 cursor-pointer"
                                onClick={() => toggleTheme('light')} />
                    }
                </div>
                <div className={`text-3xl italic ${mirrorIsOtpSent && 'hidden sm:block'}`}>
                    <Typewriter
                        onInit={(typewritter) => {
                            typewritter
                                .typeString('Stickify')
                                .pauseFor(1000)
                                .deleteAll()
                                .typeString('Create')
                                .pauseFor(1000)
                                .deleteAll()
                                .typeString('Generate')
                                .pauseFor(1000)
                                .deleteAll()
                                .typeString('Share')
                                .pauseFor(1000)
                                .deleteAll()
                                .start()
                        }}
                        options={{
                            delay: 100,
                            loop: true,

                        }}
                    />
                </div>
                <p
                    className={`dark:text-gray-300 ${mirrorIsOtpSent && 'hidden sm:block'}`}>Your AI sticker-notes
                    <span><PiStickerLight className='ml-1 inline text-xl' /></span>
                </p>
            </div>
            {
                !isLogin ?
                    <Signup
                        toggleLoading={toggleLoading}
                        togglePasswordLoading={togglePasswordLoading}
                        toggleVerificationLoading={toggleVerificationLoading}
                        toggleSyncLoading={toggleSyncLoading}
                        theme={theme} toggleMirrorIsOtpSent={toggleMirrorIsOtpSent}
                        toggleIsLogin={toggleIsLogin}
                    />
                    :
                    <Login
                        toggleLoading={toggleLoading}
                        toggleSyncLoading={toggleSyncLoading}
                        theme={theme} toggleIsLogin={toggleIsLogin} isLogin={isLogin}
                    />
            }
            {loading &&
                <div
                    className={`modal-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap -mt-6`}>
                    <ClipLoader
                        color="#3f3f46"
                        loading='Welcome...'
                        //cssOverride={override}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    {/* <div className="text-2xl mt-5 font-bold text-[#ac3232]">
                        Loggin in...
                    </div> */}
                </div>
            }
            {syncLoading &&
                <div
                    className={`modal-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap`}>
                    <SyncLoader
                        color={`${theme === 'dark' ? '#51f770' : '#35a149'}`}
                        loading='Generating...'
                        //cssOverride={override}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    <div className="text-2xl mt-6 font-bold text-[#35a149] dark:text-[#51f770]">
                        Syncing...
                    </div>
                </div>
            }
            {passwordLoading &&
                <div
                    className={`modal-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap`}>
                    <ClockLoader
                        color={`${theme === 'dark' ? '#51f770' : '#35a149'}`}
                        loading='Generating...'
                        //cssOverride={override}
                        size={80}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={3}
                    />
                    <div className="text-2xl mt-6 font-bold text-[#35a149] dark:text-[#51f770]">
                        Sending email...
                    </div>
                </div>
            }
            {verificationLoading &&
                <div
                    className={`modal-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap`}>
                    <PuffLoader
                        color={`${theme === 'dark' ? '#51f770' : '#35a149'}`}
                        loading='Generating...'
                        //cssOverride={override}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    <div className="text-2xl mt-6 font-bold text-[#35a149] dark:text-[#51f770]">
                        Verifying...
                    </div>
                </div>
            }
        </div>
    )
}

export default Welcome