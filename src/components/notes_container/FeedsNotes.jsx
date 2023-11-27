'use client'
import { AiOutlineHeart } from 'react-icons/ai'
import { AiFillHeart } from 'react-icons/ai'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { FaRegCopy } from "react-icons/fa6";
import { FaCopy } from "react-icons/fa6";
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { addCurrentNotePage } from '@/redux_features/currentNotePage/currentNotePageSlice'
import { setNoteModalConfig } from '@/redux_features/noteModalConfig/noteModalConfigSlice'
import { useEffect, useState } from 'react'
import { postNoteHelper } from '@/helper/httpHelpers/httpNoteHelper'
import Typewriter from 'typewriter-effect'
import {
    formatDistanceToNowStrict, differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks,
    isValid, differenceInYears, format
} from 'date-fns';

const FeedsNotes = ({ notes, deletedNotes, toggleLikes, user, copyNote }) => {

    const dispatch = useDispatch()
    const router = useRouter()

    function toTheNotePage(e, id) {
        e.stopPropagation()
        const clickedNote = notes.filter(note => note._id === id)
        dispatch(addCurrentNotePage(clickedNote[0]))
        router.push(`/${id}`)
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        if (!isValid(date)) {
            console.error('Invalid date:', dateString);
            return '';
        }
        const now = new Date();
        const diffInMinutes = differenceInMinutes(now, date);
        const diffInHours = differenceInHours(now, date);
        const diffInDays = differenceInDays(now, date);
        const diffInWeeks = differenceInWeeks(now, date);
        const diffInYears = differenceInYears(now, date);

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'}`;
        if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hr' : 'hrs'}`;
        if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'}`;
        if (diffInWeeks < 5) return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'}`;
        if (now.getFullYear() === date.getFullYear()) return format(date, 'd MMM'); // return the date in "d MMM" format for current year
        return format(date, 'MMM yyyy'); // return the date in "MMM yyyy" format for different years
    }

    const taskBoxes = notes?.map(note => {

        const liked = note.likedBy.some(like => like === user._id);
        const copied = note.copiedBy.some(copy => copy === user._id);
        const dateTimeFormat = formatDate(note.coreUpdated)
        //console.log(dateTimeFormat)

        return (
            <div
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
                    <Typewriter
                        onInit={(typewritter) => {
                            typewritter.typeString(note.content).start()
                        }}
                        options={{
                            delay: 25,
                        }}
                    />
                </div>
                <div className='text-sm mt-2.5 flex justify-between items-center gap-3'>
                    <div className='flex justify-start items-center text-sm'>
                        {dateTimeFormat}
                    </div>
                    <div className='flex justify-end items-center gap-3'>
                        {
                            liked ?
                                <div className='flex justify-center items-center gap-0.5'>
                                    <AiFillHeart
                                        className='text-red-500 font-bold transition ease-in-out duration-300 hover:scale-125 
                                        active:text-black text-2xl'
                                        onClick={(e) => toggleLikes(e, note._id, 'unlike', note.likes)}
                                    />
                                    {
                                        note.likes < 1 ? <sub></sub> :
                                            <sub className='text-sm text-gray-700/80'>
                                                {note.likes}
                                            </sub>
                                    }
                                </div>

                                :
                                <div className='flex justify-center items-center gap-0.5'>
                                    <AiOutlineHeart
                                        className='text-gray-700/80 font-bold transition ease-in-out duration-300 hover:scale-125 
                                        active:text-black text-2xl'
                                        onClick={(e) => toggleLikes(e, note._id, 'like', note.likes)}
                                    />
                                    {
                                        note.likes < 1 ? <sub></sub> :
                                            <sub className='text-sm text-gray-700/80'>
                                                {note.likes}
                                            </sub>
                                    }
                                </div>
                        }
                        {
                            copied ?
                                <div className='flex justify-center items-center gap-0.5'>
                                    <FaCopy
                                        className='text-gray-600 font-bold transition ease-in-out duration-300 hover:scale-125 
                                        active:text-black text-[1.21rem]' onClick={(e) => copyNote(e, note._id, 'remove', note.copies)} />
                                    {
                                        note.copies < 1 ? <sub></sub> :
                                            <sub className='text-sm text-gray-700/80'>
                                                {note.copies}
                                            </sub>
                                    }
                                </div>
                                :
                                <div className='flex justify-center items-center gap-0.5'>
                                    <FaRegCopy
                                        className='text-gray-700/80 font-bold transition ease-in-out duration-300 hover:scale-125 
                                        active:text-black text-[1.21rem]' onClick={(e) => copyNote(e, note._id, 'copy', note.copies)} />
                                    {
                                        note.copies < 1 ? <sub></sub> :
                                            <sub className='text-sm text-gray-700/80'>
                                                {note.copies}
                                            </sub>
                                    }
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    })

    return taskBoxes
}

export default FeedsNotes