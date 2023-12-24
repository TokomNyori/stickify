'use client'
import { useEffect, useRef, useState } from 'react';
import '@/app/signup.css'
import { useDispatch } from 'react-redux';
import { addUser } from '@/redux_features/user/userSlice';
import ClipLoader from "react-spinners/SquareLoader";
import SyncLoader from "react-spinners/SyncLoader";
import ClockLoader from "react-spinners/ClockLoader";
import PuffLoader from "react-spinners/PuffLoader";
import { addTheme } from '@/redux_features/theme/themeSlice';
import { addPage } from '@/redux_features/pages/pageSlice';
import { changePageLoader } from '@/redux_features/reduxPageLoader/reduxPageLoaderSlice';
import ModalSignup from "./ModalSignup";
import ModalLogin from "./ModalLogin";

const ModalWelcome = ({
    modalWelcomeState, changeModalWelcomeState, getUserCookie, changeSyncLoader, changeSquareLoader,
    squareLoader, theme,
}) => {
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [verificationLoading, setVerificationLoading] = useState(false)
    const [syncLoading, setSyncLoading] = useState(false)
    const [mirrorIsOtpSent, setMirrorIsOtpSent] = useState(false)

    const modalWelcomeRef = useRef(null)

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalWelcomeRef.current && !modalWelcomeRef.current.contains(event.target)) {
                if (!verificationLoading && !passwordLoading) {
                    changeModalWelcomeState(false)
                }
            }
        };

        if (modalWelcomeState) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [modalWelcomeState, verificationLoading, passwordLoading]);

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
        setTimeout(() => {
            setIsLogin(val)
        }, 20);
    }

    function toggleMirrorIsOtpSent(val) {
        setMirrorIsOtpSent(val)
    }

    return (
        <div
            className={`modal-blur top-0 inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center
                        ${modalWelcomeState ? "fix-modal" : "hidden"} flex-wrap dark:brightness-[85%]`}
        >
            {
                !isLogin ?
                    <ModalSignup
                        toggleLoading={toggleLoading}
                        togglePasswordLoading={togglePasswordLoading}
                        toggleVerificationLoading={toggleVerificationLoading}
                        toggleSyncLoading={toggleSyncLoading}
                        theme={theme} toggleMirrorIsOtpSent={toggleMirrorIsOtpSent}
                        toggleIsLogin={toggleIsLogin}
                        changeModalWelcomeState={changeModalWelcomeState}
                        modalWelcomeRef={modalWelcomeRef}
                        getUserCookie={getUserCookie}
                        changeSyncLoader={changeSyncLoader}
                    />
                    :
                    <ModalLogin
                        toggleLoading={toggleLoading}
                        toggleSyncLoading={toggleSyncLoading}
                        theme={theme} toggleIsLogin={toggleIsLogin} isLogin={isLogin}
                        changeModalWelcomeState={changeModalWelcomeState}
                        modalWelcomeRef={modalWelcomeRef}
                        getUserCookie={getUserCookie}
                        changeSyncLoader={changeSyncLoader}
                    />
            }

            {/* Loaders */}
            {loading &&
                <div
                    className={`restricted-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
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
                    className={`restricted-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap`}>
                    <SyncLoader
                        color={`#51f770`}
                        loading='Generating...'
                        //cssOverride={override}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    <div className="text-2xl mt-6 font-bold text-[#51f770]">
                        Syncing...
                    </div>
                </div>
            }
            {passwordLoading &&
                <div
                    className={`restricted-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap`}>
                    <ClockLoader
                        color={`#51f770`}
                        loading='Generating...'
                        //cssOverride={override}
                        size={80}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    <div className="text-2xl mt-6 font-bold text-[#51f770]">
                        Sending email...
                    </div>
                </div>
            }
            {verificationLoading &&
                <div
                    className={`restricted-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap`}>
                    <PuffLoader
                        color={`#51f770`}
                        loading='Generating...'
                        //cssOverride={override}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    <div className="text-2xl mt-6 font-bold text-[#51f770]">
                        Verifying...
                    </div>
                </div>
            }
        </div>
    )
}

export default ModalWelcome