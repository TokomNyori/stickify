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
import { BsPersonFillUp } from "react-icons/bs";
import { IoChatboxOutline } from "react-icons/io5";
import { IoChatbox } from "react-icons/io5";
import { FcIdea } from "react-icons/fc";
import { FaRegLightbulb } from "react-icons/fa6";
import { FaLightbulb } from "react-icons/fa6";
import NoteModal from "./modals/NoteModal";
import Image from "next/image";
import { getSingleUserHelper, logOutHelper } from "@/helper/httpHelpers/httpUserHelper";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "@/redux_features/user/userSlice";
import { useTheme } from "next-themes";
import { addPage } from "@/redux_features/pages/pageSlice";
import { addTheme } from "@/redux_features/theme/themeSlice";
import { setNoteModalConfig } from "@/redux_features/noteModalConfig/noteModalConfigSlice";
import ClipLoader from "react-spinners/SquareLoader";
import { CookieHelper } from "@/helper/httpHelpers/httpCookieHelper";
import { AiTwotoneHeart } from "react-icons/ai";
import { changePageLoader } from "@/redux_features/reduxPageLoader/reduxPageLoaderSlice";
import { clearResearchConfig } from "@/redux_features/researchMessages/researchConfig";
import { clearResearchMessages } from "@/redux_features/researchMessages/researchSlice";

