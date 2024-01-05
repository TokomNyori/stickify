'use client'

import { addPage } from "@/redux_features/pages/pageSlice"
import { use, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useChat } from 'ai/react';
import { addResearchMessages, clearResearchMessages } from "@/redux_features/researchMessages/researchSlice";
import DisplayComp from "./DisplayComp";
import MarkdownContent from '../others/MarkdownContent';
import Image from 'next/image';
import ReseracherOne from '@/assets/researchers/researcher1.png';
import { IoSend } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import { FaRegCircleStop } from "react-icons/fa6";
import { CiStickyNote } from "react-icons/ci";
import { TbMessageCirclePlus } from "react-icons/tb";
import Lottie from 'lottie-react'
import orbOne from '@/assets/others/orb1.json'
import loader1 from '@/assets/others/Loader1.json'
import toast, { Toaster } from 'react-hot-toast';
import { set } from "lodash";
import { cy, is, te } from "date-fns/locale";
import ConfigPop from "./ConfigPop";
import { AiOutlineClear } from "react-icons/ai";
import CyraLoader from "./CyraLoader";
import ResearchModals from "./ResearchModals";
import { addResearchConfig, clearResearchConfig } from "@/redux_features/researchMessages/researchConfig";
import { setNoteModalConfig } from "@/redux_features/noteModalConfig/noteModalConfigSlice";

