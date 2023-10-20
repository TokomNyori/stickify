'use client'
import { deleteNoteHelper, getNoteHelper } from '@/helper/httpHelpers/httpNoteHelper'
import toast, { Toaster } from 'react-hot-toast';
import { useContext, useEffect, useState } from 'react'
import Notes from './Notes';
import HomePageSkeleton from '../skeleton_loaders/HomePageSkeleton';
import scrollToTop from '@/helper/scrollToTop';
import { CookieHelper } from '@/helper/httpHelpers/httpCookieHelper';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@/redux_features/user/userSlice';
import { addNote } from '@/redux_features/notes/noteSlice';

export default function NotesContainer() {
    //const [notes, setNotes] = useState([])
    const [initialLoading, setInitialLoading] = useState(true);
    const [deletedNotes, setDeletedNotes] = useState({});

    const users = useSelector(state => state.user.users)
    const notes = useSelector(state => state.note.notes)
    const dispatch = useDispatch()
    useEffect(() => {
        getNotes()
        scrollToTop()
        getUserCookie()
    }, [])

    // useEffect(() => {
    //     if (Object.keys(users).length !== 0) {
            
    //     }
    // }, [users])

    async function getUserCookie() {
        try {
            const res = await CookieHelper()
            console.log('CookieHelper')
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
            dispatch(addNote(res.body.reverse()))
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

    async function deleteNotes(noteid) {
        const backupNotes = [...notes]
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
                toast('Destroyed successfully!', {
                    icon: '🔥',
                });
                getNotes()
            }, 500); // Match this with the CSS animation duration
        } catch (error) {
            dispatch(addNote(backupNotes))
            toast(`Sorry could not delete!`, {
                icon: '🥺',
                duration: 3000,
            });
        }
    }

    console.log('redux users')
    console.log(users)

    return (
        <div>
            <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 gap-y-4 sm:gap-4 sm:gap-y-6 mt-12'>
                {initialLoading ?
                    <HomePageSkeleton number={18} /> :
                    <Notes
                        notes={notes} //array of note objects
                        container='noteContainer'
                        deleteNotes={deleteNotes} //function
                        deletedNotes={deletedNotes} //function
                    />}
                <Toaster />
            </div>
        </div>
    )
}