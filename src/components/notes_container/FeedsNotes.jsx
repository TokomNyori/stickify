'use client'
import { MdDeleteOutline } from 'react-icons/md'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { HiMiniViewfinderCircle } from 'react-icons/hi2'
import { AiOutlineHeart } from 'react-icons/ai'
import { AiFillHeart } from 'react-icons/ai'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { IoAddOutline } from "react-icons/io5";
import { BsPinAngle } from "react-icons/bs"
import { BsPinAngleFill } from "react-icons/bs"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { addCurrentNotePage } from '@/redux_features/currentNotePage/currentNotePageSlice'
import { setNoteModalConfig } from '@/redux_features/noteModalConfig/noteModalConfigSlice'
import { useEffect, useState } from 'react'
import { postNoteHelper } from '@/helper/httpHelpers/httpNoteHelper'
import { motion } from "framer-motion"

const FeedsNotes = ({ notes, deletedNotes, toggleLikes, user, copyNote }) => {

    const dispatch = useDispatch()
    const router = useRouter()

    function toTheNotePage(e, id) {
        e.stopPropagation()
        const clickedNote = notes.filter(note => note._id === id)
        dispatch(addCurrentNotePage(clickedNote[0]))
        router.push(`/${id}`)
    }

    const taskBoxes = notes?.map(note => {

        let liked = false
        for (const like of note.likedBy) {
            if (like === user._id) {
                liked = true
                break; // This will exit the loop when element is 3
            }
        }

        return (
            <motion.div
                initial={{ y: -600 }}
                animate={{ y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 400, // Adjusted stiffness for a faster animation
                    damping: 11,   // Adjusted damping for a faster animation
                    mass: 0.5,
                    duration: 0.15,
                }}
                className={`note-box-two flex flex-col px-3 py-3 rounded-xl text-gray-800 bg-[${note.color}] 
                            ${deletedNotes[note._id] ? 'shrink' : ''} cursor-pointer shadow-lg dark:brightness-[85%]`} key={note._id}
                onClick={(e) => toTheNotePage(e, note._id)}
            >
                <div className='flex justify-start items-center gap-1.5 mb-2'>
                    <div className='sm:w-4 sm:h-4 w-5 h-5 rounded-full'>
                        <Image
                            src={`/assets/avatars/${note.user_avatar}.jpeg`} width={200} height={200}
                            className='rounded-full' />
                    </div>
                    <div className='truncate sm:text-xs text-sm w-[6.8rem] sm:w-[7.2rem]'>
                        {note.username}
                    </div>
                </div>
                <div className='truncate text-[1rem] sm:text-[0.95rem] font-bold'>
                    {note.title}
                </div>
                <div className='line-clamp-6 text-[0.9rem] mt-2 flex-grow' style={{ whiteSpace: 'pre-line' }}>
                    {note.content}
                </div>
                <div className='text-sm mt-2.5 flex justify-between items-center gap-2'>
                    <div className='flex justify-start items-center gap-1 text-sm'>
                        {note.likes < 1 ? <span></span> :
                            note.likes === 1 ? <span>{note.likes} like</span> :
                                <span>{note.likes} likes</span>}
                    </div>
                    <div className='text-sm flex items-center gap-2'>
                        <div>
                            {
                                liked ?
                                    <AiFillHeart
                                        className='text-red-500 font-bold transition ease-in-out duration-300 hover:scale-125 
                                        active:text-black text-2xl'
                                        onClick={(e) => toggleLikes(e, note._id, 'unlike')} /> :
                                    <AiOutlineHeart
                                        className='text-gray-600/80 font-bold transition ease-in-out duration-300 hover:scale-125 
                                        active:text-black text-2xl'
                                        onClick={(e) => toggleLikes(e, note._id, 'like')} />
                            }
                        </div>
                        <div>
                            <AiOutlineFileAdd
                                className='text-gray-600/80 font-bold transition ease-in-out duration-300 hover:scale-125 
                                        active:text-black text-xl' onClick={(e) => copyNote(e, note._id)} />
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    })

    return taskBoxes
}

export default FeedsNotes