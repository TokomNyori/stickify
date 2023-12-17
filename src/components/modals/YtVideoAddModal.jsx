'use client'
import React, { useEffect, useRef, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { BiArrowBack } from 'react-icons/bi'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoIosAddCircle } from 'react-icons/io'
import { AiFillCheckCircle } from 'react-icons/ai'
import { AiFillYoutube } from 'react-icons/ai'
import YouTube from "react-youtube"
import toast from 'react-hot-toast'
import YourVideoPopup from '../popups/YourVideoPopup'
import { nanoid } from 'nanoid'
import ClipLoader from "react-spinners/BounceLoader";
import { youtubeTenVideotHelper } from '@/helper/externalAPIHelpers/handleExternalAPIs'
//videoThumbnail: item.snippet.thumbnails.default
const YtVideoAddModal = (
    { ytVideAddModalState, changeYtAddModal, ytVideoFromNote, AddToYtVideosFromYtModal, ytRefs, deleteYourYtVideo }
) => {
    const [formData, setFormData] = useState({ title: '' })
    const [ytVideos, setYtVideos] = useState([])
    const [videos, setVideos] = useState([])
    const [navSection, setNavSection] = useState()
    const [ytLoading, setYtLoading] = useState(false)
    const ytVideoModalUpRef = useRef(null);
    // Local Yt video refs
    const ytVideoAddModalRefs0 = useRef(null)
    const ytVideoAddModalRefs1 = useRef(null)
    const ytVideoAddModalRefs2 = useRef(null)
    const ytVideoAddModalRefs3 = useRef(null)
    const ytVideoAddModalRefs4 = useRef(null)
    const ytVideoAddModalRefs5 = useRef(null)
    const ytVideoAddModalRefs6 = useRef(null)
    const ytVideoAddModalRefs7 = useRef(null)
    const ytVideoAddModalRefs8 = useRef(null)
    const ytVideoAddModalRefs9 = useRef(null)
    const ytVideoAddModalRefs10 = useRef(null)
    const ytVideoAddModalRefs11 = useRef(null)
    const ytVideoAddModalRefs12 = useRef(null)
    const ytVideoAddModalRefs13 = useRef(null)
    const ytVideoAddModalRefs14 = useRef(null)
    const ytVideoPlayerAddModalRefs = [ytVideoAddModalRefs0, ytVideoAddModalRefs1, ytVideoAddModalRefs2, ytVideoAddModalRefs3,
        ytVideoAddModalRefs4, ytVideoAddModalRefs5, ytVideoAddModalRefs6, ytVideoAddModalRefs7, ytVideoAddModalRefs8,
        ytVideoAddModalRefs9, ytVideoAddModalRefs10, ytVideoAddModalRefs11, ytVideoAddModalRefs12, ytVideoAddModalRefs13,
        ytVideoAddModalRefs14]


    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (ytVideoModalUpRef.current && !ytVideoModalUpRef.current.contains(event.target)) {
                eraseVideosAndClose()
            }
        };

        if (ytVideAddModalState) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [ytVideAddModalState]);

    useEffect(() => {
        let count = -1
        if (ytVideos.length > 0) {
            let videos = ytVideos?.map((video, index) => {
                count++
                return (
                    <div key={`${index}ytVideos`}>
                        <div className='youtubePlayer-YtAddModal rounded-2xl mb-2 skeleton2'>
                            <YouTube
                                ref={ytVideoPlayerAddModalRefs[count]}
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
                                        onClick={() => handleAddVideo(
                                            { operation: 'remove', id: video?.ytVideoId }
                                        )}>
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
    }, [ytVideos, ytVideoFromNote])

    useEffect(() => {
        const nav = ytVideoFromNote.length > 0 ? 'your videos' : 'add videos'
        // console.log(nav)
        setNavSection(nav)
    }, [ytVideAddModalState])

    useEffect(() => {
        if (navSection !== 'your videos') {
            for (let i = 0; i < ytVideoFromNote.length; i++) {
                if (ytRefs[i].current) {
                    ytRefs[i].current.getInternalPlayer().pauseVideo();
                }
            }
        } else if (navSection !== 'add videos') {
            for (let i = 0; i < ytVideos.length; i++) {
                if (ytVideoPlayerAddModalRefs[i].current) {
                    ytVideoPlayerAddModalRefs[i].current.getInternalPlayer().pauseVideo();
                }
            }
        }
    }, [navSection])

    const opts = {
        playerVars: {
            autoplay: 0,
        },
    };

    function handleAddVideo({ operation, id, title }) {
        // console.log('.ytVideo.length Inside')
        // console.log(ytVideoLength)
        if (ytVideoFromNote.length >= 7 && operation === 'add') {
            toast('Limit: 7 videos. Delete videos from note.',
                {
                    icon: '🥹',
                    duration: 4000
                })
            return
        }
        setTimeout(() => {
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
        }, 20);
        operation === 'add' ?
            AddToYtVideosFromYtModal({ id: id, operation: 'add', title: title })
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
        setYtLoading(true)
        try {
            const res = await youtubeTenVideotHelper(
                {
                    method: 'GET',
                    title: ytTitle,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            // console.log(nanoid())
            const items = res.items
            const itemsArray = items.map((item) => {
                return {
                    ytVideoId: item.id.videoId,
                    videoTitle: item.snippet.title,
                    added: handleAddedValue(item.id.videoId),
                }
            })
            setYtVideos(itemsArray)
            setYtLoading(false)
        } catch (error) {
            setYtLoading(false)
            console.log(error)
        }
    }

    function handleAddedValue(id) {
        let addedValue = false
        ytVideoFromNote?.forEach(yts => {
            if (yts.ytVideoId === id) {
                addedValue = true
            }
        })
        return addedValue
    }

    function handleNav(section) {
        setNavSection(section)
    }

    function eraseVideosAndClose() {
        setFormData({ title: '' })
        setYtVideos([])
        setVideos([])
        changeYtAddModal()
        // for (let i = 0; i < ytVideos.length; i++) {
        //     if (ytVideoPlayerAddModalRefs[i].current) {
        //         ytVideoPlayerAddModalRefs[i].current.getInternalPlayer().pauseVideo();
        //     }
        // }
    }

    function changeYtVideoAdded(id) {
        setYtVideos(prev => {
            const objects = prev.map(objt => {
                if (objt.ytVideoId === id) {
                    return {
                        ...objt,
                        added: false
                    }
                } else {
                    return {
                        ...objt
                    }
                }
            })
            return objects
        })
    }

    //console.log(videos)

    return (
        <div
            className={`youtube-popup-list-blur inset-0 flex justify-center items-center backdrop-blur-[1px]
                    ${ytVideAddModalState ? "yt-fix-modal" : "hidden"} flex-wrap`}
        >
            <div className="yt-video-add-modal bg-zinc-900 rounded-3xl text-gray-100"
                ref={ytVideoModalUpRef}
            >
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
                        Your videos {ytVideoFromNote.length > 0 ? `(${ytVideoFromNote.length})` : ''}
                    </div>
                </div>
                {/* Add Videos Section */}
                <div className={`${navSection === 'add videos' ? 'flex flex-col' : 'hidden'}`}>
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
                        {
                            ytLoading ?
                                <div
                                    className={`flex justify-center items-center mt-14`}>
                                    <ClipLoader
                                        color='#f1f5f9'
                                        loading='Generating...'
                                        //cssOverride={override}
                                        size={150}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                        speedMultiplier={1}
                                    />
                                </div>
                                :
                                videos
                        }
                    </div>
                </div>
                {/* Your Videos Section */}
                <div className={`${navSection === 'your videos' ? 'flex flex-col' : 'hidden'}`}>
                    {
                        ytVideoFromNote.length < 1 ?
                            <div className='flex justify-center items-center mt-20 text-2xl'>
                                Empty
                            </div>
                            :
                            <YourVideoPopup
                                ytVideoFromNote={ytVideoFromNote}
                                ytRefs={ytRefs}
                                deleteYourYtVideo={deleteYourYtVideo}
                                ytVideos={ytVideos}
                                changeYtVideoAdded={changeYtVideoAdded}
                            />
                    }
                </div>
                <div className="fixed sm:bottom-14 bottom-36 sm:right-20 right-6 ytModal-back-btn">
                    <div className=' bg-zinc-800 border-4 shadow-lg rounded-full w-16 h-16 flex 
                    items-center justify-center tracking-wide font-bold cursor-pointer brightness-110 ytModal-back-btn-div'
                        onClick={eraseVideosAndClose}>
                        <BiArrowBack className='text-4xl font-bold ytModal-back-btn-icon' />
                        {/* <span className='text-red-500 text-xl font-bold cursor-pointer'>Back</span> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default YtVideoAddModal