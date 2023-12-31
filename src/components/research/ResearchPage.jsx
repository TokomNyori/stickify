'use client'

import { addPage } from "@/redux_features/pages/pageSlice"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useChat } from 'ai/react';
import { addResearchMessages } from "@/redux_features/researchMessages/researchSlice";
import DisplayComp from "./DisplayComp";
import MarkdownContent from '../others/MarkdownContent';
import Image from 'next/image';
import ReseracherOne from '@/assets/researchers/researcher1.png';
import { IoSend } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import { FaRegCircleStop } from "react-icons/fa6";
import Lottie from 'lottie-react'
import orbOne from '@/assets/others/orb1.json'
import toast, { Toaster } from 'react-hot-toast';
import { set } from "lodash";
import PromptCards from "./PromptCards";
import { te } from "date-fns/locale";
import ConfigPop from "./ConfigPop";
import { AiOutlineClear } from "react-icons/ai";

const ResearchPage = () => {

    const researchMessages = useSelector(state => state.researchMessages.researchMessages)
    const user = useSelector(state => state.user.users)
    const [responded, setResponded] = useState(false)
    const [configPopState, setConfigPopState] = useState(false)
    const [cyraConfig, setCyraConfig] = useState({
        response: 'Balance',
        emoji: true,
    })

    const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput } = useChat({
        initialMessages: researchMessages,
        onResponse: () => {
            if (!responded) {
                setResponded(true)
            }
        },
        body: {
            configure: cyraConfig,
        },
    });

    const dispatch = useDispatch()
    const chatRef = useRef(null)
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
        chatRef.current?.scrollIntoView()
    }, [messages])

    useEffect(() => {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }, [input])

    function customHandleInput(event) {
        const { value } = event.target
        setInput(value)
    }

    function toggleConfigState() {
        setConfigPopState(!configPopState)
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

    //console.log(cyraConfig)


    return (
        <div className={`mt-8 relative px-4 sm:px-16 lg:px-72 flex flex-col justify-start items-start`}>
            {/* Chat UI */}
            <div className={`mb-20`}>
                {
                    messages.map(m => (
                        <div
                            className="mb-7"
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

                            <div className=" pl-[2.4rem] sm:pl-[2.5rem]"
                                style={{ whiteSpace: 'pre-line' }}
                            >
                                <MarkdownContent texts={m.content} />
                                {
                                    m.role === 'assistant' &&
                                    <div className="mt-1 text-xs">
                                        Save as note
                                    </div>
                                }
                            </div>
                        </div>
                    ))
                }
                <div ref={chatRef}></div>
            </div>


            {/* Input fixed to the bottom */}
            <div className="fixed bottom-0 w-[100%] left-0 right-0  bg-zinc-100 dark:bg-zinc-900">
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
                            onSubmit={handleSubmit}>
                            <div className=" cursor-pointer">
                                <AiOutlineClear className={`absolute left-4 text-3xl sm:text-2xl
                                bottom-[32%] sm:bottom-[35%] ${messages.length < 1 ? 'text-zinc-500' : ' text-zinc-600 dark:text-zinc-300'}`}
                                    onClick={messages.length > 0 && toggleConfigState} />
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
                                            handleSubmit(event)
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
        </div >
    )
}

export default ResearchPage