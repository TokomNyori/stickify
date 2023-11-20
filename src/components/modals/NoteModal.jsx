'use client'
import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from "react";
import { editNoteHelper, getNoteHelper, postNoteHelper, ytVideoNoteHelper } from "@/helper/httpHelpers/httpNoteHelper";
import { useRouter } from "next/navigation";
import { Configuration, OpenAIApi } from "openai";
import { BsFillPinAngleFill } from 'react-icons/bs'
import { BsPin } from 'react-icons/bs'
import { BsPinFill } from 'react-icons/bs'
import { BiSolidSend } from 'react-icons/bi'
import { RiMagicFill } from 'react-icons/ri'
import GptSubmit from './GptSubmit';
import { useDispatch, useSelector } from 'react-redux';
import { addNote } from '@/redux_features/notes/noteSlice';
import { BiArrowBack } from 'react-icons/bi'
import { HiOutlineLockClosed } from 'react-icons/hi'
import PopUp2 from '../popups/PopUp2';
import { setNoteModalConfig } from '@/redux_features/noteModalConfig/noteModalConfigSlice';
import { addCurrentNotePage } from '@/redux_features/currentNotePage/currentNotePageSlice';
import { AiFillYoutube } from 'react-icons/ai'
import { AiOutlineYoutube } from "react-icons/ai";
import { IoLockOpenOutline } from "react-icons/io5";
import { IoLockClosed } from "react-icons/io5";
import YtVideoAddModal from './YtVideoAddModal';
import { LuMove } from "react-icons/lu";
import ClipLoader from "react-spinners/PacmanLoader";
import ClipLoader2 from "react-spinners/GridLoader";
import ClipLoader3 from "react-spinners/HashLoader";
import { motion, useDragControls } from "framer-motion"


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
    const [ytVideAddModalState, setYtVideAddModalState] = useState(false)
    const [ytVideoDeleteLoading, setYtVideoDeleteLoading] = useState(false)
    const [isDefault, setIsDefault] = useState(true)
    const noteModalRef = useRef(null);
    const ytListPopupVideosRefs0 = useRef(null)
    const ytListPopupVideosRefs1 = useRef(null)
    const ytListPopupVideosRefs2 = useRef(null)
    const ytListPopupVideosRefs3 = useRef(null)
    const ytListPopupVideosRefs4 = useRef(null)
    const ytListPopupVideosRefs5 = useRef(null)
    const ytListPopupVideosRefs6 = useRef(null)
    const parentRef = useRef()
    const isTitleEmpty = isRephrasedNote ? isRephrasedTitle : isTitle
    const isContentEmpty = isRephrasedNote ? isRephrasedContent : isContent
    const pageName = useSelector(state => state.page.page)
    const router = useRouter()
    const ytRefs = [ytListPopupVideosRefs0, ytListPopupVideosRefs1, ytListPopupVideosRefs2, ytListPopupVideosRefs3,
        ytListPopupVideosRefs4, ytListPopupVideosRefs5, ytListPopupVideosRefs6]
    const controls = useDragControls()

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
        rephraseDefaultTrue()
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

        // Checking for private/public note
        if (name === 'isPrivate') {
            if (!isRephrasedNote) {
                if (note.isPrivate) {
                    toast('Public note', {
                        icon: '📰',
                        duration: 800,
                    })
                } else {
                    toast('Private note', {
                        icon: '🔒',
                        duration: 800,
                    })
                }
            } else {
                if (rephrasedNote.isPrivate) {
                    toast('Public note', {
                        icon: '📰',
                        duration: 800,
                    })
                } else {
                    toast('Private note', {
                        icon: '🔒',
                        duration: 800,
                    })
                }
            }
        }
    }

    //Important!!!!!!!!!!!!!
    function changeNoteContentByGpt(generatedData, addedVideo) {
        const targetNote = isRephrasedNote ? rephrasedNote : note
        // console.log('generatedData')
        // console.log(generatedData)
        if (addedVideo && targetNote.ytVideo.length <= 4) {
            const recievedVideos = generatedData.ytVideoData
            const addVideos = [...recievedVideos, ...targetNote.ytVideo]

            if (isRephrasedNote) {
                setRephrasedNote(prev => ({
                    ...prev,
                    content: generatedData.gptGeneratedContent,
                    ytVideo: addVideos,
                }))
            } else {
                setNote(prev => ({
                    ...prev,
                    content: generatedData.gptGeneratedContent,
                    ytVideo: addVideos,
                }))
            }
        } else {
            if (isRephrasedNote) {
                setRephrasedNote(prev => ({
                    ...prev,
                    content: generatedData.gptGeneratedContent,
                }))
            } else {
                setNote(prev => ({
                    ...prev,
                    content: generatedData.gptGeneratedContent,
                }))
            }
        }
    }

    function pinIt() {
        setTimeout(() => {
            setPin(prev => !prev)
        }, 100);
        if (pin) {
            toast('Unpinned', {
                icon: '🤏🏼',
                duration: 800,
            })
        } else {
            toast('Pinned', {
                icon: '📌',
                duration: 800,
            })
        }
    }

    function rephraseDefaultTrue() {
        setIsDefault(true)
    }

    function rephraseDefaultFalse() {
        setIsDefault(false)
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
                rephraseDefaultTrue()
                toast("Boom! Note's Customized!", {
                    icon: '🔥📝'
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
            rephraseDefaultTrue()
            toast("Boom! Note's Ready!", {
                icon: '🔥📝'
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
        setYtVideoDeleteLoading(true)
        const backUp = isRephrasedNote ? { ...rephrasedNote } : { ...note }
        const removeTarget = isRephrasedNote ?
            rephrasedNote.ytVideo.filter(video => video.uniqueId !== id)
            :
            note.ytVideo.filter(video => video.uniqueId !== id)

        if (isRephrasedNote) {
            setTimeout(() => {
                setRephrasedNote(prevNotes => ({
                    ...prevNotes,
                    ytVideo: removeTarget
                }))
            }, 100);
        } else {
            setTimeout(() => {
                setNote(prevNotes => ({
                    ...prevNotes,
                    ytVideo: removeTarget
                }))
            }, 100);
        }
        setYtVideoDeleteLoading(false)
        toast('Deleted', {
            icon: '🗑️'
        })

        // Making server request to delete from MongoDB database
        if (isEdit) {
            const jsonBody = {
                ytVideo: removeTarget,
            }
            try {
                const res = await ytVideoNoteHelper(
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        noteid: noteModalConfig.noteObject._id,
                        body: jsonBody
                    }
                )
                const notesRes = await getNoteHelper({
                    method: 'GET',
                    userId: users._id,
                    headers: { 'Content-Type': 'application/json' }
                })
                // console.log('notesRes.body')
                // console.log(notesRes.body)
                dispatch(addNote(notesRes.body))
                dispatch(addCurrentNotePage(res.body))
                return res
            } catch (error) {
                console.log(error)
                isRephrasedNote ?
                    setRephrasedNote(backUp) :
                    setNote(backUp)
                return error
            }
        }
        return {
            message: 'Deleted from Local state',
            status: 200,
        }
    }


    async function AddToYtVideosFromYtModal({ operation, id, title, uniqueId }) {
        const backUp = isRephrasedNote ? { ...rephrasedNote } : { ...note }
        const targetNote = isRephrasedNote ? rephrasedNote : note
        const addObject = {
            ytVideoId: id,
            uniqueId: uniqueId,
            ytVideoTitle: title,
        }
        const addToYtVideo = [addObject, ...targetNote.ytVideo]
        const removeTarget = targetNote.ytVideo.filter(video => video.ytVideoId !== id)

        if (isRephrasedNote) {
            setRephrasedNote(prevNotes => {
                //const addToYtVideo = [{ ...addObject }, ...prevNotes.ytVideo]
                if (operation === 'add') {
                    return {
                        ...prevNotes,
                        ytVideo: addToYtVideo
                    }
                } else {
                    //const removeTarget = prevNotes.ytVideo.filter(video => video.ytVideoId !== id)
                    return {
                        ...prevNotes,
                        ytVideo: removeTarget
                    }
                }
            })
        } else {
            setNote(prevNotes => {
                //const addToYtVideo = [{ ...addObject }, ...prevNotes.ytVideo]
                if (operation === 'add') {
                    return {
                        ...prevNotes,
                        ytVideo: addToYtVideo
                    }
                } else {
                    //const removeTarget = prevNotes.ytVideo.filter(video => video.ytVideoId !== id)
                    return {
                        ...prevNotes,
                        ytVideo: removeTarget
                    }
                }
            })
        }

        // Making server request to delete from MongoDB database
        if (isEdit) {
            const deleteBody = {
                ytVideo: removeTarget,
            }

            const addBody = {
                ytVideo: addToYtVideo,
            }

            try {
                const res = await ytVideoNoteHelper(
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        noteid: noteModalConfig.noteObject._id,
                        body: operation === 'add' ? addBody : deleteBody
                    }
                )
                const notesRes = await getNoteHelper({
                    method: 'GET',
                    userId: users._id,
                    headers: { 'Content-Type': 'application/json' }
                })
                console.log(res)
                // console.log(notesRes.body)
                dispatch(addNote(notesRes.body))
                dispatch(addCurrentNotePage(res.body))
            } catch (error) {
                console.log(error)
                isRephrasedNote ?
                    setRephrasedNote(backUp) :
                    setNote(backUp)
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

    // console.log(note.ytVideo)

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
                ${isRephrasedNote ? `bg-[${rephrasedNote.color}]` : `bg-[${note.color}]`} text-gray-800`}
                ref={noteModalRef} >
                <form className="mt-2 min-h-full flex flex-col" onSubmit={submitForm}
                    id='createNoteForm'>
                    <div className='top-section'>
                        <div className="modal-heading">
                            <div className="text-center" onClick={(event) => closeModal(event, 'back')}>
                                <BiArrowBack className='sm:text-3xl text-4xl cursor-pointer ' />
                            </div>
                            <div className='flex gap-4 sm:gap-3 items-center justify-center'>
                                {
                                    note.ytVideo.length !== 0 || rephrasedNote.ytVideo.length !== 0 ?
                                        <div className={`${isEdit ? 'youtubeModalIcon' : 'youtubeModalIconGPT'}`}
                                            onClick={changeYtAddModal}>
                                            <AiFillYoutube className='text-4xl text-red-500 inline' />
                                            <sup className='text-gray-800 font-bold'>
                                                {isRephrasedNote ? rephrasedNote.ytVideo.length : note.ytVideo.length}
                                            </sup>
                                        </div>
                                        :
                                        <div className='cursor-pointer' onClick={changeYtAddModal}>
                                            <AiOutlineYoutube className='text-4xl font-light text-gray-700' />
                                        </div>
                                }
                                <div className=''>
                                    <input id="isPrivate" type="checkbox" name="isPrivate"
                                        checked={isRephrasedNote ? rephrasedNote.isPrivate : note.isPrivate}
                                        onChange={changeNote}
                                        className="hidden" />
                                    <label for="isPrivate">
                                        {
                                            rephrasedNote.isPrivate || note.isPrivate ?
                                                <IoLockClosed className={`text-[1.7rem] cursor-pointer text-gray-800`} /> :
                                                <IoLockOpenOutline className={`text-[1.7rem] cursor-pointer text-gray-800`} />
                                        }
                                    </label>
                                </div>
                                {
                                    pin ?
                                        <div className='close-btn cursor-pointer mt-1' onClick={pinIt}>
                                            <BsPinFill className={`text-[1.7rem] text-gray-800`} />
                                        </div>
                                        :
                                        <div className='close-btn cursor-pointer mt-1' onClick={pinIt}>
                                            <BsPin className={`text-[1.7rem] text-gray-800`} />
                                        </div>
                                }
                                <button
                                    className="bg-transparent cursor-pointer text-xl tracking-wide border-[1.3px] border-gray-800
                                    rounded-xl px-2 py-0.5"
                                    type="submit"
                                >
                                    {/* <BsCheckCircle className='sm:text-3xl text-4xl cursor-pointer' /> */}
                                    {isEdit ? 'Save' : 'Done'}
                                </button>
                            </div>
                        </div>
                        <div className={`sm:text-sm mt-2 text-red-400 ${isTitleEmpty ? 'hidden' : 'block'}`}>
                            Title cannot be empty. Please enter a title.
                        </div>
                        <div className="flex justify-between items-center gap-4 mt-4">
                            <div className="mb-4 flex-grow">
                                {/* <label htmlFor="note_title" className="block mb-2 text-sm font-medium">Title</label> */}
                                <input type="text" id="note_title" className="border-b border-gray-800/80 block w-full 
                                py-2 font-bold placeholder-gray-500 text-gray-800 focus:outline-none bg-transparent
                                sm:text-[1.05rem] text-[1.08rem]"
                                    placeholder="Title" value={isRephrasedNote ? rephrasedNote.title : note.title}
                                    name="title" onChange={changeNote} required />
                            </div>
                            <div className=' text-sm border border-gray-800 hover:border-gray-950 rounded-lg py-1 px-2 
                                cursor-pointer mt-0'
                                onClick={changeGptRequirementModal}>
                                Generate <span><BiSolidSend className='inline' /></span>
                            </div>
                        </div>
                    </div>
                    <div className='text-area-section mb-2'>
                        <div className="mb-2 notemodal-text-area relative" ref={parentRef}>
                            <textarea type="text" id="note_content" className="rounded-lg bg-transparent block 
                                py-2 w-full placeholder-gray-500 text-gray-800 focus:outline-none
                                min-h-full note-textarea sm:text-[1rem] text-[1.05rem]" rows={textareaRows}
                                placeholder="Type your content here..."
                                value={isRephrasedNote ? rephrasedNote.content : note.content} name="content"
                                onChange={changeNote} required
                            />
                            <motion.div
                                drag
                                animate={{ y: !noteModalConfig.noteModalState && 0, x: !noteModalConfig.noteModalState && 0 }}
                                whileDrag={{ scale: 1.05 }}
                                dragConstraints={parentRef}
                                dragElastic={0.3}
                                className={`absolute ai-rephrase-btn flex flex-col gap-0 items-end`}
                            >
                                <PopUp2
                                    closeRephrasePopUp={closeRephrasePopUp}
                                    rephrasePopUp={rephrasePopUp} content={note.content}
                                    changeRephrasedNote={changeRephrasedNote}
                                    rephrasedNote={rephrasedNote}
                                    changeIsRepCnt={changeIsRepCnt}
                                    isRephrasedNote={isRephrasedNote}
                                    setLoadingRephraserFun={setLoadingRephraserFun}
                                    isDefault={isDefault}
                                    rephraseDefaultFalse={rephraseDefaultFalse}
                                    rephraseDefaultTrue={rephraseDefaultTrue}
                                />
                                <div
                                    className={`text-sm sm:text-xs text-gray-100 border border-gray-100 px-2 py-1 
                                    rounded-xl cursor-pointer dark:bg-gray-800/70 bg-gray-800/70
                                    flex gap-1 justify-center items-center ${rephrasePopUp && 'rounded-tr-none'}`}
                                    onClick={toggleRephrasePopUp}>
                                    <span className='text-sm'>
                                        <RiMagicFill className='inline text-lg' /> Grammar
                                    </span>
                                </div>
                            </motion.div>
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
            {ytVideoDeleteLoading &&
                <div
                    className={`modal-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap`}>
                    <ClipLoader3
                        color='#f86464'
                        loading='Generating...'
                        size={70}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                </div>
            }
        </div>
    )
}

export default NoteModal