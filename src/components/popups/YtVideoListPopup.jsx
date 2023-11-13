'use client'
import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube"
import { MdDelete } from 'react-icons/md'
import { BiArrowBack } from 'react-icons/bi'

const YtVideoListPopup = (
    {
        ytVideoListPopupState,
        ytVideo, changeYtPopup,
        ytRefs,
        deleteYtVideoFromPopup
    }
) => {

    const ytVideoPopUpRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (ytVideoPopUpRef.current && !ytVideoPopUpRef.current.contains(event.target)) {
                changeYtPopup()
            }
        };

        if (ytVideoListPopupState) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [ytVideoListPopupState]);

    const opts = {
        playerVars: {
            autoplay: 0,
        },
    };
    let count = -1
    const videos = ytVideo.map(items => {
        count++
        return (
            <div className='youtubePlayer1 flex flex-col items-end justify-center shadow-md shadow-white rounded-2xl'
                key={items.ytVideoId} >
                <div className='text-2xl text-white flex justify-start items-center gap-4 bg-gray-900
                    h-10 px-2.5 py-1 rounded-2xl rounded-b-none w-full'>
                    <div className="text-sm flex-grow truncate">
                        <span>{items.ytVideoTitle}</span>
                    </div>
                    <div className=" cursor-pointer"
                        onClick={() => deleteYtVideoFromPopup(items.ytVideoId)}>
                        <MdDelete />
                    </div>
                </div>
                <YouTube
                    ref={ytRefs[count]}
                    className='youtubeVideo1 rounded-2xl rounded-tr-none flex-grow'
                    iframeClassName='youtubeVideo1 rounded-xl rounded-t-none flex-grow'
                    videoId={items.ytVideoId}
                    opts={opts}
                />
            </div>
        )
    })

    // console.log(videos)

    return (
        <div
            className={`youtube-popup-list-blur inset-0 flex justify-center items-center backdrop-blur-[1px]
                    ${ytVideoListPopupState ? "gpt-fix-modal" : "hidden"} flex-wrap`}
        >
            <div className="yt-video-list-popup bg-gray-700 rounded-2xl text-gray-100" ref={ytVideoPopUpRef}>
                <div className="flex justify-between items-center font-bold text-xl mb-3">
                    <div className="ml-2">Videos</div>
                    <div className="mr-2" onClick={changeYtPopup}>
                        <BiArrowBack className="text-4xl" />
                    </div>
                </div>
                <div className="ytVideos-popup">
                    {videos}
                </div>
            </div>
        </div>
    )
}

export default YtVideoListPopup