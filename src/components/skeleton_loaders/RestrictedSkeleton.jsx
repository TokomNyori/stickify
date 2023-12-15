'use client'
import { BiArrowBack } from 'react-icons/bi'
import { AiOutlineRead } from 'react-icons/ai'
import { BsTranslate } from 'react-icons/bs'
import { GoPencil } from 'react-icons/go'
import { IoLockClosedOutline } from "react-icons/io5";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaNoteSticky } from 'react-icons/fa6'
import { AiOutlineYoutube } from 'react-icons/ai'
import MarkdownContent from '../others/MarkdownContent'

const RestrictedSkeleton = ({ pageColor, readingMode }) => {
    const lorem =
        `# Lorem ipsum dolor sit amet
    consectetur adipiscing elit.Nunc id velit eget neque fermentum rhoncus sit amet vitae lorem. Phasellus sit amet varius justo.
    Nullam auctor faucibus leo, vel blandit velit tincidunt sollicitudin. Proin nec dui enim. Integer eget tellus augue. Quisque 
    condimentum, enim eget elementum tincidunt, ipsum nisi volutpat dui, quis aliquet tortor nulla imperdiet dui.

    ### Lorem ipsum dolor sit amet, 
    consectetur adipiscing elit. Quisque euismod nunc non ante pellentesque, id dignissim 
    quam convallis. Duis dolor orci, euismod eget eleifend non, convallis efficitur mi. Phasellus sagittis, tortor at condimentum 
    blandit, velit mauris fringilla turpis, eget porttitor risus magna at neque. Phasellus sodales massa a viverra bibendum. Pellentesque 
    habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    In placerat orci sed leo facilisis scelerisque. Fusce sit amet luctus metus, et posuere est. Suspendisse bibendum magna non faucibus 
    vehicula. Nam neque dui, laoreet sit amet vulputate vel, efficitur sit amet nibh. Nullam felis velit, rutrum quis dui ut, condimentum 
    convallis elit. Mauris bibendum dui at tempus fringilla. Proin vel nisi scelerisque, malesuada erat ac, egestas magna.
    
    ### Donec posuere, mauris nec hendrerit gravida, 
    elit ante mollis eros, non feugiat metus sapien ut lacus. Integer scelerisque sit amet velit sed eleifend. 
    Maecenas eu tellus enim. Etiam pellentesque nisi metus, non scelerisque odio pretium vel. Phasellus eget faucibus 
    lorem, a luctus sem.`

    return (
        <div
            className={` text-gray-100 bg-[${pageColor}] text-gray-800 dark:brightness-[90%] shadow-xl 
    px-4 sm:px-8 py-4 sm:py-8 pb-20 sm:pb-20 rounded-3xl min-h-screen flex flex-col relative`}

        >
            {/* Tools */}
            <div className='controls flex gap-4 mb-6 justify-between'>
                {/* Left section */}
                <div className='relative flex flex-col items-start'>
                    <BiArrowBack className='text-3xl cursor-pointer home-link' />
                    <div className="home-link-info hidden justify-center items-start absolute top-10 bg-zinc-900 
                    opacity-80 text-white text-sm px-2 py-1 rounded-md w-20">
                        Go back
                    </div>
                </div>

                {/* Middle section */}
                <div className="flex items-center justify-center gap-3">
                    <div
                        className={`${readingMode ? 'border-gray-100' : 'border-gray-800'} border-[1.4px] px-2 rounded-lg 
                        cursor-pointer hover:scale-[1.02] transition-all duration-150 ease-in-out
                        font-bold`}

                    >
                        Summarize
                    </div>

                    <div className='relative flex flex-col items-center'>
                        <AiOutlineRead className='text-3xl cursor-pointer home-link' />
                        <div className="home-link-info hidden justify-center items-start absolute top-10 bg-zinc-900
                                    opacity-80 text-white text-sm px-2 py-1 rounded-md w-28">
                            {readingMode ? 'Default mode' : 'Reading mode'}
                        </div>
                    </div>

                    <div className={`relative flex flex-col items-center`}>
                        <BsTranslate className='text-2xl cursor-pointer home-link'

                        />
                        <div className="home-link-info hidden justify-center items-start absolute top-10 bg-zinc-900
                        opacity-80 text-white text-sm px-2 py-1 rounded-md w-20">
                            Translate
                        </div>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex justify-center items-center gap-3">
                    <div className='relative flex flex-col items-center'>
                        <IoShareSocialOutline className='text-2xl cursor-pointer home-link'
                        />
                        <div className="home-link-info hidden justify-center items-start absolute top-10 bg-zinc-900 
                            opacity-80 text-white text-sm px-2 py-1 rounded-md w-16">
                            Share
                        </div>
                    </div>
                    <div className='relative flex flex-col items-center'>
                        <GoPencil className='text-2xl cursor-pointer home-link'
                        />
                        <div className="home-link-info hidden justify-center items-start absolute top-10 bg-zinc-900 
                                opacity-80 text-white text-sm px-2 py-1 rounded-md w-16">
                            Edit
                        </div>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className='font-bold mb-2 sm:text-xl text-xl'>Stickify Notes</div>

            {/* Content */}
            <div className='note-page-main-content mb-12'>
                <div className={`note-page-main-nav font-bold mb-8`}>
                    <div
                        className={`note-page-main-items sm:text-[1.05rem] text-[1.1rem] 
                        ${readingMode ? 'border-b border-gray-100' : ''}
                        ${!readingMode ? 'border-b border-gray-800' : ''}`}
                    >
                        <FaNoteSticky className='inline text-[1.1rem]' />
                        Note
                    </div>
                    <div
                        className={`note-page-main-items sm:text-[1.05rem] text-[1.1rem]`}
                    >
                        <AiOutlineYoutube className='inline text-2xl' />
                        Videos
                    </div>
                </div>
                {/* Note Contents */}
                <div className={`flex`}>
                    <div className='sm:text-[1rem] text-[1.1rem] markDownContent'
                        style={{ whiteSpace: 'pre-line' }}>
                        <MarkdownContent texts={lorem} />
                    </div>
                </div>
                {/* Video Contents */}
                <div className={`hidden`}>

                </div>
            </div>

            <div
                className={`backdrop-blur-[5px] rounded-3xl absolute top-0 left-0 w-full h-full flex flex-col justify-start
                items-center`}>
                <div className='text-center flex flex-col justify-start items-center gap-2 mt-36'>
                    <div className='text-4xl'>
                        <IoLockClosedOutline className='text-center' />
                    </div>
                    <div className='text-4xl'>
                        Private Note
                    </div>
                    <div className='text-2xl'>
                        Access restricted.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestrictedSkeleton