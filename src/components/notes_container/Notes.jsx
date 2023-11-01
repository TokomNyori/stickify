'use client'
import { MdDeleteOutline } from 'react-icons/md'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { HiMiniViewfinderCircle } from 'react-icons/hi2'
import { AiOutlineHeart } from 'react-icons/ai'
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

const Notes = ({ notes, deleteNotes, deletedNotes, noteType, togglePinned }) => {

    const dispatch = useDispatch()
    const router = useRouter()

    function toTheNotePage(e, id) {
        e.stopPropagation()
        const clickedNote = notes.filter(note => note._id === id)
        dispatch(addCurrentNotePage(clickedNote[0]))
        router.push(`/${id}`)
    }

    function editNote(e, noteid) {
        e.stopPropagation()
        const clickedNote = notes.filter(note => note._id === noteid)[0]
        dispatch(setNoteModalConfig({ noteModalState: true, as: 'edit', noteObject: clickedNote }))
    }

    const taskBoxes = notes?.map(note => {

        return (
            <div
                className={`note-box flex flex-col px-3 py-3 rounded-lg border-2 border-white text-gray-700 bg-[${note.color}] 
                            ${deletedNotes[note._id] ? 'shrink' : ''} cursor-pointer shadow-md dark:brightness-[85%]`} key={note._id}
                onClick={(e) => toTheNotePage(e, note._id)}
            >
                <div className='truncate text-[1rem] sm:text-sm font-bold'>
                    {note.title}
                </div>
                <div className='line-clamp-6 text-[0.9rem] sm:text-[0.8rem] mt-2 flex-grow' style={{ whiteSpace: 'pre-line' }}>
                    {note.content}
                </div>
                <div className='text-sm sm:mt-4 mt-5 flex justify-between items-center gap-2'>
                    {
                        note.isPrivate ?
                            <div className='flex justify-start items-center gap-1 sm:text-xs text-sm'>
                                Private
                            </div>
                            :
                            <div className='flex justify-start items-center gap-1 text-xs'>
                                {note.likes < 1 ? <span></span> :
                                    note.likes === 1 ? <span>{note.likes} like</span> :
                                        <span>{note.likes} likes</span>}
                            </div>
                    }
                    <div className='text-sm flex items-center gap-2'>
                        {
                            noteType === 'pinned' ?
                                <div onClick={(e) => togglePinned(e, note._id, 'remove')} >
                                    <BsPinAngleFill
                                        className='text-gray-700 transition ease-in-out duration-300 hover:scale-125 
                                            active:text-black text-lg sm:text-sm' />
                                </div> :
                                <div onClick={(e) => togglePinned(e, note._id, 'add')}>
                                    <BsPinAngle
                                        className='text-gray-600/70 transition ease-in-out duration-300 hover:scale-125 
                                            active:text-black text-lg sm:text-sm' />
                                </div>
                        }
                        <div onClick={(e) => deleteNotes(e, note._id)}>
                            <MdDeleteOutline
                                className=' text-gray-700/70 font-light transition ease-in-out duration-300 hover:scale-125 
                                    active:text-black text-lg sm:text-sm' />
                        </div>
                        <div onClick={(e) => editNote(e, note._id)}>
                            <MdOutlineModeEditOutline
                                className='text-gray-600/70 font-light transition ease-in-out duration-300 hover:scale-125 
                                    active:text-black text-lg sm:text-sm' />
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return taskBoxes
}

export default Notes