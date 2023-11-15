'use client'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useRef, useState } from "react";
import { deleteNoteHelper, deleteVideoNoteHelper, editNoteHelper, getNoteHelper, openAiPostHelper, postNoteHelper } from "@/helper/httpHelpers/httpNoteHelper";
import { useRouter } from "next/navigation";
import { Configuration, OpenAIApi } from "openai";
import { BsFillPinAngleFill } from 'react-icons/bs'
import { BsPin } from 'react-icons/bs'
import { BsPinFill } from 'react-icons/bs'
import { BiSolidSend } from 'react-icons/bi'
import { RiMagicFill } from 'react-icons/ri'
import scrollToTop from "@/helper/scrollToTop";
import GptSubmit from './GptSubmit';
import ClipLoader from "react-spinners/PacmanLoader";
import ClipLoader2 from "react-spinners/GridLoader";
import { useDispatch, useSelector } from 'react-redux';
import { addNote } from '@/redux_features/notes/noteSlice';
import { BiArrowBack } from 'react-icons/bi'
import { BsCheckCircle } from 'react-icons/bs'
import { HiOutlineLockClosed } from 'react-icons/hi'
import { BiSolidVideoPlus } from 'react-icons/bi'
import PopUp2 from '../popups/PopUp2';
import { setNoteModalConfig } from '@/redux_features/noteModalConfig/noteModalConfigSlice';
import { addCurrentNotePage } from '@/redux_features/currentNotePage/currentNotePageSlice';
import { AiFillYoutube } from 'react-icons/ai'
import YouTube from 'react-youtube';
import YoutubeModal from './YtVideoAddModal';
import YtVideoListPopup from '../popups/YtVideoListPopup';
import YtVideoAddModal from './YtVideoAddModal';

