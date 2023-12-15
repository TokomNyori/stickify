'use client'
import React, { useState } from 'react'
import { WhatsappShareButton, TelegramShareButton } from 'react-share'
//import { IoLogoWhatsapp } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTelegram } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa6";
import { FaCopy } from "react-icons/fa6";
import toast from 'react-hot-toast';

const HelperModal = ({ shareModalState, readingMode, shareModalRef, linkparam, noteTitle }) => {
    const [copiedText, setCopiedText] = useState(`http://localhost:3000/notes/${linkparam}`)
    const [copied, setCopied] = useState(false)

    async function copyText() {
        await navigator.clipboard.writeText(copiedText)
        setCopied(true)
        toast.success('Link copied')
        setTimeout(() => {
            setCopied(false)
        }, 1000);
    }

    return (
        <div
            className={`${shareModalState ? 'shareModal' : 'hidden'}  backdrop-blur-[12px] font-semibold rounded-tr-none
            ${readingMode ? 'text-gray-100 bg-zinc-900' : 'text-gray-800 bg-zinc-50'} shadow-xl rounded-2xl`}
            ref={shareModalRef}
        >
            <div className='text-center'>
                Share
            </div>

            <div className='flex justify-center items-center gap-3'>
                <div className='hover:scale-110 transition-transform duration-200 ease-in-out'>
                    <WhatsappShareButton
                        title={`Title: ${noteTitle}`}
                        url={`http://localhost:3000/notes/${linkparam}`}
                    >
                        <IoLogoWhatsapp className='text-4xl text-green-500' />
                    </WhatsappShareButton>
                </div>
                <div className='hover:scale-110 transition-transform duration-200 ease-in-out'>
                    <TelegramShareButton
                        title={`Title: ${noteTitle}`}
                        url={`http://localhost:3000/notes/${linkparam}`}
                    >
                        <FaTelegram className='text-[2rem] text-blue-500' />
                    </TelegramShareButton>
                </div>
                <div className='hover:scale-110 transition-transform duration-200 ease-in-out'>
                    {
                        copied ?
                            <div className='flex items-start justify-center cursor-pointer mb-1.5'>
                                <FaCopy className='text-[1.7rem]' />
                            </div>
                            :
                            <div className='flex items-start justify-center cursor-pointer mb-1.5'
                                onClick={copyText}>
                                <FaRegCopy className='text-[1.7rem]' />
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default HelperModal