'use client'
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlineRollback } from 'react-icons/ai'
import { RiSpeakLine } from 'react-icons/ri'
import { useCompletion } from 'ai/react'
import { set } from "date-fns/fp";

const PopUp2 =
    ({ closeRephrasePopUp, rephrasePopUp, content, changeRephrasedNote, rephrasedNote, changeStreamGptLoader,
        setLoadingRephraserFun, changeIsRepCnt, isRephrasedNote, isDefault, rephraseDefaultTrue, rephraseDefaultFalse,
        stopStreaming, setStopSreamingVal }) => {

        const [rephraseData, setRephraseData] = useState({})
        //const [rephraseTone, setRephraseTone] = useState('')
        let rephraseTone = ''

        const rephrasePopUpRef = useRef(null);
        const submitButtonRef = useRef(null);
        const formRef = useRef(null);

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


        const {
            completion,
            input,
            stop,
            isLoading,
            handleInputChange,
            handleSubmit,
            complete,
        } = useCompletion({
            api: '/api/completion-rephrase',
            body: {
                geyi: rephraseData,
            },
            initialInput: 'Hello world!',
            onError: (error) => {
                console.log(error)
                changeStreamGptLoader(false)
                if (rephraseTone === 'enhance') {
                    toast('Sorry, could not enhance', {
                        icon: '🥺'
                    })
                } else {
                    toast('Sorry, could not rephrase', {
                        icon: '🥺'
                    })
                }
            },
            onResponse: (res) => {
                console.log(res)
            },
            onFinish: () => {
                if (rephraseTone === 'enhance') {
                    toast(`Enhanced!`, {
                        icon: '✨'
                    })
                } else {
                    toast(`Rephrased to ${rephraseTone}!`, {
                        icon: '🪄'
                    })
                }
            },
        });

        useEffect(() => {
            if (completion) {
                changeRephrasedNote('rephrase', completion)
                changeIsRepCnt(true)
                rephraseDefaultFalse()
            }
        }, [completion])

        useEffect(() => {
            if (isLoading) {
                changeStreamGptLoader(true)
            } else {
                changeStreamGptLoader(false)
            }

            if (rephrasePopUp) {
                closeRephrasePopUp(false)
            }
        }, [isLoading])

        useEffect(() => {
            if (stopStreaming) {
                stop()
                setStopSreamingVal(false)
            }
        }, [stopStreaming])

        // Rephrase function
        //gpt-4-1106-preview 
        //gpt-3.5-turbo-1106
        function rephraseContentFun(event, tone) {
            event.stopPropagation()
            const ctx = isRephrasedNote ? rephrasedNote.content : content

            const instruction = `Rephrase the following content to embody a ${tone} tone, adjusting the style and vocabulary to fit this tone while retaining the original meaning. Ensure the rephrased content is coherent and fluid. Maintain the markdown formatting if there are any. Original content: ${ctx}`
            const enhanceInstruction = `Enhance the provided content to align with standard English. Focus on correcting grammatical errors, improving sentence structure, and ensuring clarity of expression. Maintain the markdown formatting if there are any. Original content: ${ctx}`
            const systemContentGrammar = 'Your task is to refine the provided content to standard English. This includes correcting grammatical errors, clarifying ambiguous statements, and improving overall readability.';
            const systemContentRephrase = 'You are to rephrase the provided content to match a specific tone. Adjust the style, vocabulary, and structure to reflect the designated tone, while maintaining the original message.';
            const gptData = {
                model: 'gemini-1.5-pro',
                temperature: 1,
                max_tokens: 4000,
                stream: true,
                messages: [
                    {
                        'role': 'system',
                        'content': tone === 'enhance' ? systemContentGrammar : systemContentRephrase,
                    },
                    {
                        'role': 'user',
                        'content': tone === 'enhance' ? enhanceInstruction : instruction,
                    },
                ]
            }

            setRephraseData(gptData)
            rephraseTone = tone
            //setRephraseTone(tone)
            setTimeout(() => {
                handleSubmit(event)
            }, 20);

            // const headers = {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
            // }
            // try {
            //     setLoadingRephraserFun(true)
            //     const res = await openAiGptTextGeneration({ gptData: gptData })
            //     changeRephrasedNote('rephrase', res.choices[0].message.content)
            //     changeIsRepCnt(true)
            //     setLoadingRephraserFun(false)
            //     if (tone === 'enhance') {
            //         toast(`Enhanced!`, {
            //             icon: '✨'
            //         })
            //     } else {
            //         toast(`Rephrased to ${tone}!`, {
            //             icon: '🪄'
            //         })
            //     }
            //     rephraseDefaultFalse()
            // } catch (error) {
            //     setLoadingRephraserFun(false)
            //     toast(error.message, {
            //         icon: '😔'
            //     })
            // }
        }

        function undoRephraseContentFun(event) {
            event.preventDefault()
            changeRephrasedNote('default', content)
            changeIsRepCnt(false)
            setTimeout(() => {
                rephraseDefaultTrue()
                closeRephrasePopUp(false)
            }, 100);
            toast('Back to the original', {
                icon: '😀'
            })
        }

        console.log(completion)


        return (
            <div
                className={`${rephrasePopUp ? 'PopUps2' : 'hidden w-0 h-0'} 
                        border-[1.5px] border-gray-800 backdrop-blur-[10px] font-semibold`}
                ref={rephrasePopUpRef}
            >
                {
                    !isDefault ?
                        <div className="border-b py-0.5 border-gray-800">
                            <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out 
                            flex items-center gap-1 rephrase-default-btn"
                                onClick={(event) => undoRephraseContentFun(event)}>
                                <span >Default</span>
                                <span><AiOutlineRollback className="inline text-bold text-lg mb-1" /></span>
                            </div>
                        </div>
                        :
                        <div className="border-b py-0.5 flex items-center gap-1 border-gray-800">
                            <span >Select Tone</span>
                            <span><RiSpeakLine className="inline text-bold text-lg mb-1" /></span>
                        </div>

                }
                <div
                    className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                    border-gray-800"
                    onClick={(event) => rephraseContentFun(event, 'enhance')}
                >
                    Enhance ✨
                </div>
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                border-gray-800"
                    onClick={(event) => rephraseContentFun(event, 'professional')}
                >
                    Professional 🤵
                </div>
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                border-gray-800"
                    onClick={(event) => rephraseContentFun(event, 'formal')}
                >
                    Formal 📚
                </div>
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                border-gray-800"
                    onClick={(event) => rephraseContentFun(event, 'friendly')}
                >
                    Friendly 😊
                </div>
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                border-gray-800"
                    onClick={(event) => rephraseContentFun(event, 'confident')}
                >
                    Confident 💪
                </div>
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out"
                    onClick={(event) => rephraseContentFun(event, 'casual')}
                >
                    Casual 😎
                </div>
            </div>
        )
    }

export default PopUp2