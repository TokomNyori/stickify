import { openAiPostHelper, youtubeOneVideotHelper } from '@/helper/httpHelpers/httpNoteHelper'
import { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BiSolidSend } from 'react-icons/bi'
import ClipLoader from "react-spinners/GridLoader";
import toast, { Toaster } from 'react-hot-toast';

const GptSubmit = ({ gptSubmitModalState, noteFromNoteModal, changeGptRequirementModal, changeNoteContentByGpt }) => {

    const nfmm = { ...noteFromNoteModal }
    // console.log('NoteFromMainModal')
    // console.log(nfmm.title)
    const [generateRequirementGpt, setGenerateRequirementGpt] = useState({
        generate_title: nfmm.title,
        words: '250',
        output_type: 'easy to understand',
        emojis: true,
    })
    const [loadingGpt, setLoadingGpt] = useState(false)

    useEffect(() => {
        setGenerateRequirementGpt(prev => ({
            ...prev,
            generate_title: nfmm.title
        }))
    }, [noteFromNoteModal])

    function changeGenerateRequirementGpt(event) {
        const { name, value, type, checked } = event.target
        setGenerateRequirementGpt(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    async function generateContent(event) {
        event.preventDefault()
        let temperature = 0.5
        let words = parseInt(generateRequirementGpt.words, 10)
        if (words > 250 && words < 501) {
            words = 1000
        } else if (words > 500 && words < 751) {
            words = 1500
        } else if (words > 750 && words < 1001) {
            words = 2000
        } else {
            words = 500
        }
        let output_type = ''
        let additionalInstructions = '';
        if (generateRequirementGpt.output_type === 'easy to understand') {
            output_type = `Explain in a way that makes the topic simple. Present the subject matter in a manner so simple and clear that it can be comprehended by an 8-year-old`
            additionalInstructions = 'Simplify complex concepts and use plain language.'
            temperature = 0.7
        } else if (generateRequirementGpt.output_type === 'gamify') {
            output_type = `Think of yourself as a creative teacher. Explain the topic so it feels like a game. Gamify the learning process. Explain the topic by playing a game`
            additionalInstructions = 'Use storytelling and gamification techniques to engage the audience.'
            temperature = 0.7
        } else {
            output_type = `Explain the topic with precision and accuracy. Explain the subject matter in a standard and clear manner`
            additionalInstructions = 'Provide detailed and accurate information in a clear and concise way.'
            temperature = 0.5
        }
        const emojiOption = ' Generate 3 to 4 meaningful emojis interspersed throughout the content. The emojis should be relevant to the context.'
        const instruction = `Act as an expert in the topic. ${output_type}. Don't be verbose. Generate at least ${words} words.${generateRequirementGpt.emojis ? emojiOption : ''} The topic is inside curly brackets. The topic is: {${generateRequirementGpt.generate_title}}. ${additionalInstructions} End with an interesting fact about the topic.`
        const gptData = {
            model: 'gpt-3.5-turbo',
            temperature: temperature,
            max_tokens: words,
            messages: [
                {
                    'role': 'system',
                    'content': 'You are generating content for a note-taking app. Please do not indroduce the app'
                },
                {
                    'role': 'user',
                    'content': instruction,
                }
            ]
        }
        console.log(instruction)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        }
        try {
            setLoadingGpt(true)
            const res = await openAiPostHelper({ method: 'POST', headers: headers, body: gptData })
            const gptGeneratedContent = res.choices[0].message.content
            const ytTitle = `Explain ${generateRequirementGpt.generate_title}`
            const ytRes = await youtubeOneVideotHelper({ method: 'GET', title: ytTitle })
            console.log('ytRes--')
            console.log(ytRes)
            if (ytRes.items.length === 0) {
                const youtubeVideoId = ''
                const generatedData = {
                    'gptGeneratedContent': gptGeneratedContent,
                    'youtubeVideoId': youtubeVideoId,
                }
                changeNoteContentByGpt(generatedData)
                setLoadingGpt(false)
                changeGptRequirementModal()
                toast('Generated!', {
                    icon: '😀'
                })
            } else {
                const youtubeVideoId = ytRes.items[0].id.videoId
                const generatedData = {
                    'gptGeneratedContent': gptGeneratedContent,
                    'youtubeVideoId': youtubeVideoId,
                }
                changeNoteContentByGpt(generatedData)
                setLoadingGpt(false)
                changeGptRequirementModal()
                toast('Generated!', {
                    icon: '😀'
                })
            }
        } catch (error) {
            setLoadingGpt(false)
            toast(error.message, {
                icon: '😀'
            })
        }
    }

    return (
        <div
            className={`gpt-modal-blur inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center
                        ${gptSubmitModalState ? "gpt-fix-modal" : "hidden"} flex-wrap`}>
            <div className={`gpt-generate-modal rounded-lg shadow-lg bg-gray-700`} >
                <div className="modal-heading text-gray-300">
                    <div className="text-center ">Requirements</div>
                    <div className='close-btn cursor-pointer' onClick={changeGptRequirementModal}>
                        <AiOutlineCloseCircle className={`sm:text-2xl text-3xl text-gray-300 hover:text-red-400`} />
                    </div>
                </div>
                <form className="mt-4 text-gray-300" onSubmit={generateContent} id='gptSubmitForm'>
                    {/* <div className="mb-4">
                        <label htmlFor="generate_title" className="block mb-2 text-sm font-medium">Title</label>
                        <input type="text" id="generate_title" className="bg-gray-700 border-b border-gray-400/75 block w-full 
                                p-2 text-sm font-bold placeholder-gray-500 text-gray-200 focus:outline-none bg-transparent"
                            placeholder="Title..." name="generate_title" value={generateRequirementGpt.generate_title}
                            onChange={changeGenerateRequirementGpt} required />
                    </div> */}
                    <div className="flex justify-between items-center gap-4 mb-4">
                        <div>
                            <label htmlFor="" className="block mb-2 sm:text-sm font-medium">Words:</label>
                            <input type="number" name="words" id="" placeholder='100' min="10" max="1000"
                                className='sm:text-sm rounded-lg w-full p-2 bg-gray-600 border-gray-500 placeholder-gray-400 
                                text-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-sm-light'
                                value={generateRequirementGpt.words} onChange={changeGenerateRequirementGpt} />
                        </div>
                        <div className='flex-grow'>
                            <label htmlFor="" className="block mb-2 sm:text-sm font-medium">Output type:</label>
                            <select name="output_type" id=""
                                className='sm:text-sm rounded-lg w-full p-2 bg-gray-600 border-gray-500 placeholder-gray-400 
                                text-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-sm-light'
                                value={generateRequirementGpt.output_type} onChange={changeGenerateRequirementGpt} >
                                <option value="easy to understand">Easy to understand</option>
                                <option value="standard">Standard</option>
                                <option value="gamify">Gamify</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                        <div className='flex items-center'>
                            <input id="emojis" type="checkbox" name="emojis" checked={generateRequirementGpt.emojis}
                                onChange={changeGenerateRequirementGpt}
                                class="sm:w-4 sm:h-4 w-5 h-5 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 
                                bg-gray-700 border-gray-600" />
                            <label for="emojis" class="ml-2 sm:text-sm font-medium text-gray-300">Include emojis?</label>
                        </div>
                        <button
                            className="border border-gray-400 focus:outline-none font-medium rounded-full text-sm px-2
                                    py-2 mb-2 bg-transparent text-whiteborder-gray-600  hover:bg-green-300
                                    focus:ring-gray-700"
                            type="submit"
                        >
                            <BiSolidSend className='font-bold sm:text-xl text-2xl' />
                        </button>
                    </div>
                </form>
            </div>
            {loadingGpt &&
                <div
                    className={`modal-blur absolute inset-0 bg-black bg-opacity-30 backdrop-blur-[2px] flex flex-col justify-center 
                                items-center flex-wrap`}>
                    <ClipLoader
                        color='#e2e8f0'
                        loading='Generating...'
                        //cssOverride={override}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                    <div className="text-2xl mt-5 font-bold text-[#e2e8f0]">
                        Generating...
                    </div>
                </div>

            }
        </div>

    )
}

export default GptSubmit