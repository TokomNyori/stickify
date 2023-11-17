'use client'
import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube"
import { MdDelete } from 'react-icons/md'
import { BiArrowBack } from 'react-icons/bi'

const YourVideoPopup = (
    {
        ytVideoFromNote,
        ytRefs,
        deleteYourYtVideo
    }
) => {

    const opts = {
        playerVars: {
            autoplay: 0,
        },
    };
    let count = -1
    const videos = ytVideoFromNote.map(items => {
        count++
        return (
            <div key={items?.ytVideoId}>
                <div className='youtubePlayer-YtAddModal rounded-2xl mb-2'>
                    <YouTube
                        ref={ytRefs[count]}
                        className='youtubeVideo-NotePage rounded-2xl shadow-lg flex-grow w-full'
                        iframeClassName='youtubeVideo-NotePage rounded-2xl shadow-lg flex-grow'
                        videoId={items?.ytVideoId}
                        opts={opts}
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <div className=' cursor-pointer text-zinc-900 bg-zinc-100 rounded-full p-1'
                        onClick={() => deleteYourYtVideo(items?.ytVideoId)}>
                        <MdDelete className='text-3xl' />
                    </div>
                    <div className='w-full line-clamp-2'>{items?.ytVideoTitle}</div>
                </div>
            </div>
        )
    })

    // console.log(videos)

    return (
        <div className="ytVideos-popup mt-4">
            {videos}
        </div>
    )
}

export default YourVideoPopup