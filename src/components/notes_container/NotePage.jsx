'use client'
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@/redux_features/user/userSlice';
import { useEffect, useRef, useState } from 'react';
import { addPage } from '@/redux_features/pages/pageSlice';
import { CookieHelper } from '@/helper/httpHelpers/httpCookieHelper';
import { useRouter, useSearchParams } from 'next/navigation'
import { BiArrowBack } from 'react-icons/bi'
import { AiOutlineRead } from 'react-icons/ai'
import { AiFillRead } from 'react-icons/ai'
import { BsTranslate } from 'react-icons/bs'
import { IoBanSharp } from 'react-icons/io5'
import { AiOutlineSound } from 'react-icons/ai'
import { GoPlay } from "react-icons/go";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaRegCircleStop } from "react-icons/fa6";
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { GoPencil } from 'react-icons/go'
import { FaNoteSticky } from 'react-icons/fa6'
import { FaRegNoteSticky } from 'react-icons/fa6'
import { AiOutlineYoutube } from 'react-icons/ai'
import { AiFillYoutube } from 'react-icons/ai'
import { AiFillHeart } from 'react-icons/ai'
import { FaCopy } from "react-icons/fa6";
import { MdOutlinePublic } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { FaRegStopCircle } from "react-icons/fa";
import { useTheme } from 'next-themes';
import Image from 'next/image'
import { getSingleNoteHelper } from '@/helper/httpHelpers/httpNoteHelper';
import ClipLoader from "react-spinners/GridLoader";
import toast, { Toaster } from 'react-hot-toast';
import { setNoteModalConfig } from '@/redux_features/noteModalConfig/noteModalConfigSlice';
import { addCurrentNotePage } from '@/redux_features/currentNotePage/currentNotePageSlice';
import YouTube from "react-youtube";
import { openAiGptTextGeneration } from '@/helper/externalAPIHelpers/handleExternalAPIs';
import {
    formatDistanceToNowStrict, differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks,
    isValid, differenceInYears, format
} from 'date-fns';
import MarkdownContent from '../others/MarkdownContent';
import { useCompletion } from 'ai/react'
import TranslateComponent from '../others/TranslateComponent';

