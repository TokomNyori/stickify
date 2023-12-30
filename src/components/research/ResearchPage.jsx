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

const ResearchPage = () => {

    const researchMessages = useSelector(state => state.researchMessages.researchMessages)
    const user = useSelector(state => state.user.users)
    const [responded, setResponded] = useState(false)

    const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput } = useChat({
        initialMessages: researchMessages,
        onResponse: () => {
            if (!responded) {
                setResponded(true)
            }
        }
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

    // useEffect(() => {
    //     if (isLoading) {
    //         const chaty = chatRef.current;
    //         if (chaty) {
    //             chaty.scrollTop = chaty.scrollHeight;
    //         }
    //     }
    // }, [messages]);

    useEffect(() => {
        chatRef.current?.scrollIntoView()
    }, [messages])

    useEffect(() => {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }, [input])

    function hi(event) {
        const { value } = event.target
        setInput(value)
    }

    console.log(input)


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
                                    <div className="flex justify-start items-start rounded-full gap-2 sm:gap-3">
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
                                    <div className="flex justify-start items-start rounded-full gap-2 sm:gap-3">
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

                            <div className="pl-[2.25rem] sm:pl-[2.5rem]"
                                style={{ whiteSpace: 'pre-line' }}
                            >
                                <MarkdownContent texts={m.content} />
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
                        <DisplayComp />
                    }
                    <div className="w-full">
                        <form
                            className="relative flex justify-center items-start"
                            onSubmit={handleSubmit}>
                            <div className=" cursor-pointer">
                                <LuSettings2 className="absolute left-4 bottom-[35%] text-2xl text-zinc-600 dark:text-zinc-300" />
                            </div>
                            <div className="chatbotTextarea w-full">
                                <textarea
                                    className={`chatbotTextarea1 w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-700 
                                            dark:border-zinc-300 rounded-2xl py-[0.8rem] px-12 resize-none active:outline-none 
                                            focus:outline-none overflow-y-auto`}
                                    value={input}
                                    type="text"
                                    name="input"
                                    rows={1}
                                    onChange={hi}
                                    placeholder="Message Cyra..."
                                    ref={textareaRef}
                                />
                            </div>
                            {
                                isLoading ?
                                    <div
                                        className="absolute right-4 bottom-[35%] cursor-pointer"
                                        onClick={stop}
                                    >
                                        <FaRegCircleStop className={`text-2xl`} />
                                    </div>
                                    :
                                    <button
                                        disabled={!input}
                                        className="absolute right-4 bottom-[35%]"
                                        type="submit">
                                        <IoSend className={`text-2xl ${input ? 'text-green-500' : 'text-zinc-500'}`} />
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