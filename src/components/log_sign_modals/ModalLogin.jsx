'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { loginHelper } from '@/helper/httpHelpers/httpUserHelper';
import { AiOutlineCloseCircle } from 'react-icons/ai'

const ModalLogin = ({ toggleLoading, toggleSyncLoading, theme, toggleIsLogin, isLogin, changeModalWelcomeState, modalWelcomeRef,
    getUserCookie, changeSyncLoader,
}) => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const router = useRouter()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    // Handle Login logic here
    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleLoading(true)
        try {
            const res = await loginHelper({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: formData
            })
            changeModalWelcomeState(false)
            toggleLoading(false)
            getUserCookie()
            changeSyncLoader(true)
            setTimeout(() => {
                changeSyncLoader(false)
                toast(res.message, {
                    icon: '🤗',
                })
            }, 2000);
        } catch (error) {
            toggleLoading(false)
            toast.error(error.message)
        }
    };


    return (
        <div className={`signup-form-container2 bg-zinc-900 shadow-2xl rounded-3xl
        text-gray-100`}
            ref={modalWelcomeRef}
        >
            <div className='flex justify-between items-center mb-4'>
                <div className='inline opacity-0'>
                    <AiOutlineCloseCircle className={`sm:text-3xl text-4xl`} />
                </div>
                <div className={`text-lg`}>
                    Log in to Unlock 🌟⚡
                </div>
                <div className='inline'
                    onClick={() => changeModalWelcomeState(false)}
                >
                    <AiOutlineCloseCircle className={`sm:text-3xl text-4xl hover:text-red-400`} />
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='input-group flex flex-col gap-3 w-full'>
                    <input
                        className={`rounded-xl bg-zinc-800 block w-full placeholder-zinc-500
                        p-2.5 py-4 sm:py-3 text-md focus:ring-blue-500 focus:border-blue-500`}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange} required
                    />
                    <input
                        className={`rounded-xl bg-zinc-800 block w-full placeholder-zinc-500
                        p-2.5 py-4 sm:py-3 text-md focus:ring-blue-500 focus:border-blue-500`}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange} required
                    />
                    <button className='border border-gray-100 focus:outline-none font-medium rounded-xl text-md px-5 py-4 
                                    sm:py-3 mb-2 text-whiteborder-gray-600  hover:border-[1.4px]
                                    focus:ring-gray-700 block w-full '
                        type="submit"
                    >
                        Login
                    </button>
                </div>
            </form>
            <button className='border border-gray-100 focus:outline-none font-medium rounded-xl text-md px-5 py-4 
                sm:py-3 mb-2 text-whiteborder-gray-600  hover:border-[1.4px]
                            focus:ring-gray-700 block w-full'
                onClick={() => toggleIsLogin(false)}
            >
                Create an Account
            </button>
        </div>
    )
}

export default ModalLogin