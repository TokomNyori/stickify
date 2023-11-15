'use client'
import React, { useEffect, useRef, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { BiArrowBack } from 'react-icons/bi'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoIosAddCircle } from 'react-icons/io'
import { AiFillCheckCircle } from 'react-icons/ai'
import { AiFillYoutube } from 'react-icons/ai'
import YouTube from "react-youtube"
import { youtubeTenVideotHelper } from '@/helper/httpHelpers/httpNoteHelper'
import toast from 'react-hot-toast'
import YtVideoListPopup from '../popups/YtVideoListPopup'

const YtVideoAddModal = (
    { ytVideAddModalState, changeYtAddModal, ytVideoFromNote, AddToYtVideosFromYtModal, ytRefs, deleteYourYtVideo }
) => {
    const [formData, setFormData] = useState({ title: '' })
    const [ytVideos, setYtVideos] = useState([])
    const [videos, setVideos] = useState()
    const [navSection, setNavSection] = useState()

    useEffect(() => {
        if (ytVideos.length > 0) {
            let videos = ytVideos?.map(video => {
                return (
                    <div key={video?.ytVideoId}>
                        <div className='youtubePlayer-YtAddModal rounded-2xl mb-2'>
                            <YouTube
                                className='youtubeVideo-NotePage rounded-2xl shadow-lg flex-grow w-full'
                                iframeClassName='youtubeVideo-NotePage rounded-2xl shadow-lg flex-grow'
                                videoId={video?.ytVideoId}
                                opts={opts}
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            {
                                video.added ?
                                    <div className=' cursor-pointer'
                                        onClick={() => handleAddVideo({ operation: 'remove', id: video?.ytVideoId })}>
                                        <AiFillCheckCircle className='text-5xl text-green-500' />
                                    </div>
                                    :
                                    <div className=' cursor-pointer'
                                        onClick={() => handleAddVideo(
                                            { operation: 'add', id: video?.ytVideoId, title: video?.videoTitle }
                                        )}>
                                        <IoIosAddCircle className='text-5xl' />
                                    </div>
                            }
                            <div className='w-full line-clamp-2'>{video?.videoTitle}</div>
                        </div>
                    </div>
                )
            })
            setVideos(videos)
        }
    }, [ytVideos])

    useEffect(() => {
        const nav = ytVideoFromNote.length > 0 ? 'your videos' : 'add videos'
        console.log(nav)
        setNavSection(nav)
    }, [ytVideAddModalState])

    const opts = {
        playerVars: {
            autoplay: 0,
        },
    };

    console.log('noteFromModal.ytVideo.length')
    console.log(ytVideoFromNote.length)

    function handleAddVideo({ operation, id, title }) {
        if (ytVideoFromNote.length >= 5 && operation === 'add') {
            toast('Limit: 5 videos. Delete videos from note.',
                {
                    icon: '🥹',
                    duration: 4000
                })
            return
        }
        setYtVideos(prev => {
            const objects = prev.map(objt => {
                if (objt.ytVideoId === id) {
                    return {
                        ...objt,
                        added: operation === 'add' ? true : false
                    }
                } else {
                    return {
                        ...objt
                    }
                }
            })
            return objects
        })
        operation === 'add' ?
            AddToYtVideosFromYtModal({ id: id, operation: 'add', title: title, })
            :
            AddToYtVideosFromYtModal({ id: id, operation: 'remove' })
        operation === 'add' ? toast.success('Added') : toast('Removed', { icon: '✂️' })
    }

    function handleFormData(e) {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSearch(e) {
        e.preventDefault()
        const ytTitle = `${formData.title}`
        try {
            const res = await youtubeTenVideotHelper(
                {
                    method: 'GET',
                    title: ytTitle,
                    youtube_api_key: process.env.NEXT_PUBLIC_YOUTUBE_API,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            // console.log(res)
            const items = res.items
            const itemsArray = items.map(item => {
                return {
                    ytVideoId: item.id.videoId,
                    videoThumbnail: item.snippet.thumbnails.default,
                    videoTitle: item.snippet.title,
                    added: false,
                }
            })
            setYtVideos(itemsArray)
        } catch (error) {
            console.log(error)
        }
    }

    function handleNav(section) {
        setNavSection(section)
    }

    // console.log(ytVideos)

    return (
        <div
            className={`youtube-popup-list-blur inset-0 flex justify-center items-center backdrop-blur-[1px]
                    ${ytVideAddModalState ? "yt-fix-modal" : "hidden"} flex-wrap`}
        >
            <div className="yt-video-add-modal bg-zinc-900 rounded-3xl text-gray-100">
                <div className='flex justify-around mb-3'>
                    <div className={`flex justify-center items-center gap-1 flex-1 py-2 cursor-pointer
                            ${navSection === 'add videos' ? 'border-b' : ''}`}
                        onClick={() => handleNav('add videos')}>
                        <IoIosAddCircle className='text-2xl inline text-green-500' />
                        Add videos
                    </div>
                    <div className={`flex justify-center items-center gap-1 flex-1 py-2 cursor-pointer
                            ${navSection === 'your videos' ? 'border-b' : ''}`}
                        onClick={() => handleNav('your videos')}>
                        <AiFillYoutube className='text-2xl inline text-red-500' />
                        Your videos
                    </div>
                </div>
                {
                    navSection === 'add videos' ?
                        <div className='flex flex-col'>
                            <form className='flex items-center justify-center'
                                onSubmit={handleSearch}>
                                <input
                                    className='rounded-3xl rounded-r-none block w-full bg-zinc-900 p-2.5 pl-3 h-[2.5rem] py-4 sm:py-3 
                                text-md dark:placeholder-gray-400 dark:text-white border border-gray-600
                                outline-none focus:ring-0 border-r-0'
                                    type="text"
                                    name="title"
                                    placeholder="Search"
                                    value={formData.title}
                                    onChange={handleFormData}
                                    required
                                />
                                <button className='rounded-3xl rounded-l-none px-2 bg-zinc-700 h-[2.5rem] border border-gray-600 border-l-0'
                                    type='submit'>
                                    <AiOutlineSearch className='text-3xl' />
                                </button>
                            </form>
                            <div className="flex flex-col gap-7 mt-6">
                                {videos}
                            </div>
                        </div>
                        :
                        <div>
                            {
                                ytVideoFromNote.length < 1 ?
                                    <div className='flex justify-center items-center mt-20 text-2xl'>
                                        Empty
                                    </div>
                                    :
                                    <YtVideoListPopup
                                        ytVideoFromNote={ytVideoFromNote}
                                        ytRefs={ytRefs}
                                        deleteYourYtVideo={deleteYourYtVideo}
                                    />

                            }
                        </div>
                }
                <div className="fixed sm:bottom-12 bottom-20 sm:right-12 right-6">
                    <div className=' bg-red-500 shadow-md shadow-white rounded-full w-14 h-14 flex 
                    items-center justify-center tracking-wide font-bold'
                        onClick={changeYtAddModal}>
                        <BiArrowBack className='text-4xl text-white font-bold' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default YtVideoAddModal