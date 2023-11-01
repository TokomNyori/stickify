'use client'
import Link from "next/link"
import { IoAddSharp } from "react-icons/io5";
import { GoHome } from 'react-icons/go'
import { GoHomeFill } from 'react-icons/go'
import { BiLogInCircle } from 'react-icons/bi'
import { RiAccountCircleLine } from 'react-icons/ri'
import { BsGlobeAmericas } from 'react-icons/bs'
import { BiCog } from 'react-icons/bi'
import { AiOutlineLogout } from 'react-icons/ai'
import { MdOutlineDarkMode } from 'react-icons/md'
import { MdOutlineLightMode } from 'react-icons/md'
import { useEffect, useRef, useState } from "react";
import { BiGroup } from 'react-icons/bi'
import { BiSolidGroup } from 'react-icons/bi'
import NoteModal from "./modals/NoteModal";
import Image from "next/image";
import { logOutHelper } from "@/helper/httpHelpers/httpUserHelper";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "@/redux_features/user/userSlice";
import { useTheme } from "next-themes";
import { addPage } from "@/redux_features/pages/pageSlice";
import { addTheme } from "@/redux_features/theme/themeSlice";
import { setNoteModalConfig } from "@/redux_features/noteModalConfig/noteModalConfigSlice";

export default function Navbar() {
    //const [noteModalState, setNoteModalState] = useState(false)

    const [profilePopUp, setProfilePopUp] = useState(false)
    const [infoPopUp, setInfoPopUp] = useState(false)
    const page = useSelector(state => state.page.page)
    const [activePage, setActivePage] = useState(page)

    const noteModalConfig = useSelector(state => state.noteModalConfig.noteModalConfig)
    const userCookie = useSelector(state => state.user.users)
    const dispatch = useDispatch()

    const { theme, setTheme } = useTheme()
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

    const router = useRouter()

    function changeModal(event, id) {
        //setCurrentID(id)
        dispatch(setNoteModalConfig({ noteModalState: true, as: 'create', noteObject: {} }))
    }

    async function logoutFunction() {
        const res = await logOutHelper({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
        dispatch(removeUser())
        setProfilePopUp(prev => !prev)
        router.push('/welcome')
        toast(res.message, {
            icon: '😟',
        });
    }


    function changePage(e) {
        const clickedLink = e.currentTarget; // Get the clicked link element
        dispatch(addPage(clickedLink.id))
        setActivePage(clickedLink.id) // Get and set the id attribute of the clicked link
    }

    function toggleTheme(mode) {
        if (mode === 'light') {
            setTheme('light')
            dispatch(addTheme('light'))
        } else {
            setTheme('dark')
            dispatch(addTheme('dark'))
        }
    }

    console.log('UserCookie')
    console.log(userCookie)

    return (
        Object.keys(userCookie).length !== 0 ?
            <>
                <nav className=" z-10 fixed top-0 w-full flex justify-between items-center pt-2 pb-1 px-3 sm:px-5">
                    <div>
                        <Link href='/' className="italic text-xl sm:text-lg font-bold">stickify</Link>
                    </div>
                    <div>
                        <ul className="flex gap-5 justify-center items-center sm:ml-12 ml-2">
                            <li className="relative flex flex-col items-center">
                                <Link href='/'
                                    className={
                                        `home-link ${page === 'home' && 'border-b-[1px] border-gray-700 dark:border-gray-100'}`
                                    }
                                    id="home" onClick={changePage}
                                >
                                    {
                                        page === 'home' ?
                                            <GoHomeFill
                                                className="text-3xl sm:text-2xl hover:scale-[1.04] hover:text-black dark:hover:text-white
                                                    transition-all duration-150 ease-in-out"
                                            /> :
                                            <GoHome
                                                className="text-3xl sm:text-2xl hover:scale-[1.04] hover:text-black dark:hover:text-white
                                                    transition-all duration-150 ease-in-out"
                                            />
                                    }
                                </Link>
                                <div className="home-link-info hidden justify-center items-start absolute top-10 bg-gray-600 
                                                opacity-50 text-white text-sm px-2 py-1 rounded-md">
                                    Home
                                </div>
                            </li>
                            <li className="relative flex flex-col items-center">
                                <Link href='/feeds'
                                    className={
                                        `home-link ${page === 'feeds' && 'border-b-[1px] border-gray-700 dark:border-gray-100'}`
                                    }
                                    onClick={changePage} id="feeds"
                                >
                                    {
                                        page === 'feeds' ?
                                            <BiSolidGroup
                                                className="text-3xl sm:text-2xl hover:scale-[1.04] hover:text-black dark:hover:text-white
                                                    transition-all duration-150 ease-in-out"
                                            /> :
                                            <BiGroup
                                                className="text-3xl sm:text-2xl hover:scale-[1.04] hover:text-black dark:hover:text-white
                                                    transition-all duration-150 ease-in-out"
                                            />
                                    }
                                </Link>
                                <div className="home-link-info hidden justify-center items-start absolute top-10 bg-gray-600 
                                                opacity-50 text-white text-sm px-2 py-1 rounded-md">
                                    Feeds
                                </div>
                            </li>
                            <li className="relative flex flex-col items-center">
                                <div onClick={changeModal} className="cursor-pointer home-link">
                                    <IoAddSharp
                                        className="text-[2.1rem] sm:text-[1.7rem] hover:scale-[1.05] hover:text-black dark:hover:text-white
                                                    transition-all duration-150 ease-in-out"
                                    />
                                </div>
                                <div className="home-link-info hidden justify-center items-start absolute top-10 bg-gray-600 
                                                opacity-50 text-white text-sm px-2 py-1 rounded-md w-24">
                                    Create Note
                                </div>
                            </li>
                            <li></li>
                        </ul>
                    </div>
                    <div>
                        <div className="flex gap-2">
                            {
                                Object.keys(userCookie).length !== 0 ?
                                    <>
                                        <div className="flex justify-center items-center gap-3">
                                            <div className="nightModeBigScreen flex-col items-center relative">
                                                {
                                                    theme === 'light' ?
                                                        <>
                                                            <MdOutlineDarkMode
                                                                className="home-link text-3xl font-light text-gray-500 
                                                                hover:text-black cursor-pointer"
                                                                onClick={() => toggleTheme('dark')} />
                                                            <div className="home-link-info hidden justify-center items-start absolute 
                                                            top-12 bg-gray-600 opacity-50 text-white text-sm px-2 py-1 rounded-md 
                                                            w-24 text-center">
                                                                Switch to dark mode
                                                            </div>
                                                        </> :
                                                        <>
                                                            <MdOutlineLightMode
                                                                className="text-3xl font-light hover:text-gray-400 cursor-pointer
                                                                home-link"
                                                                onClick={() => toggleTheme('light')} />
                                                            <div className="home-link-info hidden justify-center items-start absolute 
                                                            top-12 bg-gray-600 opacity-50 text-white text-sm px-2 py-1 rounded-md 
                                                            w-24 text-center">
                                                                Switch to light mode
                                                            </div>
                                                        </>

                                                }
                                            </div>
                                            <div className="w-8 h-8 rounded-full relative">
                                                <Image src={`/assets/avatars/${userCookie.avatar}.jpeg`}
                                                    onClick={() => setProfilePopUp(prev => !prev)}
                                                    width={100} height={100} alt="avatar"
                                                    className="rounded-full cursor-pointer hover:brightness-110" />

                                                <div
                                                    className={`${profilePopUp ? 'profilePopUp' : 'hidden'} dark:bg-gray-800/50
                                                    bg-[#f6f8f6] text-xl`}
                                                    ref={profilePopUpRef}>
                                                    <div className="grid grid-cols-12 gap-0">
                                                        <div className="w-5 h-5 rounded-full col-span-3">
                                                            <Image src={`/assets/avatars/${userCookie.avatar}.jpeg`}
                                                                width={100} height={100} alt="avatar" className=" rounded-full" />
                                                        </div>
                                                        <div className="col-span-9 truncate">
                                                            {userCookie.username}
                                                        </div>
                                                    </div>
                                                    {
                                                        theme === 'light' ?
                                                            <div className="grid-cols-12 gap-0 cursor-pointer hover:scale-[1.03] 
                                                                transition-all duration-150 ease-in-out nightModeSmallScreen"
                                                                onClick={() => toggleTheme('dark')}
                                                            >
                                                                <div className="col-span-3 text-xl">
                                                                    <MdOutlineDarkMode />
                                                                </div>
                                                                <div className="col-span-9">
                                                                    Dark Mode
                                                                </div>
                                                            </div> :
                                                            <div className="grid-cols-12 gap-0 cursor-pointer hover:scale-[1.03] 
                                                                transition-all duration-150 ease-in-out nightModeSmallScreen"
                                                                onClick={() => toggleTheme('light')}
                                                            >
                                                                <div className="col-span-3 text-xl">
                                                                    <MdOutlineLightMode />
                                                                </div>
                                                                <div className="col-span-9">
                                                                    Light Mode
                                                                </div>
                                                            </div>
                                                    }
                                                    <Link
                                                        href='/manage-profile'
                                                        className="grid grid-cols-12 gap-0 cursor-pointer hover:scale-[1.03] 
                                                        transition-all duration-150 ease-in-out">
                                                        <div className="col-span-3 text-xl">
                                                            <BiCog />
                                                        </div>
                                                        <div className="col-span-9">
                                                            Manage Profile
                                                        </div>
                                                    </Link>
                                                    <div className="grid grid-cols-12 gap-0 cursor-pointer hover:scale-[1.03] 
                                                        transition-all duration-150 ease-in-out"
                                                        onClick={logoutFunction}>
                                                        <div className="col-span-3 text-xl">
                                                            <AiOutlineLogout />
                                                        </div>
                                                        <div className="col-span-9">
                                                            Logout
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </> :
                                    <div>
                                        <div>
                                            <RiAccountCircleLine className="text-3xl" />
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </nav >
                <NoteModal userCookie={userCookie} />
            </>
            :
            <>
            </>
    )
}