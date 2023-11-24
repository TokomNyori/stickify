'use client'
import { getFeedsNoteHelper, handleCopyHelper, postNoteHelper, updateNoteCopiesHelper, updateNoteLikesHelper } from '@/helper/httpHelpers/httpNoteHelper'
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
import ClipLoader from "react-spinners/HashLoader";
import { useTheme } from 'next-themes';

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
    const [isremoved, setIsremoved] = useState(false)
    const { theme, setTheme } = useTheme()

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
                if (note.userId === user._id && !note.isPrivate && note.isOriginal) {
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
                        likedBy: note.likedBy,
                        copies: note.copies,
                        copiedBy: note.copiedBy,
                        isOriginal: note.isOriginal,
                        originId: note.originId,
                        ytVideo: note.ytVideo
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

    async function toggleLikes(e, id, func, likeNo) {
        e.stopPropagation()
        //Backup 
        const backupDetailNotes = [...detailNotes]
        if (func === 'like') {
            setIsLiked(true)
            let like;
            let likedByBluePrint
            detailNotes.forEach(dNote => {
                if (dNote._id === id) {
                    like = dNote.likes + 1
                    likedByBluePrint = [user._id, ...dNote.likedBy]
                }
            })
            setDetailNotes(prevNotes => {
                return prevNotes.map(pNote => {
                    if (pNote._id === id) {
                        return { ...pNote, likes: like, likedBy: likedByBluePrint }
                    } else {
                        return pNote
                    }
                })
            });
            setTimeout(() => {
                setIsLiked(false)
            }, 1500);
            try {
                const res = await updateNoteLikesHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: { likes: like, likedBy: likedByBluePrint }
                })
                //getFeedsNotes()
                //getGlobalUsers()
            } catch (error) {
                setDetailNotes(backupDetailNotes)
                toast.error(error.message)
            }
        } else if (func === 'unlike' && likeNo > 0) {
            let unlike;
            let unLikedByBluePrint
            detailNotes.forEach(dNote => {
                if (dNote._id === id) {
                    unlike = dNote.likes - 1
                    unLikedByBluePrint = dNote.likedBy.filter(likedId => likedId !== user._id)
                }
            })
            setDetailNotes(prevNotes => {
                return prevNotes.map(pNote => {
                    if (pNote._id === id) {
                        return { ...pNote, likes: unlike, likedBy: unLikedByBluePrint }
                    } else {
                        return pNote
                    }
                })
            });
            try {
                const res = await updateNoteLikesHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: { likes: unlike, likedBy: unLikedByBluePrint }
                })
                // getFeedsNotes()
                // getGlobalUsers()
            } catch (error) {
                console.log(error)
                setDetailNotes(backupDetailNotes)
                toast.error(error.message)
            }
        }
    }

    async function copyNote(e, id, func, copyNo) {
        e.stopPropagation()
        const backupDetailNotes = [...detailNotes]

        if (func === 'copy') {
            setIsCopied(true)
            let copy
            let copiedByBluePrint
            detailNotes.forEach(dNote => {
                if (dNote._id === id) {
                    copy = dNote.copies + 1
                    copiedByBluePrint = [user._id, ...dNote.copiedBy]
                }
            })

            //Update copies locally
            setDetailNotes(prevNotes => {
                return prevNotes.map(pNote => {
                    if (pNote._id === id) {
                        return {
                            ...pNote,
                            copies: copy,
                            copiedBy: copiedByBluePrint,
                        }
                    } else {
                        return pNote
                    }
                })
            });

            //Create a copy with change in some properties like originId, etc.
            const clickedNote = backupDetailNotes.filter(note => note._id === id)
            //const idOfOriginalNote = id
            const copiedANdModifiedNote = {
                ...clickedNote[0],
                userId: user._id,
                isOriginal: false,
                originId: id,
            }

            setTimeout(() => {
                setIsCopied(false)
                toast.success('Copied to your notes')
            }, 1500);

            try {
                const res = await updateNoteCopiesHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: { copies: copy, copiedBy: copiedByBluePrint }
                })

                const copyNoteRes = await handleCopyHelper({
                    noteid: id,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: { ...copiedANdModifiedNote }
                })
                //getFeedsNotes()
                //getGlobalUsers()
            } catch (error) {
                setDetailNotes(backupDetailNotes)
                toast.error(error.message)
            }
        } else if (func === 'remove' && copyNo > 0) {
            setIsremoved(true)
            let copy
            let copiedByBluePrint
            detailNotes.forEach(dNote => {
                if (dNote._id === id) {
                    copy = dNote.copies - 1
                    copiedByBluePrint = dNote.copiedBy.filter(copiedUserId => copiedUserId !== user._id)
                }
            })

            //Update copies locally
            setDetailNotes(prevNotes => {
                return prevNotes.map(pNote => {
                    if (pNote._id === id) {
                        return {
                            ...pNote,
                            copies: copy,
                            copiedBy: copiedByBluePrint,
                        }
                    } else {
                        return pNote
                    }
                })
            });

            setTimeout(() => {
                setIsremoved(false)
                toast.success('Removed from your notes')
            }, 700);

            try {
                const res = await updateNoteCopiesHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: { copies: copy, copiedBy: copiedByBluePrint }
                })

                const deleteNoteRes = await handleCopyHelper({
                    noteid: id,
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: { userId: user._id }
                })
                //getFeedsNotes()
                //getGlobalUsers()
            } catch (error) {
                setDetailNotes(backupDetailNotes)
                toast.error(error.message)
            }
        } else {
            toast.success(`Too low ${copyNo}`)
        }
    }


    // console.log('Detail Note:')
    // console.log(deletedNotes)

    return (
        <>
            <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-6 mt-12'>
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
                    <div className="text-2xl mt-5 font-bold text-[#f1f5f9] sm:w-[50%]">
                        <Lottie className="text-sm" animationData={copyAni} />
                    </div>
                </div>

            }
            <Toaster />
            {isremoved &&
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
        </>
    )
}