export default function Navbar() {
    //const [noteModalState, setNoteModalState] = useState(false)

    // Redux
    const page = useSelector(state => state.page.page)
    const reduxPageLoader = useSelector(state => state.reduxPageLoader.reduxPageLoader)
    const noteModalConfig = useSelector(state => state.noteModalConfig.noteModalConfig)
    const userCookie = useSelector(state => state.user.users)
    const dispatch = useDispatch()

    // Local states
    const [profilePopUp, setProfilePopUp] = useState(false)
    const [infoPopUp, setInfoPopUp] = useState(false)
    const [activePage, setActivePage] = useState('')
    const [loading, setLoading] = useState(false)
    //const [isNonUser, setIsNonUser] = useState(false)

    const { theme, setTheme } = useTheme()
    const profilePopUpRef = useRef(null);

    // Router
    const router = useRouter()
    const count = 0

    useEffect(() => {
        getUserCookie()
    }, [])

    // useEffect(() => {
    //     if (Object.keys(userCookie).length !== 0) {
    //         getSingleUser(userCookie._id)
    //     }
    // }, [userCookie])

    useEffect(() => {
        setActivePage(page)
    }, [page])

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

    async function getUserCookie() {
        try {
            const res = await CookieHelper()
            dispatch(addUser(res.body))
        } catch (error) {
            console.log('CookieHelper Error')
            console.log(error.message)
        }
    }

    // async function getSingleUser(userid) {
    //     try {
    //         const res = await getSingleUserHelper(
    //             { method: 'GET', id: userid, headers: { 'Content-Type': 'application/json' } }
    //         )
    //         if (res.message === "Account not found or has been removed.") {
    //             dispatch(removeUser())
    //             setTimeout(() => {
    //                 toast.error(res.message)
    //             }, 500);
    //             router.push('/welcome')
    //         }
    //     } catch (error) {
    //         console.log('getSingleUserHelper Error')
    //         console.log(error)
    //     }

    // }

    // useEffect(() => {
    //     if (userCookie.cookieStatus === true) {
    //         setIsNonUser(false)
    //     } else if (userCookie.cookieStatus === false) {
    //         setIsNonUser(true)
    //     }
    // }, [userCookie])

    // console.log('userCookie')
    // console.log(userCookie)

    function changeModal(event, id) {
        //setCurrentID(id)
        dispatch(setNoteModalConfig({ noteModalState: true, as: 'create', noteObject: {} }))
    }

    async function logoutFunction() {
        dispatch(changePageLoader(true))
        const res = await logOutHelper({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
        setProfilePopUp(prev => !prev)
        dispatch(removeUser())
        dispatch(clearResearchConfig())
        dispatch(clearResearchMessages())
        //setLoading(false)
        setTimeout(() => {
            toast(res.message, {
                icon: '🥺',
            });
        }, 500);
        router.push('/welcome')
    }


    function changePage(e) {
        const clickedLink = e.currentTarget; // Get the clicked link element
        //if (clickedLink.id == page) return; // If the clicked link is the current page, do nothing
        //dispatch(addPage(clickedLink.id))
        setActivePage(clickedLink.id) // Get and set the id attribute of the clicked link
        if (clickedLink.id !== page) {
            if (clickedLink.id === 'manage-profile' || clickedLink.id === 'support-me') {
                dispatch(changePageLoader(true))
            }
        }
    }

    function closeProfileAndChangePage(e) {
        changePage(e)
        setProfilePopUp(prev => !prev)
    }

    function toggleTheme(mode) {
        if (mode === 'light') {
            setTheme('light')
            dispatch(addTheme('light'))
        } else if (mode === 'dark') {
            setTheme('dark')
            dispatch(addTheme('dark'))
        }
    }

    // console.log('page-----')
    // console.log(page)

    return (
        Object.keys(userCookie).length !== 0 ?
            <>
                <nav className="z-10 fixed top-0 w-full flex justify-between items-center pt-2 pb-1 px-3 sm:px-5">
                    <div>
                        <Link href='/' className="italic text-xl sm:text-lg font-bold">stickify</Link>
                    </div>
                    <div>
                        <ul className="flex gap-5 justify-center items-center sm:ml-12 ml-2">
                            <li className="relative flex flex-col items-center">
                                <Link href='/'
                                    className={
                                        `home-link ${activePage === 'home' && ''}`
                                    }
                                    id="home" onClick={changePage}
                                >
                                    {
                                        activePage === 'home' ?
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
                                        `home-link ${activePage === 'feeds' && ''}`
                                    }
                                    onClick={changePage} id="feeds"
                                >
                                    {
                                        activePage === 'feeds' ?
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
                                <Link href='/research'
                                    className={
                                        `home-link ${activePage === 'research' && ''}`
                                    }
                                    onClick={changePage} id="research"
                                >
                                    {
                                        activePage === 'research' ?
                                            <FaLightbulb
                                                className="text-[1.4rem] sm:text-[1.15rem] hover:scale-[1.04] hover:text-yellow-400 dark:hover:text-yellow-400
                                                    transition-all duration-150 ease-in-out text-yellow-500"
                                            /> :
                                            <FaRegLightbulb
                                                className="text-[1.4rem] sm:text-[1.15rem] hover:scale-[1.04] hover:text-black dark:hover:text-white
                                                    transition-all duration-150 ease-in-out"
                                            />
                                    }
                                </Link>
                                <div className="home-link-info hidden justify-center items-start absolute top-10 bg-gray-600 
                                                opacity-50 text-white text-sm px-2 py-1 rounded-md">
                                    Research
                                </div>
                            </li>
                            <li className="relative flex flex-col items-center">
                                <div onClick={changeModal} className="cursor-pointer home-link">
                                    <IoAddSharp
                                        className="text-[2.15rem] sm:text-[1.7rem] hover:scale-[1.05] hover:text-black dark:hover:text-white
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
                                                                onClick={() => toggleTheme('dark')}
                                                            />
                                                            <div className="home-link-info hidden justify-center items-start absolute 
                                                            top-12 bg-gray-600 opacity-50 text-white text-sm px-2 py-1 rounded-md 
                                                            w-24 text-center">
                                                                Switch to dark mode
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                            <MdOutlineLightMode
                                                                className="text-3xl font-light hover:text-gray-400 cursor-pointer
                                                                home-link"
                                                                onClick={() => toggleTheme('light')}
                                                            />
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
                                                    className={`${profilePopUp ? 'profilePopUp' : 'hidden'} dark:bg-zinc-800
                                                    bg-[#fff] text-xl sm:text-lg shadow-lg`}
                                                    ref={profilePopUpRef}>
                                                    <div className="flex gap-3 items-center">
                                                        <div className="sm:w-5 sm:h-5 w-6 h-6 rounded-full">
                                                            <Image src={`/assets/avatars/${userCookie.avatar}.jpeg`}
                                                                width={100} height={100} alt="avatar" className=" rounded-full" />
                                                        </div>
                                                        <div className="truncate profile-popup-text">
                                                            {userCookie.username}
                                                        </div>
                                                    </div>
                                                    {
                                                        theme === 'light' ?
                                                            <div className="gap-3 items-center cursor-pointer hover:scale-[1.03] 
                                                                transition-all duration-150 ease-in-out nightModeSmallScreen"
                                                                onClick={() => toggleTheme('dark')}
                                                            >
                                                                <div className="text-2xl sm:text-xl">
                                                                    <MdOutlineDarkMode className="inline" />
                                                                </div>
                                                                <div className="profile-popup-text">
                                                                    Dark Mode
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="gap-3 items-center cursor-pointer hover:scale-[1.03] 
                                                                transition-all duration-150 ease-in-out nightModeSmallScreen"
                                                                onClick={() => toggleTheme('light')}
                                                            >
                                                                <div className="text-2xl sm:text-xl">
                                                                    <MdOutlineLightMode className="inline" />
                                                                </div>
                                                                <div className="profile-popup-text">
                                                                    Light Mode
                                                                </div>
                                                            </div>
                                                    }
                                                    <Link
                                                        href='/manage-profile'
                                                        className="flex gap-3 items-center cursor-pointer hover:scale-[1.03] 
                                                        transition-all duration-150 ease-in-out" id="manage-profile"
                                                        onClick={closeProfileAndChangePage}>
                                                        <div className="text-2xl sm:text-xl">
                                                            <BiCog />
                                                        </div>
                                                        <div className="profile-popup-text">
                                                            Manage Profile
                                                        </div>
                                                    </Link>
                                                    <div className="flex gap-3 items-center cursor-pointer hover:scale-[1.03] 
                                                        transition-all duration-150 ease-in-out"
                                                        onClick={logoutFunction}>
                                                        <div className="text-2xl sm:text-xl">
                                                            <AiOutlineLogout />
                                                        </div>
                                                        <div className="profile-popup-text">
                                                            Logout
                                                        </div>
                                                    </div>
                                                    <Link href="/support-me"
                                                        className="flex gap-3 items-center cursor-pointer hover:scale-[1.03] 
                                                        transition-all duration-150 ease-in-out" id="support-me"
                                                        onClick={closeProfileAndChangePage}
                                                    >
                                                        <div className="text-2xl sm:text-xl text-red-500">
                                                            <AiTwotoneHeart />
                                                        </div>
                                                        <div className="profile-popup-text">
                                                            Support me
                                                        </div>
                                                    </Link>
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
                {loading &&
                    <div
                        className={`modal-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                        items-center flex-wrap -mt-6`}>
                        <ClipLoader
                            color="#3f3f46"
                            loading='Logging out...'
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
                {reduxPageLoader &&
                    <div
                        className={`modal-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                        items-center flex-wrap -mt-6`}>
                        <ClipLoader
                            color="#3f3f46"
                            loading='Logging out...'
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
                <Toaster />
            </>
            :
            <>
                <Toaster />
            </>
    )
}