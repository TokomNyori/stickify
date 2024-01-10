'use client'
import Image from 'next/image';
import AnonymousAvatar from '@/assets/avatars/anonymous.jpeg'
import Scarlett from '@/assets/avatars/scarlett.jpeg'
import BoyAvatar1 from '@/assets/avatars/boy1.jpeg'
import BoyAvatar2 from '@/assets/avatars/boy2.jpeg'
import GirlAvatar1 from '@/assets/avatars/girl1.jpeg'
import GirlAvatar2 from '@/assets/avatars/girl2.jpeg'
import Elezabeth from '@/assets/avatars/Elezabeth.jpeg'
import Charlotte from '@/assets/avatars/Charlotte.jpeg'
import Alvin from '@/assets/avatars/Alvin.jpeg'
import Larry from '@/assets/avatars/Larry.jpeg'
import Jasmine from '@/assets/avatars/Jasmine.jpeg'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useEffect, useRef } from 'react';
import '@/app/signup.css'

const AvatarsModal = ({ handleChange, formData, avatarModalState, toggleAvatarModalState, theme }) => {

    const avatarModalRef = useRef(null)

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (avatarModalRef.current && !avatarModalRef.current.contains(event.target)) {
                toggleAvatarModalState()
            }
        };

        if (avatarModalState) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [avatarModalState]);

    return (
        <div className={`modal-blur top-0 inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center
                        ${avatarModalState ? "fix-modal" : "hidden"} flex-wrap dark:brightness-[85%] w-full`}>
            <div className=' avatar-manage-form-container flex flex-col justify-center items-center bg-white text-gray-800 dark:bg-zinc-800 
                dark:text-gray-100 py-4 px-4 rounded-3xl'
                ref={avatarModalRef}
            >
                <div className='flex flex-row justify-between items-center mb-5 -mt-1 font-bold w-full'>
                    <div>
                        More Avatars
                    </div>
                    <div className='cursor-pointer ml-auto'
                        onClick={toggleAvatarModalState}>
                        <AiOutlineCloseCircle className={`sm:text-3xl text-4xl hover:text-red-400`} />
                    </div>
                </div>

                <div className='grid grid-cols-5 gap-4'>
                    <div>
                        <input type="radio" id="anonymous" name="avatar"
                            className={`hidden modal-signup-radio-btn ${theme}`}
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
                    <div>
                        <input type="radio" id="scarlett" name="avatar"
                            className={`hidden modal-signup-radio-btn ${theme}`}
                            value="scarlett"
                            onChange={handleChange} checked={formData.avatar === 'scarlett'}
                        />
                        <label htmlFor="scarlett"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500  p-[0.5px]
                               hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Scarlett} width={400} height={400} className='rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="boy1" name="avatar"
                            className={`hidden modal-signup-radio-btn ${theme}`}
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
                            className={`hidden modal-signup-radio-btn ${theme}`}
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
                            className={`hidden modal-signup-radio-btn ${theme}`}
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
                            className={`hidden modal-signup-radio-btn ${theme}`}
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
                        <input type="radio" id="Larry" name="avatar"
                            className={`hidden modal-signup-radio-btn ${theme}`}
                            value="Larry"
                            onChange={handleChange} checked={formData.avatar === 'Larry'}
                        />
                        <label htmlFor="Larry"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Larry} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Alvin" name="avatar"
                            className={`hidden modal-signup-radio-btn ${theme}`}
                            value="Alvin"
                            onChange={handleChange} checked={formData.avatar === 'Alvin'}
                        />
                        <label htmlFor="Alvin"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Alvin} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Charlotte" name="avatar"
                            className={`hidden modal-signup-radio-btn ${theme}`}
                            value="Charlotte"
                            onChange={handleChange} checked={formData.avatar === 'Charlotte'}
                        />
                        <label htmlFor="Charlotte"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Charlotte} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Elezabeth" name="avatar"
                            className={`hidden modal-signup-radio-btn ${theme}`}
                            value="Elezabeth"
                            onChange={handleChange} checked={formData.avatar === 'Elezabeth'}
                        />
                        <label htmlFor="Elezabeth"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Elezabeth} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AvatarsModal