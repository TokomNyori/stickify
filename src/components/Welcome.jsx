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

const Welcome = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [isAvatar, setIsAvatar] = useState(true)
    //const [userCookie, setUserCookie] = useState({})
    const [formData, setFormData] = useState({
        avatar: '',
        username: '',
        email: '',
        password: '',
    });

    const dispatch = useDispatch()
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
                //localStorage.setItem('userData', JSON.stringify(res.body))
                router.push('/')
                toast(res.message, {
                    icon: '🤗',
                })
            } catch (error) {
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
            try {
                const res = await signupHelper({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: formData
                })
                localStorage.setItem('userData', JSON.stringify(res.body))
                toast.success(res.message, {
                    duration: 3000
                })
                setFormData({
                    avatar: '',
                    username: '',
                    email: '',
                    password: '',
                })
                router.push('/')
            } catch (error) {
                toast.error(error.message, {
                    duration: 4000
                })
            }
        }
    };

    return (
        <div className="signup-form-container">
            <Toaster />
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={handleSubmit}>
                <div className='input-group grid gap-4'>
                    {!isLogin && (
                        <div className='avatars'>
                            <p className='text-sm'>Select an avatar</p>
                            <p className={`text-sm font-light text-red-400 ${isAvatar && 'hidden'}`}>Please select an avatar</p>
                            <div className="radio-inputs mb-4 flex gap-3 mt-2">
                                <div>
                                    <input type="radio" id="boy1" name="avatar" className="hidden signup-radio-btn" value="boy1"
                                        onChange={handleChange} checked={formData.avatar === 'boy1'}
                                    />
                                    <label htmlFor="boy1"
                                        className="block w-10 h-10 rounded-full border border-gray-500 p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                        <Image src={BoyAvatar1} width={400} height={400} className='rounded-full' />
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" id="girl1" name="avatar" className="hidden signup-radio-btn" value="girl1"
                                        onChange={handleChange} checked={formData.avatar === 'girl1'}
                                    />
                                    <label htmlFor="girl1"
                                        className="block w-10 h-10 rounded-full border border-gray-500 p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                        <Image src={GirlAvatar1} width={400} height={400} className='rounded-full' />
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" id="boy2" name="avatar" className="hidden signup-radio-btn" value="boy2"
                                        onChange={handleChange} checked={formData.avatar === 'boy2'}
                                    />
                                    <label htmlFor="boy2"
                                        className="block w-10 h-10 rounded-full border border-gray-500 p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                        <Image src={BoyAvatar2} width={400} height={400} className='rounded-full' />
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" id="girl2" name="avatar" className="hidden signup-radio-btn" value="girl2"
                                        onChange={handleChange} checked={formData.avatar === 'girl2'}
                                    />
                                    <label htmlFor="girl2"
                                        className="block w-10 h-10 rounded-full border border-gray-500 p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                        <Image src={GirlAvatar2} width={400} height={400} className=' rounded-full' />
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" id="anonymous" name="avatar" className="hidden signup-radio-btn" value="anonymous"
                                        onChange={handleChange} checked={formData.avatar === 'anonymous'}
                                    />
                                    <label htmlFor="anonymous"
                                        className="block w-10 h-10 rounded-full border border-gray-500 p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                        <Image src={AnonymousAvatar} width={400} height={400} className=' rounded-full' />
                                    </label>
                                </div>
                            </div>
                            <input
                                className='rounded-xl bg-gray-700 border-gray-600 block w-full 
                                p-2.5 text-sm placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange} required
                            />
                        </div>
                    )}
                    <input
                        className='rounded-lg bg-gray-700 border-gray-600 block w-full 
                                p-2.5 text-sm placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange} required
                    />
                    <input
                        className='rounded-lg bg-gray-700 border-gray-600 block w-full 
                                p-2.5 text-sm placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange} required
                    />
                    <button className='border border-blue-400/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mb-2
                            bg-gray-700 text-whiteborder-gray-600  hover:border-blue-400/75 focus:ring-gray-700 block w-full '
                        type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
                </div>

            </form>
            <button className='border border-green-400/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mb-2
                            bg-gray-700 text-whiteborder-gray-600  hover:border-green-400/75 focus:ring-gray-700 block w-full'
                onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Create an Account' : 'Already have an account?'}
            </button>
        </div>
    )
}

export default Welcome