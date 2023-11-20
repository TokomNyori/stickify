'use client'
import { useEffect, useState } from 'react';
import '../app/signup.css'
import Image from 'next/image';
import BoyAvatar1 from '@/assets/avatars/boy1.jpeg'
import BoyAvatar2 from '@/assets/avatars/boy2.jpeg'
import GirlAvatar1 from '@/assets/avatars/girl1.jpeg'
import GirlAvatar2 from '@/assets/avatars/girl2.jpeg'
import RobotAvatar from '@/assets/avatars/robot.jpeg'
import AnonymousAvatar from '@/assets/avatars/anonymous.jpeg'
import toast, { Toaster } from 'react-hot-toast';
import { loginHelper, signupHelper } from '@/helper/httpHelpers/httpUserHelper';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addUser } from '@/redux_features/user/userSlice';
import { useTheme } from 'next-themes';
import { MdOutlineDarkMode } from 'react-icons/md'
import { MdOutlineLightMode } from 'react-icons/md'
import { PiStickerLight } from 'react-icons/pi'
import ClipLoader from "react-spinners/SquareLoader";
import { addTheme } from '@/redux_features/theme/themeSlice';

const Welcome = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [isAvatar, setIsAvatar] = useState(true)
    const [loading, setLoading] = useState(false)
    //const [userCookie, setUserCookie] = useState({})
    const [formData, setFormData] = useState({
        avatar: '',
        username: '',
        email: '',
        password: '',
    });

    const dispatch = useDispatch()
    const { theme, setTheme } = useTheme()
    const router = useRouter()

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            setLoading(true)
            // Handle login logic here

            // Extract data needed for login form submission
            const loginFormData = {
                email: formData.email,
                password: formData.password
            }
            try {
                const res = await loginHelper({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: loginFormData
                })
                setLoading(false)
                router.push('/')
                toast(res.message, {
                    icon: '🤗',
                })
            } catch (error) {
                setLoading(false)
                toast.error(error.message)
            }

        } else {
            // Handle signup logic here
            if (!formData.avatar) {
                setIsAvatar(false)
                toast.error(`Please select an avatar`, {
                    icon: '🤖',
                    duration: 3000,
                })
                return
            }
            setLoading(true)
            try {
                const res = await signupHelper({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: formData
                })
                localStorage.setItem('userData', JSON.stringify(res.body))
                setLoading(false)
                setFormData({
                    avatar: '',
                    username: '',
                    email: '',
                    password: '',
                })
                router.push('/')
                toast.success(res.message, {
                    duration: 3000
                })
            } catch (error) {
                setLoading(false)
                toast.error(error.message, {
                    duration: 4000
                })
            }
        }
    };

    function toggleTheme(mode) {
        if (mode === 'light') {
            setTheme('light')
            dispatch(addTheme('light'))
        } else if (mode === 'dark') {
            setTheme('dark')
            dispatch(addTheme('dark'))
        }
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-0 justify-center items-center -mt-8 sm:-mt-4'>
            <Toaster />
            {loading &&
                <div
                    className={`modal-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap -mt-6`}>
                    <ClipLoader
                        color={`${theme === 'dark' ? '#e2e8f0' : '#1f2937'}`}
                        loading='Generating...'
                        //cssOverride={override}
                        size={120}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    {/* <div className="text-2xl mt-5 font-bold text-[#ac3232]">
                        Deleting note...
                    </div> */}
                </div>
            }
            <div className='text-center flex flex-col justify-center items-center'>
                <div className="mb-6 sm:mb-8">
                    {
                        theme === 'light' ?
                            <MdOutlineDarkMode
                                className="text-3xl font-light text-gray-500 hover:text-black cursor-pointer"
                                onClick={() => toggleTheme('dark')} /> :
                            <MdOutlineLightMode
                                className="text-3xl font-light hover:text-gray-400 cursor-pointer"
                                onClick={() => toggleTheme('light')} />
                    }
                </div>
                <div className='text-3xl italic'>Stickify</div>
                <p
                    className='dark:text-gray-300'>Your AI sticker-notes
                    <span><PiStickerLight className='ml-1 inline text-xl' /></span>
                </p>
            </div>
            <div className="signup-form-container bg-white dark:bg-zinc-800 sm:ml-12 shadow-xl rounded-2xl
            text-gray-800 dark:text-gray-300">
                <h1 className='text-lg'>{isLogin ? 'Login' : 'Sign Up'}</h1>
                <form onSubmit={handleSubmit}>
                    <div className='input-group flex flex-col gap-3 w-full'>
                        {!isLogin && (
                            <div className='avatars'>
                                <p className='text-md'>Select an avatar</p>
                                <p className={`text-sm font-light text-red-400 ${isAvatar && 'hidden'}`}>Please select an avatar</p>
                                <div className="radio-inputs mb-4 flex gap-3 mt-2">
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
                                <input
                                    className='rounded-xl bg-zinc-200 dark:bg-zinc-900 dark:border-zinc-600 block w-full 
                                            p-2.5 py-4 sm:py-3 text-md dark:placeholder-zinc-600 dark:text-zinc-100
                                focus:ring-blue-500 focus:border-blue-500'
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange} required
                                />
                            </div>
                        )}
                        <input
                            className='rounded-lg bg-zinc-200 dark:bg-zinc-900 dark:border-gray-600 block w-full 
                                p-2.5 py-4 sm:py-3 text-md dark:placeholder-zinc-600 dark:text-zinc-100 
                                focus:ring-blue-500 focus:border-blue-500'
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange} required
                        />
                        <input
                            className='rounded-lg bg-zinc-200 dark:bg-zinc-900 dark:border-gray-600 block w-full 
                                p-2.5 py-4 sm:py-3 text-md dark:placeholder-zinc-600 dark:text-zinc-100 
                                focus:ring-blue-500 focus:border-blue-500'
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange} required
                        />
                        <button className='border border-blue-500 focus:outline-none font-medium rounded-lg text-md px-5 py-4 
                        sm:py-3 mb-2 bg-zinc-200 dark:bg-zinc-900 text-whiteborder-gray-600  hover:border-blue-700
                            focus:ring-gray-700 block w-full '
                            type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
                    </div>
                </form>
                <button className='border border-green-500 focus:outline-none font-medium rounded-lg text-md px-5 py-4 
                sm:py-3 mb-2 bg-zinc-200 dark:bg-zinc-900 text-whiteborder-gray-600  hover:border-green-700
                            focus:ring-gray-700 block w-full'
                    onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Create an Account' : 'Already have an account?'}
                </button>
            </div>
        </div>
    )
}

export default Welcome