'use client'
import { getFeedsNoteHelper, postNoteHelper, updateNoteLikesHelper } from '@/helper/httpHelpers/httpNoteHelper'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react'
import HomePageSkeleton from '../skeleton_loaders/HomePageSkeleton';
import scrollToTop from '@/helper/scrollToTop';
import { CookieHelper } from '@/helper/httpHelpers/httpCookieHelper';
import { getGlobalUsersHelper } from '@/helper/httpHelpers/httpUserHelper';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@/redux_features/user/userSlice';
import { addPage } from '@/redux_features/pages/pageSlice';
import FeedsNotes from './FeedsNotes';
import Lottie from 'lottie-react'
import loveAni from '@/assets/others/loveLottie.json'
import copyAni from '@/assets/others/copyLottie.json'
import loveAni2 from '@/assets/others/celebrateLottie.json'

export default function FeedsContainer() {
    const [notes, setNotes] = useState([])
    const [globalUsers, setGlobalUsers] = useState([])
    const [initialLoading, setInitialLoading] = useState(true);
    const [deletedNotes, setDeletedNotes] = useState({});
    const [detailNotes, setDetailNotes] = useState([])
    const [otherNotes, setOtherNotes] = useState([])
    const user = useSelector(state => state.user.users)
    const dispatch = useDispatch()
    const [isLiked, setIsLiked] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    useEffect(() => {
        getUserCookie()
        getFeedsNotes()
        getGlobalUsers()
        scrollToTop()
        dispatch(addPage('feeds'))
    }, [])

    useEffect(() => {
        let looping = []
        notes.forEach(note => {
            globalUsers.forEach(user => {
                if (note.userId === user._id && !note.isPrivate) {
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
                        likes: note.likes,
                        likedBy: note.likedBy
                    });
                }
            })
        })
        //console.log(looping)
        setDetailNotes(looping)
    }, [globalUsers, notes])

    async function getFeedsNotes() {
        try {
            const res = await getFeedsNoteHelper({ method: 'GET' })
            console.log('Global Notes-----')
            console.log(res.body)
            setNotes(res.body)
            setInitialLoading(false)
        } catch (error) {
            console.log('getFeedsNoteHelper error message:')
            console.log(error)
            toast(error.message, {
                icon: '🥺',
                duration: 3000,
            });
        }
    }

    async function getGlobalUsers() {
        try {
            const res = await getGlobalUsersHelper({ method: 'PUT' })
            console.log('Global Users-----')
            console.log(res.body)
            setGlobalUsers(res.body)
        } catch (error) {
            console.log('getGlobalUsersHelper error message:')
            console.log(error)
            toast(error.message, {
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

    async function toggleLikes(e, id, func) {
        e.stopPropagation()
        //Backup 
        const backupDetailNotes = [...detailNotes]
        if (func === 'like') {
            setIsLiked(true)
            setDetailNotes(prevNotes => {
                return prevNotes.map(note => {
                    if (note._id === id) {
                        const updatedLikedBy = [...note.likedBy, user._id];
                        return { ...note, likes: note.likes + 1, likedBy: updatedLikedBy };
                    } else {
                        return note; // Return the original object for other notes
                    }
                });
            });
            setTimeout(() => {
                setIsLiked(false)
            }, 1500);
            try {
                const res = await updateNoteLikesHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: { userId: user._id, operation: 'like' }
                })
                //getFeedsNotes()
                //getGlobalUsers()
            } catch (error) {
                setDetailNotes(backupDetailNotes)
                toast.error(error.message)
            }
        } else {
            console.log('Unlike func')
            setDetailNotes(prevNotes => {
                return prevNotes.map(note => {
                    if (note._id === id) {
                        const updatedUnlikedBy = note.likedBy.filter(likedUserId => likedUserId !== user._id);
                        return { ...note, likes: note.likes - 1, likedBy: updatedUnlikedBy };
                    } else {
                        return note; // Return the original object for other notes
                    }
                });
            });
            try {
                const res = await updateNoteLikesHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: { userId: user._id, operation: 'unlike' }
                })
                //getFeedsNotes()
                //getGlobalUsers()
            } catch (error) {
                console.log(error)
                setDetailNotes(backupDetailNotes)
                toast.error(error.message)
            }
        }
    }

    async function copyNote(e, id) {
        e.stopPropagation()
        setIsCopied(true)
        const clickedNote = detailNotes.filter(note => note._id === id)
        const copiedNote = { ...clickedNote[0], userId: user._id }
        console.log('Copied Note:')
        console.log(copiedNote)
        try {
            const res = await postNoteHelper({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: copiedNote })
            //getFeedsNotes()
            setIsCopied(false)
            toast.success('Copied to your notes')
        } catch (error) {
            setIsCopied(false)
            console.log(error)
            toast.error('Failed to copy')
        }
    }


    // console.log('Detail Note:')
    // console.log(deletedNotes)

    return (
        <>
            <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 gap-y-4 sm:gap-4 sm:gap-y-6 mt-12'>
                {initialLoading ?
                    <HomePageSkeleton number={30} /> :
                    <FeedsNotes
                        notes={detailNotes} //array of note objects
                        deletedNotes={deletedNotes}
                        toggleLikes={toggleLikes}
                        user={user}
                        copyNote={copyNote}
                    />
                }
            </div>
            {isLiked &&
                <div
                    className={`loader-gpt fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                                items-center flex-wrap`}>
                    <div className="text-2xl mt-5 font-bold text-[#f1f5f9]">
                        <Lottie className="text-sm" animationData={loveAni} loop={false} />
                    </div>
                </div>

            }
            {isCopied &&
                <div
                    className={`loader-gpt fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                                items-center flex-wrap`}>
                    <div className="text-2xl mt-5 font-bold text-[#f1f5f9]">
                        <Lottie className="text-sm" animationData={copyAni} />
                    </div>
                </div>

            }
            <Toaster />
        </>
    )
}