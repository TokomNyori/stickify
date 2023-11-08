import React from 'react'
import { MdDelete } from 'react-icons/md'
import { BiArrowBack } from 'react-icons/bi'
import YouTube from "react-youtube"

const YoutubeModal = ({
    youtubeVideoModalState, changeYoutubeVideoModal, ytVideoId, youtubeVideoModLRef, deleteYoutubeVideoFromModal
}) => {

    const opts = {
        borderRadius: '10px',
        playerVars: {
            autoplay: 0,
        },
    };
    return (
        <div
            className={`youtube-modal-blur inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center
                    ${youtubeVideoModalState ? "gpt-fix-modal" : "hidden"} flex-wrap`}>
            <div className='youtubePlayer flex flex-col items-end'>
                <div className='text-2xl text-white flex justify-center items-center gap-4 bg-gray-950 sm:w-[20%] w-[25%]
                    h-10 px-2 py-1 rounded-xl rounded-b-none mr-[0.5px]'>
                    <div onClick={deleteYoutubeVideoFromModal}>
                        <MdDelete />
                    </div>
                    <div onClick={changeYoutubeVideoModal}>
                        <BiArrowBack />
                    </div>
                </div>
                <YouTube
                    ref={youtubeVideoModLRef}
                    className='youtubeVideo rounded-xl rounded-tr-none flex-grow'
                    iframeClassName='youtubeVideo rounded-xl rounded-tr-none flex-grow'
                    videoId={ytVideoId}
                    opts={opts}
                />
            </div>
        </div>
    )
}

export default YoutubeModal