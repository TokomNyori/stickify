'use client'
import { MdDeleteOutline } from 'react-icons/md'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { HiMiniViewfinderCircle } from 'react-icons/hi2'
import { BsPinAngle } from "react-icons/bs"
import { BsPinAngleFill } from "react-icons/bs"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { addCurrentNotePage } from '@/redux_features/currentNotePage/currentNotePageSlice'
import { setNoteModalConfig } from '@/redux_features/noteModalConfig/noteModalConfigSlice'
import ClipLoader from "react-spinners/PacmanLoader";
import { useState } from 'react'
import { motion } from "framer-motion"
import Typewriter from 'typewriter-effect'

const Notes = ({ notes, deleteNotes, deletedNotes, noteType, togglePinned, initialRender }) => {
    const [nextPage, setNextPage] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()

    function toTheNotePage(e, id) {
        e.stopPropagation()
        const clickedNote = notes.filter(note => note._id === id)
        dispatch(addCurrentNotePage(clickedNote[0]))
        setNextPage(true)
        router.push(`/${id}`)
    }

    function editNote(e, noteid) {
        e.stopPropagation()
        const clickedNote = notes.filter(note => note._id === noteid)[0]
        dispatch(setNoteModalConfig({ noteModalState: true, as: 'edit', noteObject: clickedNote }))
    }

    const taskBoxes = notes?.map(note => {

        return (
            <motion.div
                className={`note-box flex flex-col px-3 py-3 rounded-xl 
                text-gray-800 bg-[${note.color}] 
                ${deletedNotes[note._id] ? 'shrink' : ''} cursor-pointer shadow-lg dark:brightness-[85%]`} key={note._id}
                onClick={(e) => toTheNotePage(e, note._id)}
            >
                <div className='truncate text-[1rem] sm:text-[0.95rem] font-bold'>
                    {note.title}
                </div>
                <div className='note-content-line-clamp text-[0.9rem] mt-2 flex-grow'
                    style={{ whiteSpace: 'pre-line' }}>
                    {
                        initialRender ?
                            <Typewriter
                                onInit={(typewritter) => {
                                    typewritter.typeString(note.content).start()
                                }}
                                options={{
                                    delay: 50,
                                }}
                            />
                            :
                            note.content
                    }
                </div>
                <div className='text-sm mt-5 flex justify-between items-center gap-2'>
                    {
                        note.isPrivate ?
                            <div className='flex justify-start items-center gap-1 text-sm'>
                                Private
                            </div>
                            :
                            <div className='flex justify-start items-center gap-1 text-sm'>
                                {note.likes < 1 ? <span></span> :
                                    note.likes === 1 ? <span>{note.likes} like</span> :
                                        <span>{note.likes} likes</span>}
                            </div>
                    }
                    <div className='text-sm flex items-center gap-2 '>
                        {
                            noteType === 'pinned' ?
                                <div onClick={(e) => togglePinned(e, note._id, 'remove')} >
                                    <BsPinAngleFill
                                        className='text-gray-700 transition ease-in-out duration-300 hover:scale-125 
                                            active:text-black text-xl' />
                                </div> :
                                <div onClick={(e) => togglePinned(e, note._id, 'add')}>
                                    <BsPinAngle
                                        className='text-gray-600/90 transition ease-in-out duration-300 hover:scale-125 
                                            active:text-black text-xl' />
                                </div>
                        }
                        <div onClick={(e) => deleteNotes(e, note._id)}>
                            <MdDeleteOutline
                                className=' text-gray-700/80 font-light transition ease-in-out duration-300 hover:scale-125 
                                    active:text-black text-xl' />
                        </div>
                        <div onClick={(e) => editNote(e, note._id)}>
                            <MdOutlineModeEditOutline
                                className='text-gray-600/80 font-light transition ease-in-out duration-300 hover:scale-125 
                                    active:text-black text-xl' />
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    })

    return taskBoxes
}

export default Notes