'use client'
import { MdDeleteOutline } from 'react-icons/md'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { HiMiniViewfinderCircle } from 'react-icons/hi2'
import { AiOutlineHeart } from 'react-icons/ai'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { IoAddOutline } from "react-icons/io5";
import Image from 'next/image'

const Notes = ({ notes, container, deleteNotes, deletedNotes }) => {
    const taskBoxes = notes?.map(note => {
        const random = Math.random();
        const sign = Math.random() < 0.5 ? -1 : 1;
        const rotation = random > 0.6 ? (Math.random() * (1.5 - 1.2) + 1.2).toFixed(1) * sign : 0
        //style={{ transform: `rotate(${rotation}deg)` }}
        return (
            <div
                className={`note-box flex flex-col px-3 py-3 rounded-lg text-gray-700/75 bg-[${note.color}] 
                            ${deletedNotes[note._id] ? 'shrink' : ''} cursor-pointer`}
                             key={note._id}>
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
                            <div>
                                <AiOutlineHeart
                                    className='text-gray-600/70 transition ease-in-out duration-300 hover:scale-125 active:text-red-400' />
                            </div>
                            <div onClick={() => deleteNotes(note._id)}>
                                <MdDeleteOutline
                                    className=' text-gray-600/70 font-light transition ease-in-out duration-300 hover:scale-125 active:text-black' />
                            </div>
                            <div>
                                <MdOutlineModeEditOutline
                                    className='text-gray-600/70 font-light transition ease-in-out duration-300 hover:scale-125 active:text-black' />
                            </div>
                            <div>
                                <HiMiniViewfinderCircle
                                    className='text-gray-600/70 transition ease-in-out duration-300 hover:scale-125 active:text-black' />
                            </div>
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
                                <div>
                                    <HiMiniViewfinderCircle
                                        className='text-gray-600/70 transition ease-in-out duration-300 hover:scale-125 active:text-black' />
                                </div>
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