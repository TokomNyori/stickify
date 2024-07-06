import { useCompletion } from 'ai/react'
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const TranslateComponent = ({
    translatePopUp, translatePopUpRef, undoTranslate, setLanguageFunction, setTranslatedContentFunction, setLoadingGptFunction,
    readingMode, pageNoteData, stopStreamingForTranslate, stopSreaming,
}) => {
    const [translatedGptData, setTranslatedGptData] = useState({})
    let translatedLanguage = ''

    const {
        completion,
        input,
        stop,
        isLoading,
        handleInputChange,
        handleSubmit,
        complete,
    } = useCompletion({
        api: '/api/completion-others',
        body: {
            geyi: translatedGptData,
        },
        initialInput: 'Hello world!',
        onError: (error) => {
            console.log(error)
            toast('Sorry, could not translate', {
                icon: '🥺'
            })
        },
        onResponse: (res) => {
            console.log(res)
        },
        onFinish: () => {
            toast(`Translated to ${translatedLanguage}!`, {
                icon: '😀'
            })
        },
    });

    useEffect(() => {
        if (completion) {
            setTranslatedContentFunction(completion)
        }
    }, [completion])

    useEffect(() => {
        if (isLoading) {
            setLoadingGptFunction(true)
        } else {
            setLoadingGptFunction(false)
        }
    }, [isLoading])

    useEffect(() => {
        if (stopStreamingForTranslate) {
            stop()
            stopSreaming(false)
        }
    }, [stopStreamingForTranslate])

    console.log(completion)

    async function translateContent(event, translateTo) {
        const instruction = `Translate the following content into ${translateTo} language. Focus on preserving the original meaning, tone, and cultural nuances. Pay attention to idiomatic expressions and context to ensure an accurate and natural translation. Maintain the markdown formatting if there are any. Content to translate: ${pageNoteData}`
        const gptData = {
            model: 'gemini-1.5-flash',
            temperature: 1,
            max_tokens: 4000,
            stream: true,
            messages: [
                {
                    'role': 'system',
                    'content': 'Your task is to provide a translation that is not only accurate in terms of language but also faithful to the tone, context, and cultural nuances of the original content.',
                },
                {
                    'role': 'user',
                    'content': instruction,
                },
            ]
        }

        const hinglish = "Hinglish, a colloquial mix of Hindi and English. The translation should be conversational, using predominantly English structure with Hindi words mixed in. The Hinglish translation should be written in the Roman alphabet. For example, 'I am going home' can be translated as 'Main ghar ja raha hoon"

        setTranslatedGptData(gptData)
        translatedLanguage = translateTo === hinglish ? 'Hinglish' : translateTo
        setLanguageFunction(translatedLanguage)
        setTimeout(() => {
            handleSubmit(event)
        }, 20);
        // try {
        //     setLoadingGpt(true)
        //     const res = await openAiGptTextGeneration({ gptData: gptData })
        //     setTranslatedContent(res.choices[0].message.content)
        //     setLoadingGpt(false)
        //     setTranslatePopUp(false)
        //     setLanguage(translateTo)
        //     toast(`Translated to ${translateTo}!`, {
        //         icon: '😀'
        //     })
        // } catch (error) {
        //     setLoadingGpt(false)
        //     setTranslatePopUp(false)
        //     toast(error.message, {
        //         icon: '😔'
        //     })
        // }
    }

    return (
        <div
            className={`${translatePopUp ? 'PopUps' : 'hidden'}  backdrop-blur-[12px] font-semibold rounded-tr-none
            ${readingMode ? 'text-gray-100 bg-zinc-900' : 'text-gray-800 bg-zinc-50'} shadow-xl rounded-2xl`}
            ref={translatePopUpRef}
        >
            <div className={`col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                ${readingMode ? 'dark:border-gray-100' : 'border-gray-800'}`}
                onClick={undoTranslate}
            >
                English (Default)
            </div>
            <div className={`col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                ${readingMode ? 'dark:border-gray-100' : 'border-gray-800'}`}
                onClick={(event) => translateContent(event, "Hinglish, a colloquial mix of Hindi and English. The translation should be conversational, using predominantly English structure with Hindi words mixed in. The Hinglish translation should be written in the Roman alphabet. For example, 'I am going home' can be translated as 'Main ghar ja raha hoon")}
            >
                Hinglish (Blended ✨)
            </div>
            <div className={`col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                ${readingMode ? 'dark:border-gray-100' : 'border-gray-800'}`}
                onClick={(event) => translateContent(event, 'Hindi')}
            >
                Hindi (हिंदी)
            </div>
            <div className={`col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                ${readingMode ? 'dark:border-gray-100' : 'border-gray-800'}`}
                onClick={(event) => translateContent(event, 'Japanese')}
            >
                Japanese (日本語)
            </div>
            <div className={`col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                ${readingMode ? 'dark:border-gray-100' : 'border-gray-800'}`}
                onClick={(event) => translateContent(event, 'French')}
            >
                French (Français)
            </div>
            <div className={`col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                ${readingMode ? 'dark:border-gray-100' : 'border-gray-800'}`}
                onClick={(event) => translateContent(event, 'Korean')}
            >
                Korean (한국인)
            </div>
            <div className={`col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                ${readingMode ? 'dark:border-gray-100' : 'border-gray-800'}`}
                onClick={(event) => translateContent(event, 'German')}
            >
                German (Deutsch)
            </div>
            <div className={`col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out border-b py-0.5
                ${readingMode ? 'dark:border-gray-100' : 'border-gray-800'}`}
                onClick={(event) => translateContent(event, 'Chinese Simplified')}
            >
                Chinese (中国人)
            </div>
            <div className={`col-span-8 cursor-pointer hover:scale-[1.03] transition-all duration-150 ease-in-out py-0.5
                ${readingMode ? 'dark:border-gray-100' : 'border-gray-800'}`}
                onClick={(event) => translateContent(event, 'Spanish')}
            >
                Spanish (Español)
            </div>
        </div>
    )
}

export default TranslateComponent