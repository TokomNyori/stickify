'use client'
import { openAiPostHelper } from "@/helper/httpHelpers/httpNoteHelper";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlineRollback } from 'react-icons/ai'
import { RiSpeakLine } from 'react-icons/ri'

const PopUp2 =
    ({ closeRephrasePopUp, rephrasePopUp, content, changeRephrasedNote, rephrasedNote,
        setLoadingRephraserFun, changeIsRepCnt, isRephrasedNote }) => {

        const [isDefault, setIsDefault] = useState(true)
        const rephrasePopUpRef = useRef(null);

        useEffect(() => {
            const handleOutsideClick = (event) => {
                if (rephrasePopUpRef.current && !rephrasePopUpRef.current.contains(event.target)) {
                    closeRephrasePopUp(false)
                }
            };

            if (rephrasePopUp) {
                document.addEventListener('click', handleOutsideClick);
            }

            return () => {
                document.removeEventListener('click', handleOutsideClick);
            };
        }, [rephrasePopUp]);

        // Rephrase function
        async function rephraseContentFun(event, tone) {
            event.stopPropagation()
            const ctx = isRephrasedNote ? rephrasedNote.content : content

            const instruction = `Your role is to rephrase the given content to a different tone. Rephrase the content in a ${tone} tone. The content is: ${ctx}`
            const enhanceInstruction = `You will be provided with content, and your task is to convert the content to standard English. The content is: ${ctx}`
            const gptData = {
                //gpt-4-1106-preview  
                //gpt-3.5-turbo-1106
                model: 'gpt-3.5-turbo-1106',
                temperature: 0.7,
                max_tokens: 2000,
                messages: [
                    {
                        'role': 'system',
                        'content': tone === 'enhance' ? 'You will be provided with content, and your task is to convert the content to standard english.' : 'You are a rephrasing assistant.',
                    },
                    {
                        'role': 'user',
                        'content': tone === 'enhance' ? enhanceInstruction : instruction,
                    },
                ]
            }
            console.log(gptData)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
            }
            try {
                setLoadingRephraserFun(true)
                const res = await openAiPostHelper({ method: 'POST', headers: headers, body: gptData })
                changeRephrasedNote('rephrase', res.choices[0].message.content)
                changeIsRepCnt(true)
                setLoadingRephraserFun(false)
                if (tone === 'enhance') {
                    toast(`Enhanced!`, {
                        icon: '✨'
                    })
                } else {
                    toast(`Rephrased to ${tone}!`, {
                        icon: '🪄'
                    })
                }
                setIsDefault(false)
            } catch (error) {
                setLoadingRephraserFun(false)
                toast(error.message, {
                    icon: '😔'
                })
            }
        }

        function undoRephraseContentFun(event) {
            event.preventDefault()
            changeRephrasedNote('default', content)
            changeIsRepCnt(false)
            setTimeout(() => {
                setIsDefault(true)
            }, 100);
            toast('Back to the original', {
                icon: '😀'
            })
        }

        return (
            <div
                className={`${rephrasePopUp ? 'PopUps2' : 'hidden w-0 h-0'} bg-gray-800/70 text-gray-100
                        absolute ai-rephrase-options border border-gray-100`}
                ref={rephrasePopUpRef}
            >
                {
                    !isDefault ?
                        <div className="border-b py-0.5">
                            <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out 
                            flex items-center gap-1 rephrase-default-btn"
                                onClick={(event) => undoRephraseContentFun(event)}>
                                <span >Default</span>
                                <span><AiOutlineRollback className="inline text-bold text-lg mb-1" /></span>
                            </div>
                        </div>
                        :
                        <div className="border-b py-0.5 flex items-center gap-1">
                            <span >Select Tone</span>
                            <span><RiSpeakLine className="inline text-bold text-lg mb-1" /></span>
                        </div>

                }
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5"
                    onClick={(event) => rephraseContentFun(event, 'enhance')}
                >
                    Enhance ✨
                </div>
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5"
                    onClick={(event) => rephraseContentFun(event, 'professional')}
                >
                    Professional 🤵
                </div>
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5"
                    onClick={(event) => rephraseContentFun(event, 'casual')}
                >
                    Casual 😎
                </div>
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5"
                    onClick={(event) => rephraseContentFun(event, 'confident')}
                >
                    Confident 💪
                </div>
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5"
                    onClick={(event) => rephraseContentFun(event, 'formal')}
                >
                    Formal 📚
                </div>
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out"
                    onClick={(event) => rephraseContentFun(event, 'friendly')}
                >
                    Friendly 😊
                </div>
            </div>
        )
    }

export default PopUp2