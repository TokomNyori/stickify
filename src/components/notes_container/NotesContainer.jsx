'use client'
import { deleteNoteHelper, editStatusNoteHelper, getNoteHelper, updateNoteCopiesHelper } from '@/helper/httpHelpers/httpNoteHelper'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react'
import Notes from './Notes';
import HomePageSkeleton from '../skeleton_loaders/HomePageSkeleton';
import scrollToTop from '@/helper/scrollToTop';
import { CookieHelper } from '@/helper/httpHelpers/httpCookieHelper';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@/redux_features/user/userSlice';
import { addNote } from '@/redux_features/notes/noteSlice';
import ClipLoader from "react-spinners/HashLoader";
import { useTheme } from 'next-themes';
import { IoAddSharp } from "react-icons/io5";
import { addPage } from '@/redux_features/pages/pageSlice';
import { setNoteModalConfig } from '@/redux_features/noteModalConfig/noteModalConfigSlice';
import WarningModal from '../modals/WarningModal';
import Lottie from 'lottie-react'
import studyAni from '@/assets/others/studyAni.json'
import stickyNote from '@/assets/others/stickyNote.json'
import Typewriter from 'typewriter-effect'
import { changePageLoader } from '@/redux_features/reduxPageLoader/reduxPageLoaderSlice';


