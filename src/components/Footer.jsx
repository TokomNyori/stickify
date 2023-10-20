import Link from 'next/link'
import React from 'react'
import { AiOutlineInstagram } from 'react-icons/ai'
import { AiOutlineMail } from 'react-icons/ai'
import { AiFillGithub } from 'react-icons/ai'

const Footer = () => {
    return (
        <div className='bg-gray-800/50 flex flex-col justify-center items-center pt-4 pb-8 px-3 sm:px-5 w-full'>
            <div><span className='italic'>stickify</span>&#169; 2023</div>
            <div className='flex gap-3 mt-2'>
                <Link href='https://www.instagram.com/geekpie.in/' target='_blank'>
                    <AiOutlineInstagram className='text-xl text-pink-500/90' />
                </Link>
                <Link href='https://www.github.com/TokomNyori/' target='_blank'>
                    <AiFillGithub className='text-xl text-slate-200/90' />
                </Link>
                <Link href='mailto:tokom.nyori@gmail.com' target='_blank'>
                    <AiOutlineMail className='text-xl text-green-400/90' />
                </Link>
            </div>
        </div>
    )
}

export default Footer