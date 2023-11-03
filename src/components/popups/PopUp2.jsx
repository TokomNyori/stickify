'use client'
import { openAiPostHelper } from "@/helper/httpHelpers/httpNoteHelper";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlineRollback } from 'react-icons/ai'

const PopUp2 =
    ({ closeRephrasePopUp, rephrasePopUp, content, changeRephrasedNote, rephrasedNote,
        setLoadingRephraserFun, changeIsRepCnt, isRephrasedNote, isMobile }) => {

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

            const instruction = `Your job is to rephrase the given content to a different tone. Turn yourself into a powerful rephrasing tool. Rephrase the content in a ${tone} tone. The content is inside of curly brackets. The content is: {${ctx}}`
            const gptData = {
                model: 'gpt-3.5-turbo',
                temperature: 0.5,
                max_tokens: 3000,
                messages: [{
                    'role': 'user',
                    'content': instruction,
                }]
            }
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
                toast(`Rephrased to ${tone}!`, {
                    icon: '😀'
                })
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
            }, 200);
            toast('Back to the original', {
                icon: '😀'
            })
        }

        let styling
        if (!isDefault) {
            if (isMobile) {
                styling = { top: '32.8%' }
            } else {
                styling = { top: '28.2%' }
            }
        } else {
            styling = {}
        }

        return (
            <div
                className={`${rephrasePopUp ? 'PopUps2' : 'hidden'} bg-gray-800/50 text-gray-100
                        absolute ai-rephrase-options`} style={styling}
                ref={rephrasePopUpRef}
            >
                <div className="border-b py-0.5 font-bold">
                    Select Tone
                </div>
                {
                    !isDefault &&
                    <div
                        className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                        flex items-center gap-1"
                        onClick={(event) => undoRephraseContentFun(event)}
                    >
                        <span>Default</span> <span><AiOutlineRollback className="inline text-bold text-lg" /></span>
                    </div>
                }
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
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5"
                    onClick={(event) => rephraseContentFun(event, 'friendly')}
                >
                    Friendly 😊
                </div>
                <div className="cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out"
                    onClick={(event) => rephraseContentFun(event, 'technical')}
                >
                    Technical 💡
                </div>
            </div>
        )
    }

export default PopUp2