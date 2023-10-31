'use client'
import { deleteNoteHelper, editStatusNoteHelper, getNoteHelper } from '@/helper/httpHelpers/httpNoteHelper'
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

export default function NotesContainer() {
    //const [notes, setNotes] = useState([])
    const users = useSelector(state => state.user.users)
    const notes = useSelector(state => state.note.notes)
    const [pinnedNotes, setPinnedNotes] = useState([])
    const [otherNotes, setOtherNotes] = useState([])
    const [deletedNotes, setDeletedNotes] = useState({});
    const [initialLoading, setInitialLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pinLoading, setPinLoading] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        getNotes()
        getUserCookie()
        scrollToTop()
        dispatch(addPage('home'))
    }, [])

    useEffect(() => {
        const pinned = notes.filter(note => note.status === 'pinned')
        setPinnedNotes(pinned)
        const others = notes.filter(note => note.status !== 'pinned')
        setOtherNotes(others)
    }, [notes])

    const { theme, setTheme } = useTheme()

    async function getUserCookie() {
        try {
            const res = await CookieHelper()
            console.log('Get Cookies:')
            console.log(res.body)
            dispatch(addUser(res.body))
        } catch (error) {
            console.log('CookieHelper Error')
            console.log(error.message)
        }
    }

    async function getNotes() {
        try {
            const res = await getNoteHelper({ method: 'GET' })
            console.log('Get notes:')
            console.log(res.body)
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

    async function deleteNotes(e, noteid) {
        e.stopPropagation()
        const backupNotes = [...notes]
        setDeleteLoading(true)
        try {
            const res = await deleteNoteHelper({ noteid: noteid, method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
            setDeletedNotes({ ...deletedNotes, [noteid]: true });
            setTimeout(() => {
                const refreshedNotes = notes.filter(note => note._id !== noteid)
                //setNotes(refreshedNotes)
                dispatch(addNote(refreshedNotes))
                const newDeletedNotes = { ...deletedNotes };
                delete newDeletedNotes[noteid];
                setDeletedNotes(newDeletedNotes);
                setDeleteLoading(false)
                toast('Destroyed successfully!', {
                    icon: '🔥',
                });
                getNotes()
            }, 500); // Match this with the CSS animation duration
        } catch (error) {
            setDeleteLoading(false)
            dispatch(addNote(backupNotes))
            toast(`Sorry could not delete!`, {
                icon: '🥺',
                duration: 3000,
            });
        }
    }

    async function togglePinned(e, id, func) {
        // Unpinned or remove from pinned
        e.stopPropagation()
        setPinLoading(true)
        //Backup 
        const pinnedNotesBackup = [...pinnedNotes]
        const otherNotesBackup = [...otherNotes]

        if (func === 'remove') {
            const pinned = pinnedNotes.filter(pinNote => pinNote._id !== id)
            const other = pinnedNotes.filter(pinNote => pinNote._id === id)
            const otherCopy = [...other][0]
            const otherChangeStatus = { ...otherCopy, status: 'others' }
            try {
                setPinnedNotes(pinned)
                setOtherNotes(prev => ([otherChangeStatus, ...prev]))
                setPinLoading(false)
                toast.success('Unpinned')
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
            const others = otherNotes.filter(otherNote => otherNote._id !== id)
            const pinned = otherNotes.filter(otherNote => otherNote._id === id)
            const pinnedCopy = [...pinned][0]
            const pinnedChangeStatus = { ...pinnedCopy, status: 'pinned' }
            try {
                setOtherNotes(others)
                setPinnedNotes(prev => ([pinnedChangeStatus, ...prev]))
                setPinLoading(false)
                toast.success('Pinned')
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
                    <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 gap-y-4 sm:gap-4 sm:gap-y-6 mt-12'>
                        <HomePageSkeleton number={18} />
                    </div>
                    :
                    <>
                        {
                            notes.length === 0 &&
                            <div
                                className=' mt-20 flex justify-center items-center gap-2 text-2xl opacity-50 
                                max-w-fit m-auto cursor-pointer hover:opacity-100'
                                onClick={() => dispatch(setNoteModalConfig({ noteModalState: true, as: 'create', noteObject: {} }))}
                            >
                                <span className='inline'>Create note</span>
                                <span className='inline'>
                                    <IoAddSharp className='text-3xl' />
                                </span>
                            </div>
                        }
                        {pinnedNotes.length !== 0 ?
                            <>
                                <div className='mt-12 mb-2'>Pinned</div>
                                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 gap-y-4 sm:gap-4 sm:gap-y-6'>
                                    <Notes
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
                            {pinnedNotes.length !== 0 ? 'Others' : ''}
                        </div>
                        <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 gap-y-4 sm:gap-4 sm:gap-y-6'>
                            <Notes
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
            <Toaster />
        </div>
    )
}