'use client'
import Lottie from 'lottie-react'
import notfoundAni from '@/assets/others/notfoundAni.json'

const NoteNotFound = ({ readingMode }) => {

    return (
        <div
            className={` text-gray-100 bg-zinc-800 dark:brightness-[90%] shadow-xl skeleton3 items-center
                px-4 sm:px-8 py-4 sm:py-8 pb-20 sm:pb-20 rounded-3xl min-h-screen flex flex-col justify-start relative`}

        >
            <div className='mt-16 text-3xl'>
                Note not found
            </div>
            <div className="text-2xl mt-4 font-bold text-[#f1f5f9] w-full sm:w-[50%]">
                <Lottie className="text-sm" animationData={notfoundAni} loop={true} />
            </div>
        </div>
    )
}

export default NoteNotFound