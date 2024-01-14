'use client'
import Image from 'next/image';
import AnonymousAvatar from '@/assets/avatars/anonymous.jpeg'
import Scarlett from '@/assets/avatars/scarlett.jpeg'
import BoyAvatar1 from '@/assets/avatars/boy1.jpeg'
import BoyAvatar2 from '@/assets/avatars/boy2.jpeg'
import GirlAvatar1 from '@/assets/avatars/girl1.jpeg'
import GirlAvatar2 from '@/assets/avatars/girl2.jpeg'
import Alvin from '@/assets/avatars/Alvin.jpeg'
import Larry from '@/assets/avatars/Larry.jpeg'
import Astra from '@/assets/avatars/Astra.jpeg'
import Orion from '@/assets/avatars/Orion.jpeg'
import Titan from '@/assets/avatars/Titan.jpeg'
import AnonymousVip from '@/assets/avatars/AnonymousVip.jpeg'
import Stickify from '@/assets/avatars/Stickify.jpeg'
import Kaze from '@/assets/avatars/Kaze.jpeg'
import Hana from '@/assets/avatars/Hana.jpeg'
import Paw from '@/assets/avatars/Paw.jpeg'
import Eagle from '@/assets/avatars/Eagle.jpeg'
import RoboCute from '@/assets/avatars/RoboCute.jpeg'
import Emma from '@/assets/avatars/Emma.jpeg'
import Luna from '@/assets/avatars/Luna.jpeg'
import Jasmine from '@/assets/avatars/Jasmine.jpeg'
import Martha from '@/assets/avatars/Martha.jpeg'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useEffect, useRef } from 'react';

const Avatars = ({ handleChange, formData, avatarModalState, toggleAvatarModalState, theme }) => {

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
                        ${avatarModalState ? "avatar-modal" : "hidden"} flex-wrap dark:brightness-[85%]`}>
            <div className='avatar-form-container flex flex-col justify-center items-center bg-white text-gray-800 dark:bg-zinc-800 
                dark:text-gray-100 py-4 px-4 rounded-3xl w-full'
                ref={avatarModalRef}
            >
                <div className='flex flex-row justify-between items-center mb-5 font-bold w-full'>
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
                    <div>
                        <input type="radio" id="AnonymousVip" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="AnonymousVip"
                            onChange={handleChange} checked={formData.avatar === 'AnonymousVip'}
                        />
                        <label htmlFor="AnonymousVip"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={AnonymousVip} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="scarlett" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
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
                        <input type="radio" id="Astra" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="Astra"
                            onChange={handleChange} checked={formData.avatar === 'Astra'}
                        />
                        <label htmlFor="Astra"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500  p-[0.5px]
                               hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Astra} width={400} height={400} className='rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Titan" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="Titan"
                            onChange={handleChange} checked={formData.avatar === 'Titan'}
                        />
                        <label htmlFor="Titan"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500  p-[0.5px]
                               hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Titan} width={400} height={400} className='rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Orion" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="Orion"
                            onChange={handleChange} checked={formData.avatar === 'Orion'}
                        />
                        <label htmlFor="Orion"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500  p-[0.5px]
                               hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Orion} width={400} height={400} className='rounded-full' />
                        </label>
                    </div>
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
                        <input type="radio" id="Larry" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
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
                            className={`hidden signup-radio-btn ${theme}`}
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
                        <input type="radio" id="Emma" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="Emma"
                            onChange={handleChange} checked={formData.avatar === 'Emma'}
                        />
                        <label htmlFor="Emma"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Emma} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Luna" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="Luna"
                            onChange={handleChange} checked={formData.avatar === 'Luna'}
                        />
                        <label htmlFor="Luna"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Luna} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Stickify" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="Stickify"
                            onChange={handleChange} checked={formData.avatar === 'Stickify'}
                        />
                        <label htmlFor="Stickify"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Stickify} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Kaze" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="Kaze"
                            onChange={handleChange} checked={formData.avatar === 'Kaze'}
                        />
                        <label htmlFor="Kaze"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Kaze} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Hana" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="Hana"
                            onChange={handleChange} checked={formData.avatar === 'Hana'}
                        />
                        <label htmlFor="Hana"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Hana} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="RoboCute" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="RoboCute"
                            onChange={handleChange} checked={formData.avatar === 'RoboCute'}
                        />
                        <label htmlFor="RoboCute"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={RoboCute} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Paw" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="Paw"
                            onChange={handleChange} checked={formData.avatar === 'Paw'}
                        />
                        <label htmlFor="Paw"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Paw} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                    <div>
                        <input type="radio" id="Eagle" name="avatar"
                            className={`hidden signup-radio-btn ${theme}`}
                            value="Eagle"
                            onChange={handleChange} checked={formData.avatar === 'Eagle'}
                        />
                        <label htmlFor="Eagle"
                            className="block w-12 h-12 rounded-full border border-gray-700 dark:border-gray-500 
                                            p-[0.5px]
                                            hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer">
                            <Image src={Eagle} width={400} height={400} className=' rounded-full' />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Avatars