const NotePage = ({ params }) => {
    const pageNoteData = useSelector(state => state.currentNotePage.currentNotePage)
    const users = useSelector(state => state.user.users)
    const [readingMode, setReadingMode] = useState(false)
    const [loadingGpt, setLoadingGpt] = useState(false)
    const [navigationSection, setNavigationSection] = useState('note-section')
    const [videoSection, setVideoSection] = useState([])
    const [timeStamp, setTimeStamp] = useState()
    const dispatch = useDispatch()
    const { theme, setTheme } = useTheme()
    const themeRedux = useSelector(state => state.currentTheme.currentTheme)
    const [translatePopUp, setTranslatePopUp] = useState(false)
    const notes = useSelector(state => state.note.notes)
    const translatePopUpRef = useRef(null);

    useEffect(() => {
        getUserCookie()
        dispatch(addPage('noteid'))
        if (Object.keys(pageNoteData).length === 0) {
            getSingleNote(params?.note)
        }
    }, [])

    useEffect(() => {
        if (readingMode) {
            setTheme('dark')
        } else {
            setTheme(themeRedux)
        }
    }, [readingMode])

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (translatePopUpRef.current && !translatePopUpRef.current.contains(event.target)) {
                setTranslatePopUp(false)
            }
        };

        if (translatePopUp) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [translatePopUp]);

    const ytListNoteVideosRefs0 = useRef(null)
    const ytListNoteVideosRefs1 = useRef(null)
    const ytListNoteVideosRefs2 = useRef(null)
    const ytListNoteVideosRefs3 = useRef(null)
    const ytListNoteVideosRefs4 = useRef(null)
    const ytListNoteVideosRefs5 = useRef(null)
    const ytListNoteVideosRefs6 = useRef(null)
    const ytRefs = [ytListNoteVideosRefs0, ytListNoteVideosRefs1, ytListNoteVideosRefs2, ytListNoteVideosRefs3, ytListNoteVideosRefs4,
        ytListNoteVideosRefs5, ytListNoteVideosRefs6]

    // const [isSummarized, setIsSummarized] = useState(false)
    // const [isTranslated, setIsTranslated] = useState(false)
    const [translatedContent, setTranslatedContent] = useState('')
    const [summarizedContent, setSummarizedContent] = useState('')
    const [summarizedGptData, setSummarizedGptData] = useState({})
    const [language, setLanguage] = useState('English')
    const [gptOperationMode, setGptOperationMode] = useState('')
    const [stopStreamingForTranslate, setStopStreamingForTranslate] = useState(false)
    const router = useRouter()
    const contentContainerRef = useRef(null);

    useEffect(() => {
        if (pageNoteData.ytVideo) {
            let count = -1
            const ctx = pageNoteData.ytVideo.map(video => {
                count++
                return (
                    <div className='sm:mb-10 mb-8'>
                        <div className={`${readingMode ? 'text-gray-100' : 'text-gray-800'} 
                            mb-2 ml-1 w-full flex`}>
                            <span className='sm:text-[1rem] text-[1.1rem] line-clamp-2 w-full'>{video.ytVideoTitle}</span>
                        </div>
                        <div className='youtubePlayer-NotePage' >
                            <YouTube
                                ref={ytRefs[count]}
                                className='youtubeVideo-NotePage rounded-2xl shadow-lg flex-grow'
                                iframeClassName='youtubeVideo-NotePage rounded-2xl shadow-lg flex-grow'
                                videoId={video.ytVideoId}
                                opts={opts}
                            />
                        </div>
                    </div>
                )
            })
            setVideoSection(ctx)
        }
    }, [pageNoteData, readingMode])

    useEffect(() => {
        const timeStmp = formatDate(pageNoteData?.coreUpdated)
        setTimeStamp(timeStmp)
    }, [pageNoteData])

    const {
        completion,
        input,
        stop,
        isLoading,
        handleInputChange,
        handleSubmit,
        complete,
    } = useCompletion({
        api: '/api/completion-others',
        body: {
            geyi: summarizedGptData,
        },
        initialInput: 'Hello world!',
        onError: (error) => {
            console.log(error)
            //changeStreamGptLoader(false)
            toast('Sorry, could not summarize', {
                icon: '🥺'
            })
        },
        onResponse: (res) => {
            console.log(res)
        },
        onFinish: () => {
            toast('Summarized!', {
                icon: '😀'
            })
        },
    });

    useEffect(() => {
        if (completion) {
            setSummarizedContent(completion)
        }
    }, [completion])

    useEffect(() => {
        if (isLoading) {
            setLoadingGpt(true)
        } else {
            setLoadingGpt(false)
        }
    }, [isLoading])

    useEffect(() => {
        if (loadingGpt) { // Or any other condition that indicates new content
            const offset = 800; // Pixels to stop above the absolute bottom
            const scrollPosition = document.documentElement.scrollHeight - offset;
            window.scrollTo({
                top: scrollPosition,
                behavior: "smooth" // Optional: for smooth scrolling
            });
        }
    }, [summarizedContent, translatedContent]);

    console.log(completion)


    async function getUserCookie() {
        try {
            const res = await CookieHelper()
            console.log('CookieHelper')
            console.log(res)
            dispatch(addUser(res.body))
        } catch (error) {
            console.log('CookieHelper Error')
            console.log(error.message)
        }
    }

    async function getSingleNote(id) {
        const res = await getSingleNoteHelper({ method: 'GET', noteid: id })
        console.log(res.body)
        dispatch(addCurrentNotePage(res.body))
    }

    function toggleReadingMode() {
        setReadingMode(prev => !prev)
    }

    function goBack() {
        setTheme(themeRedux)
        router.back()
    }


    async function summarizeContent(event) {
        event.preventDefault()
        if (language !== 'English') {
            toast('Available only in English', {
                icon: '😔'
            })
            return
        }
        //const words = `${generateRequirementGpt.words}`
        const instruction = `Concisely summarize the following content, capturing the essential points and main ideas, and format the summary using Markdown. Focus on brevity and clarity, avoiding unnecessary details. Keep the summary as short as posible. The content is: ${pageNoteData.content}`
        const gptData = {
            model: 'gpt-3.5-turbo-1106',
            temperature: 0.5,
            max_tokens: 1000,
            stream: true,
            messages: [
                {
                    'role': 'system',
                    'content': "Generate a Markdown-formatted summary of the provided content, focusing on distilling the main ideas and crucial points. Ensure the summary is concise, coherent, and retains the essence of the original content.",
                },
                {
                    'role': 'user',
                    'content': instruction,
                }
            ]
        }

        setSummarizedGptData(gptData)
        //setSharedGptData(gptData)
        setGptOperationMode('summarize')
        //setIsSummarized(true)
        setTimeout(() => {
            handleSubmit(event)
        }, 20);

        // try {
        //     setLoadingGpt(true)
        //     const res = await openAiGptTextGeneration({ gptData: gptData })
        //     setSummarizedContent(res.choices[0].message.content)
        //     setLoadingGpt(false)
        //     toast('Summarized!', {
        //         icon: '😀'
        //     })
        // } catch (error) {
        //     setLoadingGpt(false)
        //     toast(error.message, {
        //         icon: '😔'
        //     })
        // }
    }


    function editNote(e) {
        e.stopPropagation()
        //const clickedNote = notes.filter(note => note._id === noteid)[0]
        dispatch(setNoteModalConfig({ noteModalState: true, as: 'edit', noteObject: pageNoteData }))
    }

    // console.log('noteData')
    // console.log(pageNoteData)

    function undoContent() {
        setGptOperationMode('')

        setSummarizedContent('')
        toast('Back to the original', {
            icon: '😀'
        })
    }

    function undoTranslate() {
        setGptOperationMode('')
        setTranslatedContent('')
        setSummarizedContent('')
        setLanguage('English')
        setTranslatePopUp(false)
        toast('Back to English', {
            icon: '📖'
        })
    }

    function setLanguageFunction(val) {
        setLanguage(val)
        setTranslatePopUp(false)
    }

    function setLoadingGptFunction(val) {
        setLoadingGpt(val)
    }

    function setTranslatedContentFunction(content) {
        setTranslatedContent(content)
    }

    function stopSreaming(val) {
        stop()
        setStopStreamingForTranslate(val)
    }

    const opts = {
        playerVars: {
            autoplay: 0,
        },
    };

    async function navigateNav(navSection) {
        if (navSection === 'note-section') {
            setNavigationSection('note-section')
            if (pageNoteData.ytVideo.length > 0) {
                for (let i = 0; i < pageNoteData.ytVideo.length; i++) {
                    if (ytRefs[i].current) {
                        ytRefs[i].current.getInternalPlayer().pauseVideo();
                    }
                }
            }
        } else if (navSection === 'videos-section') {
            setNavigationSection('videos-section')
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        if (!isValid(date)) {
            console.error('Invalid date:', dateString);
            return '';
        }
        const now = new Date();
        const diffInMinutes = differenceInMinutes(now, date);
        const diffInHours = differenceInHours(now, date);
        const diffInDays = differenceInDays(now, date);
        const diffInWeeks = differenceInWeeks(now, date);

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
        if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
        if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
        if (diffInWeeks < 5) return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
        if (now.getFullYear() === date.getFullYear()) return format(date, 'd MMM'); // return the date in "d MMM" format for current year
        return format(date, 'MMM yyyy'); // return the date in "MMM yyyy" format for different years
    }

    return (
        <>
            <div className={`
                ${readingMode ? ` bg-zinc-800 text-gray-100 brightness-[90%]` :
                    `bg-[${pageNoteData.color}] text-gray-800 dark:brightness-[90%] shadow-xl`} 
                    px-4 sm:px-8 py-4 sm:py-8 pb-20 sm:pb-20 rounded-3xl min-h-screen flex flex-col`}

            >
                <div className='controls flex gap-4 mb-4 justify-between'>
                    <div className='relative flex flex-col items-start'>
                        <BiArrowBack className='text-3xl cursor-pointer home-link' onClick={goBack} />
                        <div className="home-link-info hidden justify-center items-start absolute top-10 bg-zinc-900 
                                    opacity-80 text-white text-sm px-2 py-1 rounded-md w-20">
                            Go back
                        </div>
                    </div>

                    {/* Tools */}
                    <div className="flex items-center justify-center gap-3">
                        <div className='relative flex flex-col items-center'>
                            {
                                readingMode ?
                                    <AiFillRead className='text-3xl cursor-pointer home-link' onClick={toggleReadingMode} /> :
                                    <AiOutlineRead className='text-3xl cursor-pointer home-link' onClick={toggleReadingMode} />
                            }
                            <div className="home-link-info hidden justify-center items-start absolute top-10 bg-zinc-900
                                    opacity-80 text-white text-sm px-2 py-1 rounded-md w-28">
                                {readingMode ? 'Default mode' : 'Reading mode'}
                            </div>
                        </div>
                        <div className={`relative ${navigationSection === 'note-section' ? 'flex flex-col items-center' : 'hidden'}`}>
                            <BsTranslate className='text-2xl cursor-pointer home-link' onClick={() => setTranslatePopUp(prev => !prev)} />
                            <div className="home-link-info hidden justify-center items-start absolute top-10 bg-zinc-900
                                    opacity-80 text-white text-sm px-2 py-1 rounded-md w-20">
                                Translate
                            </div>
                            <TranslateComponent translatePopUp={translatePopUp} undoTranslate={undoTranslate}
                                translatePopUpRef={translatePopUpRef} setLanguageFunction={setLanguageFunction}
                                setTranslatedContentFunction={setTranslatedContentFunction} setLoadingGptFunction={setLoadingGptFunction}
                                readingMode={readingMode} pageNoteData={pageNoteData.content}
                                stopStreamingForTranslate={stopStreamingForTranslate} stopSreaming={stopSreaming}
                            />

                        </div>
                        {
                            pageNoteData.userId === users._id ?
                                <div className='relative flex flex-col items-center'>
                                    <GoPencil className='text-2xl cursor-pointer home-link'
                                        onClick={(e) => editNote(e)} />
                                    <div className="home-link-info hidden justify-center items-start absolute top-10 bg-zinc-900 
                                    opacity-80 text-white text-sm px-2 py-1 rounded-md w-16">
                                        Edit
                                    </div>
                                </div> : ''
                        }

                        {/* Language popup */}
                        {
                            language !== 'English' ?
                                <div
                                    className={`${readingMode ? 'border-gray-300' : 'border-gray-700'} border-2 px-2 py-1 rounded-lg 
                                    cursor-pointer hover:scale-[1.02] transition-all duration-150 ease-in-out
                                    ${navigationSection === 'note-section' ? 'block' : 'hidden'}`}
                                    onClick={summarizeContent}
                                >
                                    <IoBanSharp />
                                </div>
                                :
                                <div
                                    className={`${readingMode ? 'border-gray-100' : 'border-gray-800'} border-[1.4px] px-2 rounded-lg 
                                    cursor-pointer hover:scale-[1.02] transition-all duration-150 ease-in-out
                                    ${navigationSection === 'note-section' ? 'block' : 'hidden'} font-bold`}
                                    onClick={!summarizedContent ? summarizeContent : undoContent}
                                >
                                    {summarizedContent ? 'Elaborate' : 'Summarize'}
                                </div>
                        }
                    </div>
                </div>

                {/* Title */}
                <div className='font-bold mb-2 sm:text-xl text-xl'>{pageNoteData.title}</div>

                {/* Content */}
                <div className='note-page-main-content mb-12'>
                    <div className={`note-page-main-nav font-bold mb-8`}>
                        <div
                            className={`note-page-main-items sm:text-[1.05rem] text-[1.1rem] 
                            ${navigationSection === 'note-section' && readingMode ? 'border-b border-gray-100' : ''}
                            ${navigationSection === 'note-section' && !readingMode ? 'border-b border-gray-800' : ''}`}
                            onClick={() => navigateNav('note-section')}
                        >
                            {
                                navigationSection === 'note-section' ?
                                    <FaNoteSticky className='inline text-[1.1rem]' /> :
                                    <FaRegNoteSticky className='inline text-[1.1rem]' />
                            } Note
                        </div>
                        <div
                            className={`note-page-main-items sm:text-[1.05rem] text-[1.1rem]
                            ${navigationSection === 'videos-section' && readingMode ? 'border-b border-gray-100' : ''}
                            ${navigationSection === 'videos-section' && !readingMode ? 'border-b border-gray-800' : ''}`}
                            onClick={() => navigateNav('videos-section')}
                        >
                            {
                                navigationSection === 'note-section' ?
                                    <AiOutlineYoutube className='inline text-2xl' /> :
                                    <AiFillYoutube className='inline text-2xl' />
                            } Videos
                        </div>
                    </div>
                    {/* Note Contents */}
                    <div className={`${navigationSection === 'note-section' ? 'flex' : 'hidden'}`}
                        ref={contentContainerRef}>
                        {
                            translatedContent ?
                                <div className='sm:text-[1rem] text-[1.1rem] markDownContent'
                                    style={{ whiteSpace: 'pre-line' }}>
                                    <MarkdownContent texts={translatedContent} />
                                </div>
                                :
                                <div className='sm:text-[1rem] text-[1.1rem] markDownContent'
                                    style={{ whiteSpace: 'pre-line' }}>
                                    <MarkdownContent texts={summarizedContent ? summarizedContent : pageNoteData.content} />
                                </div>
                        }
                    </div>
                    {/* Video Contents */}
                    <div className={`${navigationSection === 'videos-section' ? 'flex flex-col mt-2' : 'hidden'}`}>
                        {videoSection}
                    </div>
                </div>
                <div className='mt-auto bottom-info-notePage'>
                    {/* For Mobile Devices */}
                    <div className='flex sm:hidden items-center justify-center gap-2'>
                        {
                            pageNoteData.likes > 0 ?
                                <div className='flex items-center gap-1 text-sm'>
                                    <AiFillHeart
                                        className='font-bold 
                                        active:text-black text-[1rem]'
                                    />
                                    {pageNoteData.likes}
                                </div>
                                :
                                <div></div>
                        }
                        {
                            pageNoteData.copies > 0 ?
                                <div className='flex items-center gap-1 text-sm'>
                                    <FaCopy
                                        className=' font-bold 
                                        active:text-black text-[0.9rem]'
                                    />
                                    {pageNoteData.copies}
                                </div>
                                :
                                <div></div>
                        }
                    </div>
                    {/* Shared between Mobile Devices and Desktops */}
                    <div className='flex gap-2 items-center'>
                        <div className='w-10 rounded-full'>
                            <Image
                                src={`/assets/avatars/${users.avatar}.jpeg`} width={50} height={50}
                                className='rounded-full'
                            />
                        </div>
                        <div className='flex flex-col items-start justify-center gap-0 '>
                            <span className='font-bold truncate'>
                                {users ?
                                    users.username :
                                    pageNoteData.username
                                }
                            </span>
                            {
                                timeStamp &&
                                <span className='sm:text-sm text-[1rem]'>
                                    Updated {timeStamp}
                                </span>
                            }
                        </div>
                    </div>
                    {/* For Desktop Devices */}
                    <div className={`hidden sm:flex flex-col items-end gap-0`}>
                        <div className='flex items-center gap-2'>
                            {
                                pageNoteData.likes > 0 ?
                                    <div className='flex items-center gap-1 text-sm'>
                                        <AiFillHeart
                                            className='font-bold 
                                        active:text-black text-[1rem]'
                                        />
                                        {pageNoteData.likes}
                                    </div>
                                    :
                                    <div></div>
                            }
                            {
                                pageNoteData.copies > 0 ?
                                    <div className='flex items-center gap-1 text-sm'>
                                        <FaCopy
                                            className=' font-bold 
                                        active:text-black text-[0.9rem]'
                                        />
                                        {pageNoteData.copies}
                                    </div>
                                    :
                                    <div></div>
                            }
                        </div>
                        {
                            !pageNoteData.isPrivate ?
                                <div className='flex justify-center items-center gap-1'>
                                    <MdOutlinePublic
                                        className='font-bold text-[0.9rem]' />
                                    Public Note
                                    {!pageNoteData.isOriginal ?
                                        ' (copy)'
                                        :
                                        ''
                                    }
                                </div>
                                :
                                <div className='flex justify-center items-center gap-1'>
                                    <IoLockClosedOutline
                                        className='font-bold 
                                        active:text-black text-[0.9rem]'/>
                                    Private Note
                                    {!pageNoteData.isOriginal ?
                                        ' (copy)'
                                        :
                                        ''
                                    }
                                </div>
                        }
                    </div>
                    {/* For Mobile Devices */}
                    {
                        !pageNoteData.isPrivate ?
                            <div className='flex sm:hidden justify-center items-center gap-1'>
                                <MdOutlinePublic
                                    className='font-bold text-[0.9rem]' />
                                Public Note
                                {!pageNoteData.isOriginal ?
                                    ' (copy)'
                                    :
                                    ''
                                }
                            </div>
                            :
                            <div className='flex sm:hidden justify-center items-center gap-1'>
                                <IoLockClosedOutline
                                    className='font-bold 
                                        active:text-black text-[0.9rem]'/>
                                Private Note
                                {!pageNoteData.isOriginal ?
                                    ' (copy)'
                                    :
                                    ''
                                }
                            </div>
                    }
                </div>
            </div >

            {/* Loader */}
            {
                loadingGpt &&
                <div
                    className={`modal-blur fixed top-0 inset-0 backdrop-blur-[1px] flex flex-col justify-center 
                                items-center flex-wrap  ${readingMode ? 'text-[#e2e8f0]' : 'text-[#1F2937]'}`}>
                    <ClipLoader
                        color={`${readingMode ? '#e2e8f0' : '#1F2937'}`}
                        loading='Generating...'
                        //cssOverride={override}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    <div className={`text-5xl mt-8 font-bold p-1 ${readingMode ? 'text-[#e2e8f0]' : 'text-[#1F2937]'}
                        cursor-pointer`}
                        onClick={() => stopSreaming(true)}>
                        <FaRegStopCircle />
                    </div>
                    {/* <div classN ame={`border-gray-200 border px-2 rounded-lg  py-1 mt-2
                                    cursor-pointer hover:scale-[1.02] transition-all duration-150 ease-in-out text-lg`}
                        onClick={() => {}}
                    >
                        Cancel?
                    </div> */}
                </div>
            }
            <Toaster />
        </>
    )
}

export default NotePage