const ResearchPage = () => {

    const researchMessages = useSelector(state => state.researchMessages.researchMessages)
    const researchConfig = useSelector(state => state.researchConfig.researchConfig)
    const user = useSelector(state => state.user.users)
    const [cyraLoding, setCyraLoading] = useState(false)
    const [configPopState, setConfigPopState] = useState(false)
    const [cyraConfig, setCyraConfig] = useState(researchConfig)
    const [researchModalsState, setResearchModalsState] = useState(false)
    //const [showSavedAsNote, setShowSavedAsNote] = useState(false)

    const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput, setMessages } = useChat({
        initialMessages: researchMessages,
        onResponse: () => {
            setCyraLoading(false)
        },
        onError: () => {
            toast.error('Something went wrong!')
        },
        body: {
            configure: cyraConfig,
        },
    });

    const dispatch = useDispatch()
    const chatRef = useRef(null)
    const inputRef = useRef(null)
    const textareaRef = useRef(null)

    useEffect(() => {
        dispatch(addPage('research'))
    }, [])

    useEffect(() => {
        if (messages) {
            dispatch(addResearchMessages(messages))
        }
    }, [messages])

    useEffect(() => {
        dispatch(addResearchConfig(cyraConfig))
    }, [cyraConfig])

    useEffect(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isLoading])

    // useEffect(() => {
    //     if (chatRef.current && inputRef.current) {
    //         const chatRect = chatRef.current.getBoundingClientRect();
    //         const inputRect = inputRef.current.getBoundingClientRect();

    //         // Check if the bottom of the chat is near the top of the input
    //         if (chatRect.bottom >= inputRect.top - 80) { // 80 is a threshold, adjust as needed
    //             chatRef.current.scrollIntoView({ behavior: "smooth" });
    //         }
    //     }
    // }, [messages, isLoading]);

    useEffect(() => {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }, [input])

    useEffect(() => {
        if (Object.keys(user).length > 0) {
            setCyraConfig(prev => ({
                ...prev,
                username: user.username,
            }))
        }
    }, [user])

    function customHandleInput(event) {
        const { value } = event.target
        setInput(value)
    }

    function toggleConfigState() {
        setConfigPopState(!configPopState)
    }

    function toggleResearchModalsState() {
        setResearchModalsState(!researchModalsState)
    }

    function handleConfigChange(event) {
        const { name, value, type, checked } = event.target
        setCyraConfig(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    function creteNote() {
        toast.success('Note created!', {
            duration: 2000,
            position: 'top-center',
        });
    }

    function handleSubmitProcess(event) {
        handleSubmit(event)
        setCyraLoading(true)
        // if (textareaRef && textareaRef.current) {
        //     textareaRef.current.blur(); // This will close the virtual keyboard
        // }
    }

    function clearChat() {
        if (isLoading) {
            stop()
        }
        setMessages([])
        setCyraConfig({
            response: 'Balanced',
            username: user.username,
            emoji: true,
        })
        toggleResearchModalsState()
        toast.success('Chat cleared!', {
            icon: '🧹',
        })
    }

    function saveNote(content) {
        // Replace '**text**' with 'text' (removing the bold markdown)
        const unformattedContent = content.replace(/\*\*(.*?)\*\*/g, '$1');

        const objt = {
            title: '',
            status: 'others',
            color: '#FFFAD1',
            content: unformattedContent,
            isPrivate: false,
            userId: user._id,
            userAvatar: user.avatar,
            username: user.username,
            ytVideo: []
        }
        dispatch(setNoteModalConfig({ noteModalState: true, as: 'save', noteObject: objt }))
        console.log("CONTENT:")
        console.log(content)
    }

    function saveAsNoteUI(m, index) {
        if (m.role === 'assistant') {
            if (isLoading && index === messages.length - 1) {
                return null
            } else {
                return (
                    <div className="pl-[2.4rem] sm:pl-[2.5rem] cursor-pointer flex justify-start items-center gap-1 mt-2
                                        text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 w-fit"
                        onClick={() => saveNote(m.content)}>
                        <CiStickyNote className="text-[1.25rem]" />
                        <span className="text-sm">Add Note</span>
                    </div>
                )
            }
        }
    }

    // console.log("researchMessages:")
    // console.log(messages)


    return (
        <div className={`mt-8 relative px-4 sm:px-16 lg:px-72 flex flex-col justify-start items-start overflow-y-auto`}>
            {/* Chat UI */}
            <div className={`mb-20`}>
                {
                    messages.map((m, index) => (
                        <div
                            className="mb-8"
                            key={m.id}
                        >
                            <div>
                                {m.role === 'user' ?
                                    <div className="flex justify-start items-start rounded-full gap-3">
                                        <div>
                                            <Image
                                                className="rounded-full w-[1.6rem] sm:w-[1.8rem]"
                                                src={`/assets/avatars/${user.avatar}.jpeg`} width={40} height={40}
                                                alt="user avatar"
                                            />
                                        </div>
                                        <div className="font-bold text-[1.04rem]">You</div>
                                    </div>
                                    :
                                    <div className="flex justify-start items-start rounded-full gap-3">
                                        {/* <div>
                                            <Image className="rounded-full w-[1.8rem]"
                                                src={ReseracherOne} width={40} height={40}
                                                alt="researcher avatar"
                                            />
                                        </div> */}
                                        <div className="">
                                            <Lottie className="rounded-full w-[1.6rem] sm:w-[1.8rem]" animationData={orbOne} loop={true} />
                                        </div>
                                        <div className="font-bold text-[1.04rem]">Cyra</div>
                                    </div>
                                }
                            </div>

                            <div className="pl-[2.4rem] sm:pl-[2.5rem]"
                                style={{ whiteSpace: 'pre-line' }}
                            >
                                <MarkdownContent texts={m.content} />
                            </div>

                            {saveAsNoteUI(m, index)}
                        </div>
                    ))
                }
                {
                    cyraLoding &&
                    <CyraLoader />
                }
                <div ref={chatRef}></div>
            </div>


            {/* Input fixed to the bottom */}
            <div className="fixed bottom-0 w-[100%] left-0 right-0  bg-zinc-100 dark:bg-zinc-900" ref={inputRef}>
                <div className="px-3 sm:px-14 lg:px-64 mb-2.5">
                    {
                        messages.length === 0 &&
                        <DisplayComp
                            configPopState={configPopState}
                            toggleConfigState={toggleConfigState}
                            handleConfigChange={handleConfigChange}
                            cyraConfig={cyraConfig}
                        />
                    }
                    <div className="w-full">
                        <form
                            className="relative flex justify-center items-start"
                            onSubmit={handleSubmitProcess}>
                            <div className=" cursor-pointer">
                                <TbMessageCirclePlus className={`absolute left-4 text-3xl sm:text-2xl
                                bottom-[32%] sm:bottom-[35%] ${messages.length < 1 ? 'text-zinc-500' : ' text-blue-500'}`}
                                    onClick={messages.length > 0 && toggleResearchModalsState} />
                            </div>
                            <div className="chatbotTextarea w-full">
                                <textarea
                                    className={`chatbotTextarea1 w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-700 
                                            dark:border-zinc-200 rounded-2xl py-[0.9rem] sm:py-[0.8rem] px-14 sm:px-12 resize-none active:outline-none 
                                            focus:outline-none overflow-y-auto`}
                                    value={input}
                                    inputMode="text"
                                    type="text"
                                    name="input"
                                    rows={1}
                                    onChange={customHandleInput}
                                    placeholder="Message Cyra..."
                                    ref={textareaRef}
                                    onKeyDown={event => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            handleSubmitProcess(event)
                                            if (textareaRef && textareaRef.current) {
                                                textareaRef.current.blur(); // This will close the virtual keyboard
                                            }
                                        }
                                    }}
                                />
                            </div>
                            {
                                isLoading ?
                                    <div
                                        className="absolute right-4 bottom-[32%] sm:bottom-[35%] cursor-pointer"
                                        onClick={stop}
                                    >
                                        <FaRegCircleStop className={`text-3xl sm:text-2xl`} />
                                    </div>
                                    :
                                    <button
                                        disabled={!input}
                                        className="absolute right-4 bottom-[32%] sm:bottom-[35%]"
                                        type="submit">
                                        <IoSend className={`text-3xl sm:text-2xl ${input ? 'text-green-500' : 'text-zinc-500'}`} />
                                    </button>
                            }
                        </form>
                    </div>
                    {/* <div className="text-xs text-center">
                        Cyra can make mistakes. Consider checking important information.
                    </div> */}
                </div>
            </div>
            <ResearchModals researchModalsState={researchModalsState} action={clearChat} modalType={`Warning`}
                toggleresearchModalsState={toggleResearchModalsState} />
        </div >
    )
}

export default ResearchPage