const NoteModal = () => {
    //const userId = userCookie?._id
    const users = useSelector(state => state.user.users)
    const noteModalConfig = useSelector(state => state.noteModalConfig.noteModalConfig)
    const [isEdit, setIsEdit] = useState(false)
    const [note, setNote] = useState({
        title: '',
        status: 'others',
        color: '#FFFAD1',
        content: '',
        isPrivate: false,
        userId: users._id,
        ytVideo: []
    })

    const [pin, setPin] = useState(false)

    const [loading, setLoading] = useState(false)
    //const notes = useSelector(state => state.note.notes)
    const dispatch = useDispatch()
    const [rephrasedNote, setRephrasedNote] = useState(note)
    const [rephrasePopUp, setRephrasePopUp] = useState(false)
    const [isTitle, setIsTitle] = useState(true)
    const [isContent, setIsContent] = useState(true)
    const [isRephrasedTitle, setIsRephrasedTitle] = useState(true)
    const [isRephrasedContent, setIsRephrasedContent] = useState(true)
    const [isRephrasedNote, setIsRephrasedNote] = useState(false)
    const [loadingRephraser, setLoadingRephraser] = useState(false)
    const [textareaRows, setTextareaRows] = useState();
    const [gptSubmitModalState, setGptSubmitModalState] = useState(false)
    const [ytVideoListPopupState, setYtVideoListPopupState] = useState(false)
    const [ytVideAddModalState, setYtVideAddModalState] = useState(false)
    const noteModalRef = useRef(null);
    const ytListPopupVideosRefs0 = useRef(null)
    const ytListPopupVideosRefs1 = useRef(null)
    const ytListPopupVideosRefs2 = useRef(null)
    const ytListPopupVideosRefs3 = useRef(null)
    const ytListPopupVideosRefs4 = useRef(null)
    const isTitleEmpty = isRephrasedNote ? isRephrasedTitle : isTitle
    const isContentEmpty = isRephrasedNote ? isRephrasedContent : isContent
    const pageName = useSelector(state => state.page.page)
    const router = useRouter()
    const ytRefs = [ytListPopupVideosRefs0, ytListPopupVideosRefs1, ytListPopupVideosRefs2, ytListPopupVideosRefs3, ytListPopupVideosRefs4]

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (noteModalRef.current && !noteModalRef.current.contains(event.target)) {
                closeModal(event)
            }
        };

        if (noteModalConfig.noteModalState) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [noteModalConfig]);

    useEffect(() => {
        setIsEdit(noteModalConfig.as === 'edit' ? true : false)
    }, [noteModalConfig])

    useEffect(() => {
        if (isEdit) {
            setNote({
                title: noteModalConfig.noteObject.title,
                status: noteModalConfig.noteObject.status,
                color: noteModalConfig.noteObject.color,
                content: noteModalConfig.noteObject.content,
                isPrivate: noteModalConfig.noteObject.isPrivate,
                userId: users._id,
                ytVideo: noteModalConfig.noteObject.ytVideo,
            })
            if (noteModalConfig.noteObject.status === 'pinned') {
                setPin(true)
            } else {
                setPin(false)
            }
        }
    }, [isEdit])

    useEffect(() => {
        if (pin) {
            isRephrasedNote ?
                setRephrasedNote(prev => ({
                    ...prev,
                    status: 'pinned'
                })) :
                setNote(prev => ({
                    ...prev,
                    status: 'pinned'
                }))
        } else {
            isRephrasedNote ?
                setRephrasedNote(prev => ({
                    ...prev,
                    status: 'others'
                })) :
                setNote(prev => ({
                    ...prev,
                    status: 'others'
                }))
        }
        if (pin) {
            toast('Pin note', {
                icon: '📌',
                duration: 1000,
            })
        }
    }, [pin])

    useEffect(() => {
        if (note.title) {
            setIsTitle(true)
        }
        if (note.content) {
            setIsContent(true)
        }
        setRephrasedNote(({ ...note, content: '' }))
    }, [note])

    useEffect(() => {
        if (rephrasedNote.title) {
            setIsRephrasedTitle(true)
        }
        if (rephrasedNote.content) {
            setIsRephrasedContent(true)
        }
        // setRephrasedNote(({ ...note, content: '' }))
    }, [rephrasedNote])

    useEffect(() => {
        const height = window.innerHeight;

        if (height > 700 && height < 800) {
            setTextareaRows(18)
        } else if (height > 799 && height < 900) {
            setTextareaRows(22)
        } else if (height > 899 && height < 1000) {
            setTextareaRows(24)
        } else if (height < 600) {
            setTextareaRows(14)
        } else {
            setTextareaRows(16)
        }
    }, [])

    useEffect(() => {
        function handleResize() {
            const height = window.innerHeight;
            if (height > 700 && height < 800) {
                setTextareaRows(18)
            } else if (height > 799 && height < 900) {
                setTextareaRows(22)
            } else if (height > 899 && height < 1000) {
                setTextareaRows(24)
            } else if (height < 600) {
                setTextareaRows(14)
            } else {
                setTextareaRows(16)
            }
        }
        // Add the event listener
        window.addEventListener('resize', handleResize);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isRephrasedNote) {
            if (rephrasedNote.isPrivate) {
                toast('Private note', {
                    icon: '🔒',
                    duration: 1000,
                })
            }
        } else {
            if (note.isPrivate) {
                toast('Private note', {
                    icon: '🔒',
                    duration: 1000,
                })
            }
        }
    }, [note.isPrivate, rephrasedNote.isPrivate])

    useEffect(() => {
        // Create the handlePopState function inside useEffect
        const handlePopState = (event) => {
            if (noteModalConfig.noteModalState === true) {
                router.forward()
                clearForm()
                if (isEdit) {
                    setIsEdit(false)
                }
                dispatch(setNoteModalConfig({ noteModalState: false, as: '', noteObject: {} }))
            } else {
                clearForm()
                if (isEdit) {
                    setIsEdit(false)
                }
                dispatch(setNoteModalConfig({ noteModalState: false, as: '', noteObject: {} }))
            }

        };

        // Add the popstate event listener
        window.addEventListener('popstate', handlePopState);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [noteModalConfig]);

    function closeModal(event) {
        event.preventDefault()
        clearForm()
        if (isEdit) {
            setIsEdit(false)
        }
        dispatch(setNoteModalConfig({ noteModalState: false, as: '', noteObject: {} }))
    }

    function changeNote(event) {
        const { name, value, type, checked } = event.target
        if (!isRephrasedNote) {
            setNote(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }))
        } else {
            setRephrasedNote(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }))
        }
    }

    //Important!!!!!!!!!!!!!
    function changeNoteContentByGpt(generatedData) {
        if (isRephrasedNote) {
            setRephrasedNote(prev => ({
                ...prev,
                content: generatedData.gptGeneratedContent,
                ytVideo: generatedData.ytVideoData,
            }))
        } else {
            setNote(prev => ({
                ...prev,
                content: generatedData.gptGeneratedContent,
                ytVideo: generatedData.ytVideoData,
            }))
        }
    }

    function pinIt() {
        setPin(prev => !prev)
    }

    async function submitForm(event) {
        event.preventDefault();
        if (isEdit) {
            try {
                setLoading(true)
                const res = await editNoteHelper(
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        noteid: noteModalConfig.noteObject._id,
                        body: isRephrasedNote ? rephrasedNote : note
                    }
                )
                const notesRes = await getNoteHelper({
                    method: 'GET',
                    userId: users._id,
                    headers: { 'Content-Type': 'application/json' }
                })
                console.log('notesRes.body')
                console.log(notesRes.body)
                dispatch(addNote(notesRes.body))
                dispatch(addCurrentNotePage(res.body))
                setLoading(false)
                toast("Boom! Note's Customized !", {
                    icon: '🔥📔'
                });
                closeModal(event)
            } catch (error) {
                console.log(error)
                setLoading(false)
                toast(`Could not edit!`, {
                    icon: '🥺'
                });
            }
            return
        }
        try {
            setLoading(true)
            isRephrasedNote ?
                await postNoteHelper({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: rephrasedNote })
                :
                await postNoteHelper({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: note })
            const notesRes = await getNoteHelper({
                method: 'GET',
                userId: users._id,
                headers: { 'Content-Type': 'application/json' }
            })
            dispatch(addNote(notesRes.body))
            setLoading(false)
            toast("Boom! Note's Ready!", {
                icon: '🔥📔'
            });
            closeModal(event)
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast(`Could not save it!`, {
                icon: '🥺'
            });
        }
    }

    function clearForm() {
        setRephrasedNote({
            title: '',
            status: 'others',
            color: '#FFFAD1',
            content: '',
            isPrivate: false,
            userId: users._id,
            ytVideo: []
        })
        setNote({
            title: '',
            status: 'others',
            color: '#FFFAD1',
            content: '',
            isPrivate: false,
            userId: users._id,
            ytVideo: []
        })
        setPin(false)
        setIsRephrasedNote(false)
        setIsTitle(true)
        setIsContent(true)
        setIsRephrasedTitle(true)
        setIsRephrasedContent(true)
    }

    function changeGptRequirementModal() {
        if (!note.title && !isRephrasedNote) {
            setIsTitle(false)
            toast('Please enter a title.', {
                icon: '😶'
            })
            return
        }
        if (!rephrasedNote.title && isRephrasedNote) {
            setIsRephrasedTitle(false)
            toast('Please enter a title.', {
                icon: '😶'
            })
            return
        }
        setGptSubmitModalState(prev => !prev)
    }

    function toggleRephrasePopUp() {
        if (!note.content && !isRephrasedNote) {
            setIsContent(false)
            toast('Please enter content.', {
                icon: '😶'
            })
            return
        }

        if (!rephrasedNote.content && isRephrasedNote) {
            setIsRephrasedContent(false)
            toast('Please enter content.', {
                icon: '😶'
            })
            return
        }
        setRephrasePopUp(prev => !prev)
    }

    function changeIsRepCnt(val) {
        setIsRephrasedNote(val)
    }

    function changeRephrasedNote(type, putContent) {
        if (type === 'rephrase') {
            setRephrasedNote(prev => ({
                ...prev,
                content: putContent
            }))
        } else {
            setRephrasedNote(prev => ({
                ...note,
                content: ''
            }))
            if (note.status === 'pinned') {
                setPin(true)
            } else {
                setPin(false)
            }
        }
    }

    function closeRephrasePopUp() {
        setRephrasePopUp(false)
    }

    function setLoadingRephraserFun(val) {
        setLoadingRephraser(val)
    }

    // Continue !!!!!!!!!!!!!!!⚠️
    async function deleteYourYtVideo(id) {
        if (isRephrasedNote) {
            const deleteYtVid = rephrasedNote.ytVideo.filter(vid => {
                return vid.ytVideoId !== id
            })
            const backUp = { ...noteModalConfig }
            setRephrasedNote(prev => ({
                ...prev,
                ytVideo: deleteYtVid
            }))
            dispatch(setNoteModalConfig(backUp))
            toast('Deleted', {
                icon: '🗑️'
            })
            if (isEdit) {
                const jsonBody = {
                    ytVideo: deleteYtVid,
                }
                try {
                    const res = await deleteVideoNoteHelper(
                        {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            noteid: noteModalConfig.noteObject._id,
                            body: jsonBody
                        }
                    )
                    console.log(res)
                } catch (error) {
                    console.log(error)
                }
            }
        } else {
            const deleteYtVid = note.ytVideo.filter(vid => {
                return vid.ytVideoId !== id
            })
            const backUp = { ...noteModalConfig }
            // console.log('deleteYtVid')
            // console.log(deleteYtVid)
            setNote(prev => ({
                ...prev,
                ytVideo: deleteYtVid
            }))
            dispatch(setNoteModalConfig(backUp))
            //changeYtPopup()
            toast('Deleted', {
                icon: '🗑️'
            })
            if (isEdit) {
                const jsonBody = {
                    ytVideo: deleteYtVid,
                }
                try {
                    const res = await deleteVideoNoteHelper(
                        {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            noteid: noteModalConfig.noteObject._id,
                            body: jsonBody
                        }
                    )
                    console.log(res)
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    function changeYtAddModal() {
        setYtVideAddModalState(prev => !prev)
        if (isRephrasedNote && rephrasedNote.ytVideo.length > 0) {
            for (let i = 0; i < rephrasedNote.ytVideo.length; i++) {
                if (ytRefs[i].current) {
                    ytRefs[i].current.getInternalPlayer().pauseVideo();
                }
            }
        } else if (note.ytVideo.length > 0) {
            for (let i = 0; i < note.ytVideo.length; i++) {
                if (ytRefs[i].current) {
                    ytRefs[i].current.getInternalPlayer().pauseVideo();
                }
            }
        }
    }

    function AddToYtVideosFromYtModal({ operation, id, title }) {
        if (isRephrasedNote) {

        } else {
            setNote(prevNotes => {
                const addObject = {
                    ytVideoId: id,
                    ytVideoTitle: title,
                }
                const addToYtVideo = [...prevNotes.ytVideo, { ...addObject }]
                if (operation === 'add') {
                    return {
                        ...prevNotes,
                        ytVideo: addToYtVideo
                    }
                } else {
                    const removeTarget = prevNotes.ytVideo.filter(video => video.ytVideoId !== id)
                    return {
                        ...prevNotes,
                        ytVideo: removeTarget
                    }
                }
            })
        }

    }

    console.log(note.ytVideo)

    // console.log('NoteConfig')
    // console.log(noteModalConfig)

    // console.log('Note Object')
    // console.log(note)

    // console.log('Rephrased Object')
    // console.log(rephrasedNote)

    return (
        <div
            className={`modal-blur top-0 inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center
                        ${noteModalConfig.noteModalState ? "fix-modal" : "hidden"} flex-wrap dark:brightness-[85%]`}>
            <div
                className={`modal-main rounded-3xl shadow-lg 
                ${isRephrasedNote ? `bg-[${rephrasedNote.color}]` : `bg-[${note.color}]`} text-gray-700`}
                ref={noteModalRef} >
                <form className="mt-2 min-h-full flex flex-col" onSubmit={submitForm} id='createNoteForm'>
                    <div className='top-section'>
                        <div className="modal-heading">
                            <div className="text-center" onClick={closeModal}>
                                <BiArrowBack className='sm:text-3xl text-4xl cursor-pointer ' />
                            </div>
                            <div className='flex gap-3 items-center justify-center'>
                                {
                                    note.ytVideo.length !== 0 || rephrasedNote.ytVideo.length !== 0 ?
                                        <div className='youtubeModalIcon' onClick={changeYtAddModal}>
                                            <AiFillYoutube className='text-4xl text-red-500' />
                                        </div>
                                        :
                                        <div className='cursor-pointer' onClick={changeYtAddModal}>
                                            <AiFillYoutube className='text-4xl text-gray-500' />
                                        </div>
                                }
                                <div className=''>
                                    <input id="isPrivate" type="checkbox" name="isPrivate"
                                        checked={isRephrasedNote ? rephrasedNote.isPrivate : note.isPrivate}
                                        onChange={changeNote}
                                        className="hidden" />
                                    <label for="isPrivate">
                                        <HiOutlineLockClosed className={`text-3xl cursor-pointer
                                    ${rephrasedNote.isPrivate || note.isPrivate ?
                                                'text-gray-700' :
                                                'text-gray-500'}
                                    `} />
                                    </label>
                                </div>
                                <div className='close-btn cursor-pointer mt-1' onClick={pinIt}>
                                    <BsPinFill className={`text-[1.7rem] ${pin ? 'text-gray-700' : 'text-gray-500'}`} />
                                </div>
                                <button
                                    className="bg-transparent"
                                    type="submit"
                                >
                                    <BsCheckCircle className='sm:text-3xl text-4xl cursor-pointer' />
                                </button>
                            </div>
                        </div>
                        <div className={`sm:text-sm mt-2 text-red-400 ${isTitleEmpty ? 'hidden' : 'block'}`}>
                            Title cannot be empty. Please enter a title.
                        </div>
                        <div className="flex justify-between items-center gap-4 mt-4">
                            <div className="mb-4 flex-grow">
                                {/* <label htmlFor="note_title" className="block mb-2 text-sm font-medium">Title</label> */}
                                <input type="text" id="note_title" className="bg-gray-700 border-b border-gray-800/75 block w-full 
                                py-2 font-bold placeholder-gray-500 text-gray-700 focus:outline-none bg-transparent
                                sm:text-[1.05rem] text-[1.08rem]"
                                    placeholder="Title..." value={isRephrasedNote ? rephrasedNote.title : note.title}
                                    name="title" onChange={changeNote} required />
                            </div>
                            <div className=' text-sm border border-gray-700 hover:border-gray-950 rounded-lg py-1 px-2 
                                cursor-pointer mt-0'
                                onClick={changeGptRequirementModal}>
                                Generate <span><BiSolidSend className='inline' /></span>
                            </div>
                        </div>
                    </div>
                    <div className='text-area-section mb-2'>
                        <div className="mb-2 notemodal-text-area relative">
                            <textarea type="text" id="note_content" className="rounded-lg bg-transparent border-gray-600 block 
                                py-2 w-full placeholder-gray-500 text-gray-700 focus:outline-none
                                min-h-full note-textarea sm:text-[1rem] text-[1.05rem]" rows={textareaRows}
                                placeholder="Type your content here..."
                                value={isRephrasedNote ? rephrasedNote.content : note.content} name="content"
                                onChange={changeNote} required
                            />
                            <div className={`absolute text-sm sm:text-xs text-gray-100 border border-gray-100
                            px-2 py-1 rounded-xl cursor-pointer ai-rephrase-btn dark:bg-gray-800/70 bg-gray-800/70
                            flex gap-1 justify-center items-center ${rephrasePopUp && 'rounded-tr-none'}`}
                                onClick={toggleRephrasePopUp} >
                                <span className='text-sm'>
                                    <RiMagicFill className='inline text-lg' /> Grammar
                                </span>
                                <PopUp2
                                    closeRephrasePopUp={closeRephrasePopUp}
                                    rephrasePopUp={rephrasePopUp} content={note.content}
                                    changeRephrasedNote={changeRephrasedNote}
                                    rephrasedNote={rephrasedNote}
                                    changeIsRepCnt={changeIsRepCnt}
                                    isRephrasedNote={isRephrasedNote}
                                    setLoadingRephraserFun={setLoadingRephraserFun}
                                />
                            </div>
                        </div>
                        {/* <div className={`sm:text-sm text-red-400 mb-2 ${isContentEmpty ? 'hidden' : 'block'}`}>
                            Please enter content.
                        </div> */}
                    </div>
                    <div className="radio-inputs flex-1 mb-4 flex gap-3">
                        <div>
                            {/* checked={note.color === '#FFFAD1'} */}
                            <input type="radio" id="color1" name="color" className="hidden note-radio-btn" value="#FFFAD1"
                                onChange={changeNote}
                                checked={isRephrasedNote ? rephrasedNote.color === '#FFFAD1' : note.color === '#FFFAD1'} />
                            <label htmlFor="color1"
                                className="block color-input-label rounded-full bg-[#FFFAD1] border border-gray-500
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            {/* checked={note.color === '#f4bee1'}  */}
                            <input type="radio" id="color2" name="color" className="hidden note-radio-btn" value="#f4bee1"
                                onChange={changeNote}
                                checked={isRephrasedNote ? rephrasedNote.color === '#f4bee1' : note.color === '#f4bee1'} />
                            <label htmlFor="color2"
                                className="block color-input-label rounded-full bg-[#f4bee1] border border-gray-500
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            {/* checked={note.color === '#F1DED0'} */}
                            <input type="radio" id="color3" name="color" className="hidden note-radio-btn" value="#F1DED0"
                                onChange={changeNote}
                                checked={isRephrasedNote ? rephrasedNote.color === '#F1DED0' : note.color === '#F1DED0'} />
                            <label htmlFor="color3"
                                className="block color-input-label rounded-full bg-[#F1DED0] border border-gray-500
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            {/* checked={note.color === '#B4C9F9'}  */}
                            <input type="radio" id="color4" name="color" className="hidden note-radio-btn" value="#B4C9F9"
                                onChange={changeNote}
                                checked={isRephrasedNote ? rephrasedNote.color === '#B4C9F9' : note.color === '#B4C9F9'} />
                            <label htmlFor="color4"
                                className="block color-input-label rounded-full bg-[#B4C9F9] border border-gray-500
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            {/* checked={note.color === '#A9D1B5'} */}
                            <input type="radio" id="color5" name="color" className="hidden note-radio-btn" value="#A9D1B5"
                                onChange={changeNote}
                                checked={isRephrasedNote ? rephrasedNote.color === '#A9D1B5' : note.color === '#A9D1B5'} />
                            <label htmlFor="color5"
                                className="block color-input-label rounded-full bg-[#A9D1B5] border border-gray-500
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            {/* checked={note.color === '#f8f9fa'} */}
                            <input type="radio" id="color6" name="color" className="hidden note-radio-btn" value="#f8f9fa"
                                onChange={changeNote}
                                checked={isRephrasedNote ? rephrasedNote.color === '#f8f9fa' : note.color === '#f8f9fa'} />
                            <label htmlFor="color6"
                                className="block color-input-label rounded-full bg-[#f8f9fa] border border-gray-500
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            {/* checked={note.color === '#c8b6ff'} */}
                            <input type="radio" id="color7" name="color" className="hidden note-radio-btn" value="#c8b6ff"
                                onChange={changeNote}
                                checked={isRephrasedNote ? rephrasedNote.color === '#c8b6ff' : note.color === '#c8b6ff'} />
                            <label htmlFor="color7"
                                className="block color-input-label rounded-full bg-[#c8b6ff] border border-gray-500
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                    </div>
                </form>
                <GptSubmit
                    gptSubmitModalState={gptSubmitModalState}
                    changeGptRequirementModal={changeGptRequirementModal} changeNoteContentByGpt={changeNoteContentByGpt}
                    isRephrasedNote={isRephrasedNote} rephrasedNote={rephrasedNote}
                    noteFromNoteModal={isRephrasedNote ? rephrasedNote : note} />
                <YtVideoAddModal
                    ytVideAddModalState={ytVideAddModalState}
                    changeYtAddModal={changeYtAddModal}
                    ytVideoFromNote={isRephrasedNote ? rephrasedNote.ytVideo : note.ytVideo}
                    AddToYtVideosFromYtModal={AddToYtVideosFromYtModal}
                    deleteYourYtVideo={deleteYourYtVideo}
                    ytRefs={ytRefs}
                />
            </div>
            {loading &&
                <div
                    className={`loader-gpt absolute inset-0 bg-black bg-opacity-40 backdrop-blur-[2px] flex flex-col justify-center 
                                items-center flex-wrap`}>
                    <ClipLoader
                        color='#f1f5f9'
                        loading='Generating...'
                        //cssOverride={override}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    <div className="text-2xl mt-5 font-bold text-[#f1f5f9]">
                        {isEdit ? 'Customizing...' : 'Creating note...'}
                    </div>
                </div>

            }
            {loadingRephraser &&
                <div
                    className={`modal-blur absolute inset-0 bg-black bg-opacity-40 backdrop-blur-[2px] flex flex-col justify-center 
                                items-center flex-wrap`}>
                    <ClipLoader2
                        color='#e2e8f0'
                        loading='Generating...'
                        //cssOverride={override}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    <div className="text-2xl mt-5 font-bold text-[#e2e8f0]">
                        Rephrasing...
                    </div>
                    {/* <div classN ame={`border-gray-200 border px-2 rounded-lg  py-1 mt-2
                                    cursor-pointer hover:scale-[1.02] transition-all duration-150 ease-in-out text-lg`}
                        onClick={() => {}}
                    >
                        Cancel?
                    </div> */}
                </div>
            }
        </div>
    )
}

export default NoteModal