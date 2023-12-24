'use client'
import { CookieHelper } from "@/helper/httpHelpers/httpCookieHelper"
import { addUser } from "@/redux_features/user/userSlice"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { addPage } from "@/redux_features/pages/pageSlice"
import { AiFillProfile } from 'react-icons/ai'
import { AiOutlineProfile } from 'react-icons/ai'
import { PiPasswordDuotone } from 'react-icons/pi'
import { PiPasswordFill } from 'react-icons/pi'
import toast, { Toaster } from 'react-hot-toast';
import ClipLoader from "react-spinners/SyncLoader";
import ClockLoader from "react-spinners/ClockLoader";
import PuffLoader from "react-spinners/PuffLoader";

import { useTheme } from "next-themes"
import ChangeProfile from "./others/ChangeProfile"
import ChangePassword from "./others/ChangePassword"
import { changePageLoader } from "@/redux_features/reduxPageLoader/reduxPageLoaderSlice"

const ManageProfile = () => {
    const user = useSelector(state => state.user.users)
    const [operation, setOperation] = useState('edit-profile')
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [verificationLoading, setVerificationLoading] = useState(false)

    const { theme, setTheme } = useTheme()

    useEffect(() => {
        //getUserCookie()
        dispatch(changePageLoader(false))
        dispatch(addPage('manage-profile'))
    }, [])

    async function getUserCookie() {
        try {
            const res = await CookieHelper()
            dispatch(addUser(res.body))
        } catch (error) {
            console.log('CookieHelper Error')
            console.log(error.message)
        }
    }

    function changeOperation(operation) {
        if (operation === 'edit-password') {
            setOperation('edit-password')
        } else {
            setOperation('edit-profile')
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

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="mb-8">Manage profile</div>
            <div className="flex justify-center items-center gap-10 mb-5">
                <div className={`text-green-500 flex justify-center items-center gap-1 cursor-pointer text-lg
                ${operation === 'edit-profile' ? 'border-b border-green-500' : ''}`}
                    onClick={() => changeOperation('edit-profile')}
                >
                    {operation === 'edit-profile' ?
                        <AiFillProfile className="inline" /> :
                        <AiOutlineProfile className="inline" />
                    }
                    Profile
                </div>
                <div className={`text-blue-500 flex justify-center items-center gap-1 cursor-pointer text-lg
                ${operation === 'edit-password' ? 'border-b border-blue-500' : ''}`}
                    onClick={() => changeOperation('edit-password')}
                >
                    {operation === 'edit-password' ?
                        <PiPasswordFill className="inline text-xl" /> :
                        <PiPasswordDuotone className="inline text-xl" />
                    }
                    Password
                </div>
            </div>
            {
                operation === 'edit-profile' ?
                    <ChangeProfile user={user} getUserCookie={getUserCookie} toggleLoading={toggleLoading} theme={theme}
                        toggleVerificationLoading={toggleVerificationLoading} togglePasswordLoading={togglePasswordLoading}
                    />
                    :
                    <ChangePassword user={user} getUserCookie={getUserCookie} toggleVerificationLoading={toggleVerificationLoading}
                        togglePasswordLoading={togglePasswordLoading} toggleLoading={toggleLoading} theme={theme}
                    />
            }

            {/* <Toaster /> */}
            {loading &&
                <div
                    className={`modal-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap`}>
                    <ClipLoader
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
                        Sending OTP...
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

export default ManageProfile