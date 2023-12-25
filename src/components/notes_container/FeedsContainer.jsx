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
import dislikeAni from '@/assets/others/dislikeAni.json'
import ClipLoader from "react-spinners/HashLoader";
import { useTheme } from 'next-themes';
import { changePageLoader } from '@/redux_features/reduxPageLoader/reduxPageLoaderSlice';

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
    const [isDisliked, setDisLiked] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isremoved, setIsremoved] = useState(false)
    const [initialRender, setInitialRender] = useState(true);
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        //getUserCookie()
        getFeedsNotes()
        getGlobalUsers()
        scrollToTop()
        //dispatch(changePageLoader(false))
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
                        isPrivate: note.isPrivate,
                        userId: user._id,
                        username: user.username,
                        userAvatar: user.avatar,
                        created: note.created,
                        updated: note.updated,
                        coreUpdated: note.coreUpdated,
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

    useEffect(() => {
        let timeoutId;
        if (initialLoading === false) {
            timeoutId = setTimeout(() => {
                setInitialRender(false)
            }, 3000);
        }
        return () => {
            // Clear the timeout when the component unmounts or when dependencies change
            clearTimeout(timeoutId);
        };
    }, [initialLoading])

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
            // console.log('Global Users-----')
            // console.log(res.body)
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
        let newDetailNotes = [...detailNotes]
        let like, unlike, likedByBluePrint, unLikedByBluePrint;

        if (func === 'like') {
            setIsLiked(true)
            newDetailNotes = newDetailNotes.map(dNote => {
                if (dNote._id === id) {
                    like = dNote.likes + 1
                    likedByBluePrint = [user._id, ...dNote.likedBy]
                    return { ...dNote, likes: like, likedBy: likedByBluePrint }
                } else {
                    return dNote
                }
            })
            setDetailNotes(newDetailNotes)

            setTimeout(() => {
                setIsLiked(false)
            }, 1500);

            try {
                const res = await updateNoteLikesHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: { likedBy: user._id, func: func }
                })

                // Update the state with the returned note
                setDetailNotes(prevNotes => {
                    return prevNotes.map(pNote => {
                        if (pNote._id === id) {
                            return { ...pNote, likes: res.body.likes, likedBy: res.body.likedBy }
                        } else {
                            return pNote
                        }
                    })
                })
            } catch (error) {
                setDetailNotes(backupDetailNotes)
                toast.error(error.message)
            }
        } else if (func === 'unlike' && likeNo > 0) {
            setDisLiked(true)
            newDetailNotes = newDetailNotes.map(dNote => {
                if (dNote._id === id) {
                    unlike = dNote.likes - 1
                    unLikedByBluePrint = dNote.likedBy.filter(likedId => likedId !== user._id)
                    return { ...dNote, likes: unlike, likedBy: unLikedByBluePrint }
                } else {
                    return dNote
                }
            })

            setDetailNotes(newDetailNotes)

            setTimeout(() => {
                setDisLiked(false)
            }, 1500);

            try {
                const res = await updateNoteLikesHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: { likedBy: user._id, func: func }
                })

                // Update the state with the returned note
                setDetailNotes(prevNotes => {
                    return prevNotes.map(pNote => {
                        if (pNote._id === id) {
                            return { ...pNote, likes: res.body.likes, likedBy: res.body.likedBy }
                        } else {
                            return pNote
                        }
                    })
                })
            } catch (error) {
                setDetailNotes(backupDetailNotes)
                toast.error(error.message)
            }
        }
    }

    async function copyNote(e, id, func, copyNo) {
        e.stopPropagation()
        const backupDetailNotes = [...detailNotes]
        let newDetailNotes = [...detailNotes]
        let copy, copiedByBluePrint, removeCopy, removeCopiedByBluePrint

        if (func === 'copy') {
            setIsCopied(true)

            newDetailNotes = newDetailNotes.map(dNote => {
                if (dNote._id === id) {
                    copy = dNote.copies + 1
                    copiedByBluePrint = [user._id, ...dNote.copiedBy]
                    return { ...dNote, copies: copy, copiedBy: copiedByBluePrint }
                } else {
                    return dNote
                }
            })

            //Update copies locally
            setDetailNotes(newDetailNotes);

            setTimeout(() => {
                setIsCopied(false)
                toast.success('Copied to your notes')
            }, 1500);

            try {
                const res = await updateNoteCopiesHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: { copiedBy: user._id, func: func }
                })

                //Update the state with the returned note
                setDetailNotes(prevNotes => {
                    return prevNotes.map(pNote => {
                        if (pNote._id === id) {
                            return { ...pNote, copies: res.body.copies, copiedBy: res.body.copiedBy }
                        } else {
                            return pNote
                        }
                    })
                })

                //Create a new note for the user
                const clickedNote = backupDetailNotes.find(note => note._id === id)
                const copiedAndModifiedNote = {
                    ...clickedNote,
                    userId: user._id,
                    userAvatar: user.avatar,
                    username: user.username,
                    isOriginal: false,
                    originId: id,
                }

                await handleCopyHelper({
                    noteid: id,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: copiedAndModifiedNote
                })
            } catch (error) {
                setDetailNotes(backupDetailNotes)
                toast.error(error.message)
            }

        } else if (func === 'remove' && copyNo > 0) {
            // Updates the local state and then updates the database
            setIsremoved(true)
            newDetailNotes = newDetailNotes.map(dNote => {
                if (dNote._id === id) {
                    removeCopy = dNote.copies - 1
                    removeCopiedByBluePrint = dNote.copiedBy.filter(copiedUserId => copiedUserId !== user._id)
                    return { ...dNote, copies: copy, copiedBy: removeCopiedByBluePrint }
                } else {
                    return dNote
                }
            })

            //Update copies locally
            setDetailNotes(newDetailNotes);

            setTimeout(() => {
                setIsremoved(false)
                toast.success('Removed from your notes')
            }, 700);

            try {
                const res = await updateNoteCopiesHelper({
                    noteid: id,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: { copiedBy: user._id, func: func }
                })

                //Update the state with the returned note
                setDetailNotes(prevNotes => {
                    return prevNotes.map(pNote => {
                        if (pNote._id === id) {
                            return { ...pNote, copies: res.body.copies, copiedBy: res.body.copiedBy }
                        } else {
                            return pNote
                        }
                    })
                })

                await handleCopyHelper({
                    noteid: id,
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: { userId: user._id }
                })
            } catch (error) {
                setDetailNotes(backupDetailNotes)
                toast.error(error.message)
            }
        }
    }


    // console.log('Detail Note:')
    // console.log(deletedNotes)

    return (
        <>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-6 mt-12'>
                {initialLoading ?
                    <HomePageSkeleton number={30} /> :
                    <FeedsNotes
                        notes={detailNotes} //array of note objects
                        deletedNotes={deletedNotes}
                        toggleLikes={toggleLikes}
                        user={user}
                        copyNote={copyNote}
                        initialRender={initialRender}
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
            {isDisliked &&
                <div
                    className={`loader-gpt fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                                items-center flex-wrap`}>
                    <div className="text-2xl mt-5 font-bold text-[#f1f5f9] w-[35%] sm:w-[25%]">
                        <Lottie className="text-sm" animationData={dislikeAni} loop={false} />
                    </div>
                </div>

            }
            {isCopied &&
                <div
                    className={`loader-gpt fixed top-0 inset-0 backdrop-blur-[2px] flex flex-col justify-center 
                                items-center flex-wrap`}>
                    <div className="text-2xl mt-5 font-bold text-[#f1f5f9] sm:w-[45%]">
                        <Lottie className="text-sm" animationData={copyAni} />
                    </div>
                </div>

            }
            {/* <Toaster /> */}
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