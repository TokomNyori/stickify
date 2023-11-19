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
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { GoPencil } from 'react-icons/go'
import { FaNoteSticky } from 'react-icons/fa6'
import { FaRegNoteSticky } from 'react-icons/fa6'
import { AiOutlineYoutube } from 'react-icons/ai'
import { AiFillYoutube } from 'react-icons/ai'
import { useTheme } from 'next-themes';
import { getSingleNoteHelper, openAiPostHelper, voiceRssApiHelper } from '@/helper/httpHelpers/httpNoteHelper';
import ClipLoader from "react-spinners/GridLoader";
import toast, { Toaster } from 'react-hot-toast';
import { setNoteModalConfig } from '@/redux_features/noteModalConfig/noteModalConfigSlice';
import { addCurrentNotePage } from '@/redux_features/currentNotePage/currentNotePageSlice';
import YouTube from "react-youtube"

const NotePage = ({ params }) => {
    const pageNoteData = useSelector(state => state.currentNotePage.currentNotePage)
    const users = useSelector(state => state.user.users)
    const [readingMode, setReadingMode] = useState(false)
    const [loadingGpt, setLoadingGpt] = useState(false)
    const [navigationSection, setNavigationSection] = useState('note-section')
    const [videoSection, setVideoSection] = useState([])
    const dispatch = useDispatch()
    const { theme, setTheme } = useTheme()
    const themeRedux = useSelector(state => state.theme.theme)
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

    const router = useRouter()
    const [translatedContent, setTranslatedContent] = useState('')
    const [summarizedContent, setSummarizedContent] = useState('')
    const [language, setLanguage] = useState('English')

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

    async function generateContent(event) {
        event.preventDefault()
        if (language !== 'English') {
            toast('Available only in English', {
                icon: '😔'
            })
            return
        }
        //const words = `${generateRequirementGpt.words}`
        const instruction = `Your job is to summarize the given content. Turn yourself into a great summarizer tool. Summarize the content in the best possible way. The content is: ${pageNoteData.content}`
        const gptData = {
            model: 'gpt-3.5-turbo-1106',
            temperature: 0.5,
            max_tokens: 3000,
            messages: [{
                'role': 'user',
                'content': instruction,
            }]
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        }
        try {
            setLoadingGpt(true)
            const res = await openAiPostHelper({ method: 'POST', headers: headers, body: gptData })
            setSummarizedContent(res.choices[0].message.content)
            setLoadingGpt(false)
            toast('Summarized!', {
                icon: '😀'
            })
        } catch (error) {
            setLoadingGpt(false)
            toast(error.message, {
                icon: '😔'
            })
        }
    }

    async function translateContent(translateTo) {
        const instruction = `You are a translating assistant. Your role is to translate the given content to ${translateTo} language. While translating, preserve the original meaning. The content is: ${pageNoteData.content}`
        const gptData = {
            model: 'gpt-3.5-turbo-1106',
            temperature: 0.5,
            max_tokens: 2000,
            messages: [
                {
                    'role': 'system',
                    'content': 'You are a translating assistant.',
                },
                {
                    'role': 'user',
                    'content': instruction,
                },
            ]
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        }
        try {
            setLoadingGpt(true)
            const res = await openAiPostHelper({ method: 'POST', headers: headers, body: gptData })
            setTranslatedContent(res.choices[0].message.content)
            setLoadingGpt(false)
            setTranslatePopUp(false)
            setLanguage(translateTo)
            toast(`Translated to ${translateTo}!`, {
                icon: '😀'
            })
        } catch (error) {
            setLoadingGpt(false)
            setTranslatePopUp(false)
            toast(error.message, {
                icon: '😔'
            })
        }
    }

    function editNote(e) {
        e.stopPropagation()
        //const clickedNote = notes.filter(note => note._id === noteid)[0]
        dispatch(setNoteModalConfig({ noteModalState: true, as: 'edit', noteObject: pageNoteData }))
    }

    // console.log('noteData')
    // console.log(pageNoteData)

    function undoContent() {
        setSummarizedContent('')
        toast('Back to the original', {
            icon: '😀'
        })
    }

    function undoTranslate() {
        setTranslatedContent('')
        setSummarizedContent('')
        setLanguage('English')
        setTranslatePopUp(false)
        toast('Back to English', {
            icon: '📖'
        })
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

    return (
        <>
            <div className={`
                ${readingMode ? ` bg-zinc-800 text-gray-100 brightness-[90%]` :
                    `bg-[${pageNoteData.color}] text-gray-800 dark:brightness-[90%] shadow-md`} 
                    px-4 sm:px-8 py-4 sm:py-8 pb-20 rounded-2xl min-h-screen`}>
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
                            <div
                                className={`${translatePopUp ? 'PopUps' : 'hidden'} ${readingMode ? `bg-zinc-900/90 text-gray-100` :
                                    `dark:bg-zinc-900/90 dark:text-gray-100 bg-[#f6f8f6]`}`}
                                ref={translatePopUpRef}
                            >
                                <div className="col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out"
                                    onClick={undoTranslate}
                                >
                                    English
                                </div>
                                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out"
                                    onClick={() => translateContent('Hindi')}
                                >
                                    हिंदी (Hindi)
                                </div>
                                <div className="col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out"
                                    onClick={() => translateContent('Japanese')}
                                >
                                    日本語 (Japanese)
                                </div>
                                <div className="col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out"
                                    onClick={() => translateContent('French')}
                                >
                                    Français (French)
                                </div>
                                <div className="col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out"
                                    onClick={() => translateContent('Korean')}
                                >
                                    한국인 (Korean)
                                </div>
                                <div className="col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out"
                                    onClick={() => translateContent('German')}
                                >
                                    Deutsch (German)
                                </div>
                                <div className="col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out"
                                    onClick={() => translateContent('Chinese Simplified')}
                                >
                                    中国人 (Chinese)
                                </div>
                                <div className="col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out"
                                    onClick={() => translateContent('Spanish')}
                                >
                                    Español (Spanish)
                                </div>
                            </div>
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
                                    onClick={generateContent}
                                >
                                    <IoBanSharp />
                                </div>
                                :
                                <div
                                    className={`${readingMode ? 'border-gray-100' : 'border-gray-800'} border-[1.4px] px-2 rounded-lg 
                                    cursor-pointer hover:scale-[1.02] transition-all duration-150 ease-in-out
                                    ${navigationSection === 'note-section' ? 'block' : 'hidden'} font-bold`}
                                    onClick={!summarizedContent ? generateContent : undoContent}
                                >
                                    {summarizedContent ? 'Elaborate' : 'Summarize'}
                                </div>
                        }
                    </div>
                </div>

                {/* Title */}
                <div className='font-bold mb-2 sm:text-xl text-xl'>{pageNoteData.title}</div>

                {/* Content */}
                <div className='note-page-main-content'>
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
                    <div className={`${navigationSection === 'note-section' ? 'flex' : 'hidden'}`}>
                        {
                            !translatedContent ?
                                <div className='sm:text-[1rem] text-[1.1rem]' style={{ whiteSpace: 'pre-line' }}>
                                    {summarizedContent ? summarizedContent : pageNoteData.content}
                                </div>
                                :
                                <div className='' style={{ whiteSpace: 'pre-line' }}>{translatedContent}</div>
                        }
                    </div>
                    <div className={`${navigationSection === 'videos-section' ? 'flex flex-col mt-2' : 'hidden'}`}>
                        {videoSection}
                    </div>
                </div>
            </div >

            {/* Loader */}
            {
                loadingGpt &&
                <div
                    className={`modal-blur fixed -top-20 inset-0 bg-black bg-opacity-30 backdrop-blur-[2px] flex flex-col justify-center 
                                items-center flex-wrap`}>
                    <ClipLoader
                        color='#e2e8f0'
                        loading='Generating...'
                        //cssOverride={override}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    <div className="text-2xl mt-5 font-bold text-[#e2e8f0]">
                        Processing...
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