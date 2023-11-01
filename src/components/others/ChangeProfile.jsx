import { useEffect, useState } from "react";
import Image from "next/image"
import BoyAvatar1 from '@/assets/avatars/boy1.jpeg'
import BoyAvatar2 from '@/assets/avatars/boy2.jpeg'
import GirlAvatar1 from '@/assets/avatars/girl1.jpeg'
import GirlAvatar2 from '@/assets/avatars/girl2.jpeg'
import AnonymousAvatar from '@/assets/avatars/anonymous.jpeg'
import { editSelfHelper } from "@/helper/httpHelpers/httpUserHelper"
import toast, { Toaster } from 'react-hot-toast';


const ChangeProfile = ({ user, getUserCookie, toggleLoading }) => {
    const [formData, setFormData] = useState({
        avatar: '',
        username: '',
        email: '',
        operation: 'edit-profile'
    });
    const [isAvatar, setIsAvatar] = useState(true)

    useEffect(() => {
        setFormData({
            avatar: user.avatar,
            username: user.username,
            email: user.email,
            operation: 'edit-profile'
        })
    }, [user])

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
        e.preventDefault()
        toggleLoading(true)
        try {
            const res = await editSelfHelper(
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    id: user._id,
                    body: formData,
                })
            getUserCookie()
            toggleLoading(false)
            toast.success(res.message)
        } catch (error) {
            toggleLoading(false)
            console.log(error)
            toast.error(error.message)
        }
    }

    // console.log(formData)

    return (
        <div className="w-[85%] lg:w-[30%] sm:w-[60%]">
            <form className="" onSubmit={handleSubmit} >
                <div className='avatars'>
                    <div className="radio-inputs mb-4 flex justify-center gap-3 mt-2">
                        <div>
                            <input type="radio" id="boyOne" name="avatar" className="hidden manage-radio-btn"
                                value="boy1" onChange={handleChange} checked={formData.avatar === 'boy1'}
                            />
                            <label htmlFor="boyOne"
                                className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                <Image src={BoyAvatar1} width={400} height={400} className='rounded-full' />
                            </label>
                        </div>
                        <div>
                            <input type="radio" id="girlOne" name="avatar" className="hidden manage-radio-btn" value="girl1"
                                onChange={handleChange} checked={formData.avatar === 'girl1'}
                            />
                            <label htmlFor="girlOne"
                                className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                <Image src={GirlAvatar1} width={400} height={400} className='rounded-full' />
                            </label>
                        </div>
                        <div>
                            <input type="radio" id="boyTwo" name="avatar" className="hidden manage-radio-btn" value="boy2"
                                onChange={handleChange} checked={formData.avatar === 'boy2'}
                            />
                            <label htmlFor="boyTwo"
                                className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                <Image src={BoyAvatar2} width={400} height={400} className='rounded-full' />
                            </label>
                        </div>
                        <div>
                            <input type="radio" id="girlTwo" name="avatar" className="hidden manage-radio-btn" value="girl2"
                                onChange={handleChange} checked={formData.avatar === 'girl2'}
                            />
                            <label htmlFor="girlTwo"
                                className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                <Image src={GirlAvatar2} width={400} height={400} className=' rounded-full' />
                            </label>
                        </div>
                        <div>
                            <input type="radio" id="anonymousOne" name="avatar" className="hidden manage-radio-btn" value="anonymous"
                                onChange={handleChange} checked={formData.avatar === 'anonymous'}
                            />
                            <label htmlFor="anonymousOne"
                                className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                                <Image src={AnonymousAvatar} width={400} height={400} className=' rounded-full' />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="input-section flex flex-col gap-2 mb-4">
                    <input
                        className='rounded-lg block w-full 
                        p-2.5 py-4 sm:py-3 text-md dark:placeholder-gray-400 dark:text-white dark:bg-gray-800
                                focus:ring-blue-500 focus:border-blue-500'
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange} required
                    />
                    <input
                        className='rounded-lg block w-full 
                        p-2.5 py-4 sm:py-3 text-md dark:placeholder-gray-400 dark:text-white dark:bg-gray-800
                                focus:ring-blue-500 focus:border-blue-500'
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange} required
                    />
                </div>
                <button className='border hover:border-[1.4px] dark:border-[#e6e9e7] focus:outline-none 
                    font-medium rounded-lg text-md px-5 py-4 sm:py-3 mb-2 focus:ring-gray-700 block w-full border-gray-800'
                    type="submit"
                >
                    <span className="dark:text-[#e6e9e7] text-gray-800">Save</span>
                </button>
            </form>
        </div>
    )
}

export default ChangeProfile