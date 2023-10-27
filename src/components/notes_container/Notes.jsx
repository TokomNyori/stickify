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

const Notes = ({ notes, container, deleteNotes, deletedNotes, noteType, togglePinned }) => {

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
        const random = Math.random();
        const sign = Math.random() < 0.5 ? -1 : 1;
        const rotation = random > 0.6 ? (Math.random() * (1.5 - 1.2) + 1.2).toFixed(1) * sign : 0
        //style={{ transform: `rotate(${rotation}deg)` }}
        const router = useRouter()

        return (
            <div
                className={`note-box flex flex-col px-3 py-3 rounded-lg border-2 border-white text-gray-700 bg-[${note.color}] 
                            ${deletedNotes[note._id] ? 'shrink' : ''} cursor-pointer shadow-md dark:brightness-[85%]`} key={note._id}
                onClick={(e) => toTheNotePage(e, note._id)}
            >
                <div className='truncate text-sm font-bold'>
                    {note.title}
                </div>
                <div className='line-clamp-6 text-[0.8rem] mt-2 flex-grow' style={{ whiteSpace: 'pre-line' }}>
                    {note.content}
                </div>
                {
                    container === 'noteContainer' ?
                        // For Note Container
                        <div className='text-sm mt-4 flex justify-end items-center gap-2'>
                            {
                                noteType === 'pinned' ?
                                    <div onClick={(e) => togglePinned(e, note._id, 'remove')} >
                                        <BsPinAngleFill
                                            className='text-gray-700 transition ease-in-out duration-300 hover:scale-125 
                                            active:text-black' />
                                    </div> :
                                    <div onClick={(e) => togglePinned(e, note._id, 'add')}>
                                        <BsPinAngle
                                            className='text-gray-600/70 transition ease-in-out duration-300 hover:scale-125 
                                            active:text-black' />
                                    </div>
                            }
                            <div onClick={(e) => deleteNotes(e, note._id)}>
                                <MdDeleteOutline
                                    className=' text-gray-700/70 font-light transition ease-in-out duration-300 hover:scale-125 
                                    active:text-black' />
                            </div>
                            <div onClick={(e) => editNote(e, note._id)}>
                                <MdOutlineModeEditOutline
                                    className='text-gray-600/70 font-light transition ease-in-out duration-300 hover:scale-125 
                                    active:text-black' />
                            </div>
                            {/* <div onClick={(e) => toTheNotePage(e, note._id)}>
                                <HiMiniViewfinderCircle
                                    className='text-gray-600/70 transition ease-in-out duration-300 hover:scale-125 
                                    active:text-black' />
                            </div> */}
                        </div>
                        :
                        // For Global Container
                        <div className='text-sm mt-4 flex justify-between items-center gap-2'>
                            <div className='flex justify-start items-center gap-1'>
                                <div className='w-4 h-4 rounded-full'>
                                    <Image
                                        src={`/assets/avatars/${note.user_avatar}.jpeg`} width={200} height={200}
                                        className='rounded-full' />
                                </div>
                                <div className='truncate text-xs w-[5.3rem] sm:w-[5.4rem]'>
                                    {note.username}
                                </div>
                            </div>
                            <div className='text-sm flex items-center gap-2'>
                                {/* <div>
                                    <HiMiniViewfinderCircle
                                        className='text-gray-600/70 transition ease-in-out duration-300 hover:scale-125 
                                        active:text-black' />
                                </div> */}
                                <div>
                                    <AiOutlineFileAdd
                                        className='text-gray-600/70 font-bold transition ease-in-out duration-300 hover:scale-125 
                                        active:text-black text-md' />
                                </div>
                            </div>

                        </div>
                }
            </div>
        )
    })

    return taskBoxes
}

export default Notes