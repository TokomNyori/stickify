'use client'
import Link from "next/link"
import { IoAddOutline } from "react-icons/io5";
import { GoHome } from 'react-icons/go'
import { BiLogInCircle } from 'react-icons/bi'
import { RiAccountCircleLine } from 'react-icons/ri'
import { BsGlobeAmericas } from 'react-icons/bs'
import { BiCog } from 'react-icons/bi'
import { AiOutlineLogout } from 'react-icons/ai'
import { useEffect, useRef, useState } from "react";
import ModalMain from "./modals/ModalMain";
import Image from "next/image";
import { logOutHelper } from "@/helper/httpHelpers/httpUserHelper";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "@/redux_features/user/userSlice";

export default function Navbar() {
    const [modalState, setModalState] = useState(false)
    const [profilePopUp, setProfilePopUp] = useState(false)
    const profilePopUpRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (profilePopUpRef.current && !profilePopUpRef.current.contains(event.target)) {
                setProfilePopUp(false)
            }
        };

        if (profilePopUp) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [profilePopUp]);

    const dispatch = useDispatch()
    const userCookie = useSelector(state => state.user.users)
    const router = useRouter()
    console.log('State.user')
    console.log(userCookie)
    function changeModal(event, id) {
        //setCurrentID(id)
        setModalState(true)
    }

    function closeModal(event) {
        setModalState(false)
    }

    async function logoutFunction() {
        const res = await logOutHelper({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
        dispatch(removeUser())
        setProfilePopUp(prev => !prev)
        toast(res.message, {
            icon: '😟',
        });
        router.push('/welcome')
    }



    return (
        <>
            <nav className=" z-10 fixed top-0 w-full bg-gray-800/50 flex justify-between items-center py-2 px-3 sm:px-5">
                <div>
                    <Link href='/' className="italic text-lg">stickify</Link>
                </div>
                <div>
                    <ul className="flex gap-5 justify-center items-center">
                        <li>
                            <Link href='/'>
                                <GoHome className="text-xl text-gray-100" />
                            </Link>
                        </li>
                        <li>
                            <Link href='/global'>
                                <BsGlobeAmericas className="text-gray-100" />
                            </Link>
                        </li>
                        <li>
                            <div onClick={changeModal} className="cursor-pointer">
                                <IoAddOutline className="text-2xl text-gray-100" />
                            </div>
                        </li>
                        <li></li>
                    </ul>
                </div>
                <div>
                    <ul className="flex gap-2">
                        {
                            Object.keys(userCookie).length !== 0 ?
                                <>
                                    <li className="w-8 h-8 rounded-full relative">
                                        <Image src={`/assets/avatars/${userCookie.avatar}.jpeg`}
                                            onClick={() => setProfilePopUp(prev => !prev)}
                                            width={100} height={100} alt="avatar" className="rounded-full cursor-pointer" />

                                        <div className={`${profilePopUp ? 'profilePopUp' : 'hidden'}`} ref={profilePopUpRef}>
                                            <div className="grid grid-cols-12 gap-0 cursor-pointer hover:text-yellow-300">
                                                <div className="w-5 h-5 rounded-full col-span-4">
                                                    <Image src={`/assets/avatars/${userCookie.avatar}.jpeg`}
                                                        width={100} height={100} alt="avatar" className=" rounded-full" />
                                                </div>
                                                <div className="col-span-8 truncate">
                                                    {userCookie.username}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-0 cursor-pointer hover:text-yellow-300">
                                                <div className="col-span-4 text-xl">
                                                    <BiCog />
                                                </div>
                                                <div className="col-span-8">
                                                    Profile
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-0 cursor-pointer hover:text-yellow-300"
                                                onClick={logoutFunction}>
                                                <div className="col-span-4 text-xl">
                                                    <AiOutlineLogout />
                                                </div>
                                                <div className="col-span-8">
                                                    Logout
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </> :
                                <li>
                                    <Link href='/welcome'>
                                        <RiAccountCircleLine className="text-xl" />
                                    </Link>
                                </li>
                        }
                    </ul>
                </div>
            </nav>
            <ModalMain modalState={modalState} closeModal={closeModal} userCookie={userCookie} />
        </>
    )
}