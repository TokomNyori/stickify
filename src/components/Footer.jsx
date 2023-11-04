import Link from 'next/link'
import React from 'react'
import { AiOutlineInstagram } from 'react-icons/ai'
import { AiOutlineMail } from 'react-icons/ai'
import { AiFillGithub } from 'react-icons/ai'

const Footer = () => {
    return (
        <div className='dark:bg-gray-800/50 bg-[#f6f8f6] flex flex-col justify-center items-center pt-5 pb-10 px-3 sm:px-6 w-full
        text-[1.1rem] sm:text-[1rem]'>
            <div><span className='italic'>stickify</span>&#169; 2023</div>
            <div className='flex gap-3 mt-2'>
                <Link href='https://www.instagram.com/geekpie.in/' target='_blank'>
                    <AiOutlineInstagram className='text-2xl text-pink-500/90' />
                </Link>
                <Link href='https://www.github.com/TokomNyori/' target='_blank'>
                    <AiFillGithub className='text-2xl dark:text-slate-200/90' />
                </Link>
                <Link href='mailto:tokom.nyori@gmail.com' target='_blank'>
                    <AiOutlineMail className='text-2xl text-green-400/90' />
                </Link>
            </div>
        </div>
    )
}

export default Footer