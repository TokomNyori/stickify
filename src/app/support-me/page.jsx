import React from 'react'
import Link from "next/link"
import Image from 'next/image'
import BMCqr from '@/assets/important/bmc-qr.png'
import GPAYqr from '@/assets/important/gpay-qr3.png'
import { AiTwotoneHeart } from "react-icons/ai";

const page = () => {
    return (
        <div className='px-3 sm:px-64 mt-10'>
            <div className='flex flex-col justify-center items-center'>
                <div className='Icon-heading mb-6 text-red-500 text-7xl'>
                    <AiTwotoneHeart className='' />
                </div>
                <div className='the-heading font-bold mb-6 text-xl'>
                    <h2>Support Stickify: A Message from the Developer</h2>
                </div>
                <div className='the-message mb-8'>
                    <p className='mb-3'>
                        As a non-profit app,
                        Stickify is committed to remaining ad-free and accessible for everyone.
                    </p>
                    <p className='mb-3'>
                        However, like any digital platform, Stickify incurs ongoing operational costs.
                        These expenses primarily include API charges necessary to power our advanced features
                        like text generation, rephrasing, and translating.
                    </p>
                    <p className='mb-3'>
                        If you find Stickify valuable and willing to contribute to its growth, consider supporting me with
                        a donation of just $1 (or any amount you're comfortable with). This is entirely voluntary, and every
                        contribution, no matter the size, makes a significant difference.
                    </p>
                    <p>
                        For users in India, you can easily donate using the Google Pay QR code. For our international users,
                        the 'Buy Me a Coffee' QR code is available for a quick and secure way to support Stickify.
                    </p>
                </div>
                <div className='transaction-section flex flex-col sm:flex-row gap-12 mb-12'>
                    <div className='indian-users flex flex-col items-center'>
                        <span className='mb-2 font-bold text-xl'>Indian Users: </span>
                        <p className='mb-1'>Scan for your donation</p>
                        <div className='mb-2'>
                            <Image src={GPAYqr} height={250} width={250} />
                        </div>
                        <div className='mb-1 italic'>Or use the UPI ID</div>
                        <div className='font-bold text-green-500'>
                            tokom.nyori-1@okhdfcbank
                        </div>
                    </div>
                    <hr className='sm:hidden' />
                    <div className='international-users flex flex-col items-center'>
                        <span className='mb-2 font-bold text-xl'>International Users: </span>
                        <p className='mb-1'>Scan for your donation</p>
                        <div className='mb-2'>
                            <Image src={BMCqr} height={265} width={265} />
                        </div>
                        <div className='mb-1 italic'>Or click</div>
                        <Link href="https://www.buymeacoffee.com/tokomnyori" target='_blank'
                            className='bg-[#FFDD00] text-gray-800 py-1 px-2 rounded-xl shadow-lg font-bold'>
                            Buy me a coffee
                        </Link>
                    </div>
                </div>
                <div className='Ending-message mb-10'>
                    <p className='mb-3'>
                        Every donation will be channeled directly into maintaining, enhancing, and securing Stickify,
                        as well as introducing new and exciting features.
                    </p>
                    <p>
                        Thank you for being a part of our journey. Your support, in any form, is deeply appreciated.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page