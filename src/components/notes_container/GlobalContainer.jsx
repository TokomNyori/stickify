'use client'
import { getGlobalNoteHelper, getNoteHelper } from '@/helper/httpHelpers/httpNoteHelper'
import toast, { Toaster } from 'react-hot-toast';
import { useContext, useEffect, useState } from 'react'
import Notes from './Notes';
import HomePageSkeleton from '../skeleton_loaders/HomePageSkeleton';
import scrollToTop from '@/helper/scrollToTop';
import { CookieHelper } from '@/helper/httpHelpers/httpCookieHelper';
import { getGlobalUsersHelper } from '@/helper/httpHelpers/httpUserHelper';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@/redux_features/user/userSlice';
import { addPage } from '@/redux_features/pages/pageSlice';


export default function GlobalContainer() {
    const [notes, setNotes] = useState([])
    const [globalUsers, setGlobalUsers] = useState([])
    const [initialLoading, setInitialLoading] = useState(true);
    const [deletedNotes, setDeletedNotes] = useState({});
    const [detailNotes, setDetailNotes] = useState([])
    const users = useSelector(state => state.user.users)
    const dispatch = useDispatch()

    useEffect(() => {
        getGlobalNotes()
        getGlobalUsers()
        getUserCookie()
        scrollToTop()
        dispatch(addPage('feeds'))
    }, [])

    useEffect(() => {
        let looping = []
        notes.forEach(note => {
            globalUsers.forEach(user => {
                if (note.userId === user._id) {
                    looping.push({
                        _id: note._id,
                        title: note.title,
                        color: note.color,
                        content: note.content,
                        status: note.status,
                        userId: user._id,
                        username: user.username,
                        user_avatar: user.avatar,
                        created: note.created,
                    });
                }
            })
        })
        console.log(looping)
        setDetailNotes(looping)
    }, [globalUsers, notes])

    async function getGlobalNotes() {
        try {
            const res = await getGlobalNoteHelper({ method: 'GET' })
            setNotes(res.body?.reverse())
            setInitialLoading(false)
        } catch (error) {
            console.log('getGlobalNoteHelper error message:')
            console.log(error)
            toast(error.message, {
                icon: '🥺',
                duration: 3000,
            });
        }
    }

    async function getGlobalUsers() {
        try {
            const res = await getGlobalUsersHelper({ method: 'GET' })
            setGlobalUsers(res.body)
        } catch (error) {
            console.log('getGlobalNoteHelper error message:')
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
                setNotes(refreshedNotes)
                const newDeletedNotes = { ...deletedNotes };
                delete newDeletedNotes[noteid];
                setDeletedNotes(newDeletedNotes);
                toast('Destroyed successfully!', {
                    icon: '🔥',
                });
                getNotes()
            }, 500); // Match this with the CSS animation duration
        } catch (error) {
            setNotes(backupNotes)
            toast(`Sorry could not delete!`, {
                icon: '🥺',
                duration: 3000,
            });
        }
    }

    async function getUserCookie() {
        try {
            const res = await CookieHelper()
            // console.log('CookieHelper')
            // console.log(res.body)
            dispatch(addUser(res.body))
        } catch (error) {
            console.log('CookieHelper Error')
            console.log(error.message)
        }
    }

    console.log('Detail Note:')
    console.log(detailNotes)

    return (
        <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 gap-y-4 sm:gap-4 sm:gap-y-6 mt-12'>
            {initialLoading ?
                <HomePageSkeleton number={30} /> :
                <Notes
                    notes={detailNotes} //array of note objects
                    container='globalContainer'
                    deleteNotes={deleteNotes} //function
                    deletedNotes={deletedNotes}
                />}
            <Toaster />
        </div>
    )
}