export default function NotesContainer() {
    //const [notes, setNotes] = useState([])
    const users = useSelector(state => state.user.users)
    const notes = useSelector(state => state.note.notes)
    const [pinnedNotes, setPinnedNotes] = useState([])
    const [otherNotes, setOtherNotes] = useState([])
    const [deletedNotes, setDeletedNotes] = useState({});
    const [pinnedNoteAni, setpinnedNoteAni] = useState({});
    const [initialLoading, setInitialLoading] = useState(true);
    const [initialRender, setInitialRender] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pinLoading, setPinLoading] = useState(false);
    const [warningModalState, setWarningModalState] = useState(false)
    const [pinState, setPinState] = useState('')
    const [currentNoteIdForDelete, setCurrentNoteIdForDelete] = useState('')
    const [currentOriginId, setCurrentOriginId] = useState('')
    const [isItOriginal, setIsItOriginal] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        if (Object.keys(users).length === 0) {
            getUserCookie()
        }
        //getUserCookie()
        dispatch(changePageLoader(false))
        dispatch(addPage('home'))
    }, [])

    useEffect(() => {
        if (users._id) {
            getNotes()
            scrollToTop()
        }
    }, [users])

    useEffect(() => {
        if (notes) {
            const pinned = notes?.filter(note => note.status === 'pinned')
            setPinnedNotes(pinned)
            const others = notes.filter(note => note.status !== 'pinned')
            setOtherNotes(others)
        }
    }, [notes])

    useEffect(() => {
        let timeoutId;
        if (initialLoading === false) {
            timeoutId = setTimeout(() => {
                setInitialRender(false)
            }, 6700);
        }
        return () => {
            // Clear the timeout when the component unmounts or when dependencies change
            clearTimeout(timeoutId);
        };
    }, [initialLoading])

    const { theme, setTheme } = useTheme()

    async function getUserCookie() {
        try {
            const res = await CookieHelper()
            dispatch(addUser(res.body))
        } catch (error) {
            console.log('CookieHelper Error')
            console.log(error.message)
        }
    }

    async function getNotes() {
        try {
            const res = await getNoteHelper({ method: 'GET', userId: users._id, headers: { 'Content-Type': 'application/json' } })
            dispatch(addNote(res.body))
            setInitialLoading(false)
        } catch (error) {
            console.log('getNoteHelper error message:')
            console.log(error)
            toast(error.message, {
                icon: '🥺',
                duration: 3000,
            });
        }
    }

    function deleteNotes(e, noteid, isOriginal, originNoteId) {
        e.stopPropagation()
        if (!isOriginal) {
            setCurrentOriginId(originNoteId)
            setIsItOriginal(false)
        }
        setWarningModalState(true)
        setCurrentNoteIdForDelete(noteid)
    }

    async function conifirmDelete(
        { operation, noteid, isItOriginalNote, originNoteId }
    ) {
        // console.log(isItOriginalNote)
        // console.log(originNoteId)
        if (operation === 'no') {
            setWarningModalState(false)
            setCurrentNoteIdForDelete('')
            return
        } else {
            const backupNotes = [...notes]
            setWarningModalState(false)
            setDeleteLoading(true)

            //Deletes local redux Note state with animation
            setDeletedNotes({ ...deletedNotes, [noteid]: true });
            const refreshedNotes = notes.filter(note => note._id !== noteid)
            setTimeout(() => {
                //setNotes(refreshedNotes)
                dispatch(addNote(refreshedNotes))
                const newDeletedNotes = { ...deletedNotes };
                delete newDeletedNotes[noteid];
                setDeletedNotes(newDeletedNotes);
                setDeleteLoading(false)
                toast('Destroyed successfully!', {
                    icon: '🔥',
                });
            }, 500); // Match this with the CSS animation duration

            // Making API requests to delete the note object and to remove self from likedBy list from the original note
            try {
                if (isItOriginalNote) {
                    const res = await deleteNoteHelper({
                        noteid: noteid, method: 'DELETE', headers: { 'Content-Type': 'application/json' },
                        body: { isItOriginalNote: isItOriginalNote }  //isItOriginalNote is true
                    })
                } else {
                    // Delete the copied note
                    const res = await deleteNoteHelper({
                        noteid: originNoteId, method: 'DELETE', headers: { 'Content-Type': 'application/json' },
                        body: { isItOriginalNote: isItOriginalNote, userId: users._id }  //isItOriginalNote is false
                    })
                    // Remove self from copiedBy list from the original note
                    const removeCopyRes = await updateNoteCopiesHelper({
                        noteid: originNoteId,
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: { copiedBy: users._id, func: 'remove' }
                    })
                }
                getNotes()
            } catch (error) {
                setDeleteLoading(false)
                dispatch(addNote(backupNotes))
                toast(`Sorry could not delete!`, {
                    icon: '🥺',
                    duration: 3000,
                });
            }
        }
    }

    //console.log(notes)

    async function togglePinned(e, id, func) {
        // Unpinned or remove from pinned
        e.stopPropagation()
        setPinLoading(true)
        //Backup 
        const pinnedNotesBackup = [...pinnedNotes]
        const otherNotesBackup = [...otherNotes]
        setpinnedNoteAni({ ...pinnedNoteAni, [id]: true });

        if (func === 'remove') {
            setPinState('remove')
            const pinned = pinnedNotes.filter(pinNote => pinNote._id !== id)
            const other = pinnedNotes.filter(pinNote => pinNote._id === id)
            const otherCopy = [...other][0]
            const otherChangeStatus = { ...otherCopy, status: 'others' }
            setTimeout(() => {
                setPinLoading(false)
                const newPinnedAni = { ...pinnedNoteAni };
                delete newPinnedAni[id];
                setpinnedNoteAni(newPinnedAni);
                setPinState('')
                toast.success('Unpinned')
            }, 600);
            try {
                setPinnedNotes(pinned)
                setOtherNotes(prev => ([otherChangeStatus, ...prev]))
                const res = await editStatusNoteHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: otherChangeStatus
                })
                getNotes()
            } catch (error) {
                setPinnedNotes(pinnedNotesBackup)
                setOtherNotes(otherNotesBackup)
                setPinLoading(false)
                toast.error(error.message)
            }
        } else {
            // Pinned or add to pinned
            setPinState('add')
            const others = otherNotes.filter(otherNote => otherNote._id !== id)
            const pinned = otherNotes.filter(otherNote => otherNote._id === id)
            const pinnedCopy = [...pinned][0]
            const pinnedChangeStatus = { ...pinnedCopy, status: 'pinned' }
            setTimeout(() => {
                setPinLoading(false)
                const newPinnedAni = { ...pinnedNoteAni };
                delete newPinnedAni[id];
                setpinnedNoteAni(newPinnedAni);
                setPinState('')
                toast.success('Pinned')
            }, 600);
            try {
                setOtherNotes(others)
                setPinnedNotes(prev => ([pinnedChangeStatus, ...prev]))
                const res = await editStatusNoteHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: pinnedChangeStatus
                })
                getNotes()
            } catch (error) {
                setPinnedNotes(pinnedNotesBackup)
                setOtherNotes(otherNotesBackup)
                setPinLoading(false)
                toast.error(error.message)
            }
        }
    }

    // console.log('Notes')
    // console.log(notes)
    // console.log(otherNotes)

    return (
        <div className=''>
            {
                initialLoading ?
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-6 mt-12'>
                        <HomePageSkeleton number={30} />
                    </div>
                    :
                    <>
                        {
                            notes?.length === 0 &&
                            <div
                                className="flex mt-12 sm:mt-0 flex-col sm:flex-row justify-between items-center gap-16
                                sm:justify-around sm:items-center text-3xl sm:4xl">
                                <div className='flex flex-col justify-center items-center cursor-pointer gap-1 sm:ml-12'
                                    onClick={() => dispatch(setNoteModalConfig({ noteModalState: true, as: 'create', noteObject: {} }))}
                                >
                                    <div>
                                        Create note
                                    </div>
                                    <div>
                                        <Lottie className="w-44 -mt-5" animationData={stickyNote} />
                                    </div>
                                </div>
                                <div className=''>
                                    <Lottie className="w-[100%]" animationData={studyAni} />
                                </div>
                            </div>
                        }
                        {pinnedNotes.length !== 0 ?
                            <>
                                <div className='mt-12 mb-2'>Pinned</div>
                                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-6'>
                                    <Notes
                                        pinnedNoteAni={pinnedNoteAni}
                                        pinState={pinState}
                                        initialRender={initialRender}
                                        notes={pinnedNotes} //array of note objects
                                        noteType='pinned'
                                        deleteNotes={deleteNotes} //function
                                        deletedNotes={deletedNotes} //function
                                        togglePinned={togglePinned} //function
                                    />
                                </div>
                            </> : ''
                        }
                        <div className={`${pinnedNotes.length !== 0 ? 'mt-6' : 'mt-12'} mb-2`}>
                            {pinnedNotes.length !== 0 && otherNotes.length !== 0 ? 'Others' : ''}
                        </div>
                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-6'>
                            <Notes
                                pinnedNoteAni={pinnedNoteAni}
                                pinState={pinState}
                                initialRender={initialRender}
                                notes={otherNotes} //array of note objects
                                noteType='others'
                                deleteNotes={deleteNotes} //function
                                deletedNotes={deletedNotes} //function
                                togglePinned={togglePinned} //function
                            />
                        </div>
                    </>
            }
            {deleteLoading &&
                <div
                    className={`modal-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap`}>
                    <ClipLoader
                        color={`${theme === 'dark' ? '#f86464' : '#ac3232'}`}
                        loading='Generating...'
                        //cssOverride={override}
                        size={70}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    {/* <div className="text-2xl mt-5 font-bold text-[#ac3232]">
                        Deleting note...
                    </div> */}
                </div>
            }
            {pinLoading &&
                <div
                    className={`modal-blur fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                    items-center flex-wrap`}>
                    <ClipLoader
                        color={`${theme === 'dark' ? '#51f770' : '#35a149'}`}
                        loading='Generating...'
                        //cssOverride={override}
                        size={70}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    {
                        /* <div className="text-2xl mt-5 font-bold text-[#35a149]">
                            Deleting note...
                        </div> */
                    }
                </div>
            }
            <WarningModal warningModalState={warningModalState} action={conifirmDelete} noteid={currentNoteIdForDelete}
                modalType={'delete'} isItOriginal={isItOriginal} currentOriginId={currentOriginId} />
            {/* <Toaster /> */}
        </div>
    )
}