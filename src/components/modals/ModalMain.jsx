'use client'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useRef, useState } from "react";
import { getNoteHelper, openAiPostHelper, postNoteHelper } from "@/helper/httpHelpers/httpNoteHelper";
import { useRouter } from "next/navigation";
import { Configuration, OpenAIApi } from "openai";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { AiOutlineCheck } from 'react-icons/ai'
import { AiOutlineClose } from 'react-icons/ai'
import { BsFillPinAngleFill } from 'react-icons/bs'
import { BsPin } from 'react-icons/bs'
import { BsPinFill } from 'react-icons/bs'
import { BiSolidSend } from 'react-icons/bi'
import scrollToTop from "@/helper/scrollToTop";
import GptSubmit from './GptSubmit';
import ClipLoader from "react-spinners/PacmanLoader";
import { useDispatch, useSelector } from 'react-redux';
import { addNote } from '@/redux_features/notes/noteSlice';

const ModalMain = ({ modalState, closeModal, userCookie }) => {
    //const userId = userCookie?._id
    const [pin, setPin] = useState(false)
    const [note, setNote] = useState({
        title: '',
        status: 'normal',
        color: '#fffaa4',
        content: '',
        userId: '',
    })
    const [isTitle, setIsTitle] = useState(true)
    const [gptSubmitModalState, setGptSubmitModalState] = useState(false)
    const [loading, setLoading] = useState(false)
    const [jsonText, setJsonText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    //const notes = useSelector(state => state.note.notes)
    const dispatch = useDispatch()
    const modalRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal()
            }
        };

        if (modalState) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [modalState]);

    useEffect(() => {
        if (pin) {
            setNote(prev => ({
                ...prev,
                status: 'pinned'
            }))
        } else {
            setNote(prev => ({
                ...prev,
                status: 'normal'
            }))
        }
    }, [pin])

    useEffect(() => {
        if (note.title) {
            setIsTitle(true)
        }
    }, [note])

    const router = useRouter()

    function changeNote(event) {
        const { name, value } = event.target
        setNote(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function changeNoteContentByGpt(content) {
        setNote(prev => ({
            ...prev,
            content: content
        }))
    }

    function pinIt() {
        setPin(prev => !prev)
    }

    async function submitForm(event) {
        try {
            event.preventDefault();
            setLoading(true)
            const result = await postNoteHelper({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: note })
            const notesRes = await getNoteHelper({ method: 'GET' })
            dispatch(addNote(notesRes.body.reverse()))
            setLoading(false)
            toast("Boom! Note's Ready!", {
                icon: '🔥📔'
            });
            clearForm(event)
            closeModal()
            //scrollToTop()
        } catch (error) {
            console.log(error)
            toast(`Could not save it!`, {
                icon: '🥺'
            });
        }
    }

    function clearForm(event) {
        event.preventDefault();
        setNote({
            title: '',
            status: 'normal',
            color: '#fffaa4',
            content: '',
            userId: ''
        })
    }

    function changeGptRequirementModal() {
        if (!note.title) {
            setIsTitle(false)
            toast('Please type something on the title', {
                icon: '😶'
            })
            return
        }
        setGptSubmitModalState(prev => !prev)
    }

    return (
        <div
            className={`modal-blur inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center
                        ${modalState ? "fix-modal" : "hidden"} flex-wrap`}>
            <div className={`modal-main rounded-lg shadow-lg ${`bg-[${note.color}]`} text-gray-700`} ref={modalRef} >
                <div className="modal-heading">
                    <div className="text-center ">Add Note</div>
                    <div className='close-btn cursor-pointer' onClick={pinIt}>
                        <BsPinFill className={`text-2xl mr-2 ${pin ? 'text-gray-700' : 'text-gray-500'}`} />
                    </div>
                </div>
                <form className="mt-6" onSubmit={submitForm}>
                    <div className={`text-sm text-red-400 ${isTitle ? 'hidden' : 'block'}`}>Please type something on the title</div>
                    <div className="flex justify-between items-center gap-4">
                        <div className="mb-4 flex-grow">
                            {/* <label htmlFor="note_title" className="block mb-2 text-sm font-medium">Title</label> */}
                            <input type="text" id="note_title" className="bg-gray-700 border-b border-gray-800/75 block w-full 
                                p-2.5 text-sm font-bold placeholder-gray-500 text-gray-700 focus:outline-none bg-transparent"
                                placeholder="Title..." value={note.title} name="title" onChange={changeNote} required />
                        </div>
                        <div className='text-xs  border border-gray-700 hover:border-gray-900 rounded-lg py-1 px-2 cursor-pointer'
                            onClick={changeGptRequirementModal}>
                            Generate <span><BiSolidSend className='inline' /></span>
                        </div>
                        {/* <div className="radio-inputs mb-4 sm:mt-2 flex gap-3">
                            <div>
                                <input type="radio" id="normal" name="status" className="mr-1" value="normal"
                                    onChange={changeNote} checked={note.status === 'normal'} />
                                <label htmlFor="normal"
                                    className="hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                                >Normal <TbNotes className='inline -mt-1 text-md' /></label>
                            </div>
                            <div>
                                <input type="radio" id="pin" name="status" className="mr-1" value="pinned"
                                    onChange={changeNote} checked={note.status === 'pinned'} />
                                <label htmlFor="pin"
                                    className="hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                                >Pin <BsFillPinAngleFill className='inline -mt-1' /></label>
                            </div>
                        </div> */}
                    </div>
                    <div className="radio-inputs mb-4 flex gap-3">
                        <div>
                            <input type="radio" id="color1" name="color" className="hidden note-radio-btn" value="#fffaa4"
                                onChange={changeNote} checked={note.color === '#fffaa4'} />
                            <label htmlFor="color1"
                                className="block color-input-label rounded-full bg-[#fffaa4] border border-gray-200
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            <input type="radio" id="color2" name="color" className="hidden note-radio-btn" value="#ffc8dd"
                                onChange={changeNote} checked={note.color === '#ffc8dd'} />
                            <label htmlFor="color2"
                                className="block color-input-label rounded-full bg-[#ffc8dd] border border-gray-200
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            <input type="radio" id="color3" name="color" className="hidden note-radio-btn" value="#fda98a"
                                onChange={changeNote} checked={note.color === '#fda98a'} />
                            <label htmlFor="color3"
                                className="block color-input-label rounded-full bg-[#fda98a] border border-gray-200
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            <input type="radio" id="color4" name="color" className="hidden note-radio-btn" value="#8ecae6"
                                onChange={changeNote} checked={note.color === '#8ecae6'} />
                            <label htmlFor="color4"
                                className="block color-input-label rounded-full bg-[#8ecae6] border border-gray-200
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            <input type="radio" id="color5" name="color" className="hidden note-radio-btn" value="#caffbf"
                                onChange={changeNote} checked={note.color === '#caffbf'} />
                            <label htmlFor="color5"
                                className="block color-input-label rounded-full bg-[#caffbf] border border-gray-200
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            <input type="radio" id="color6" name="color" className="hidden note-radio-btn" value="#f8f9fa"
                                onChange={changeNote} checked={note.color === '#f8f9fa'} />
                            <label htmlFor="color6"
                                className="block color-input-label rounded-full bg-[#f8f9fa] border border-gray-200
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                        <div>
                            <input type="radio" id="color7" name="color" className="hidden note-radio-btn" value="#c8b6ff"
                                onChange={changeNote} checked={note.color === '#c8b6ff'} />
                            <label htmlFor="color7"
                                className="block color-input-label rounded-full bg-[#c8b6ff] border border-gray-200
                                hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
                            ></label>
                        </div>
                    </div>

                    <div className="mb-4">
                        {/* <label htmlFor="note_content" className="block mb-2 text-sm font-medium">Content</label> */}
                        <textarea type="text" id="note_content" className="rounded-lg bg-transparent border-gray-600 block 
                                p-2.5 w-full text-sm placeholder-gray-500 text-gray-700 focus:outline-none
                                min-h-full" rows={10} placeholder="Type your content here..."
                            value={note.content} name="content" onChange={changeNote} required />
                    </div>
                    <div className="flex items-end justify-center">
                        <button
                            className="border border-gray-800 focus:outline-none font-medium rounded-full text-sm px-2
                                    py-2 mr-2 mb-2 bg-transparent text-whiteborder-gray-600  hover:bg-green-400/75
                                    focus:ring-gray-700"
                            type="submit"
                        >
                            <AiOutlineCheck className='font-bold text-lg' />
                        </button>
                        <button
                            className="border border-gray-800 focus:outline-none font-medium rounded-full text-sm px-2 
                                    py-2 mr-2 mb-2 bg-transparent text-whiteborder-gray-600  hover:bg-red-400/75
                                  focus:ring-gray-700 ms-2"
                            type='button'
                            onClick={closeModal}
                        >
                            <AiOutlineClose className='font-bold text-lg' />
                        </button>
                    </div>
                </form>
                <GptSubmit
                    gptSubmitModalState={gptSubmitModalState} noteFromMainModal={note}
                    changeGptRequirementModal={changeGptRequirementModal} changeNoteContentByGpt={changeNoteContentByGpt} />
            </div>
            {loading &&
                <div
                    className={`loader-gpt absolute inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center 
                                items-center flex-wrap`}>
                    <ClipLoader
                        color='#e2e8f0'
                        loading='Generating...'
                        //cssOverride={override}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                </div>

            }
        </div>
    )
}

export default ModalMain