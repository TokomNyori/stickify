'use client'
import { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BiSolidSend } from 'react-icons/bi'
import ClipLoader from "react-spinners/GridLoader";
import toast, { Toaster } from 'react-hot-toast';
import { nanoid } from 'nanoid'
import { openAiGptTextGeneration, youtubeOneVideotHelper } from '@/helper/externalAPIHelpers/handleExternalAPIs'
import { useCompletion } from 'ai/react'
import { set } from 'mongoose';
import { RiEyeCloseLine } from 'react-icons/ri';

const GptSubmit = (
    { gptSubmitModalState, noteFromNoteModal, changeGptRequirementModal, changeNoteContentByGpt, isEdit,
        changeNoteContentByGptTrial, closeGptRequirementModal, setYoutubeVideosByGptModal, changeYtGptLoader, changeStreamGptLoader }
) => {

    const copyNoteFromNoteModal = { ...noteFromNoteModal }
    // console.log('NoteFromMainModal')
    // console.log(nfmm.title)
    const [generateRequirementGpt, setGenerateRequirementGpt] = useState({
        generate_title: copyNoteFromNoteModal.title,
        words: '300',
        output_type: 'easy to understand',
        emojis: true,
        videos: true,
    })
    const [loadingGpt, setLoadingGpt] = useState(false)

    useEffect(() => {
        setGenerateRequirementGpt(prev => ({
            ...prev,
            generate_title: copyNoteFromNoteModal.title
        }))
    }, [noteFromNoteModal])

    function changeGenerateRequirementGpt(event) {
        const { name, value, type, checked } = event.target
        setGenerateRequirementGpt(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    let temperature = 0.5
    let tokens = 0
    let words = parseInt(generateRequirementGpt.words, 10)
    console.log(words)
    if (words > 250 && words < 501) {
        tokens = 1200
    } else if (words > 500 && words < 751) {
        console.log('BOOMM')
        tokens = 1700
    } else if (words > 750 && words < 1001) {
        tokens = 2200
    } else if (words > 1000 && words < 2001) {
        tokens = 4000
    } else {
        tokens = 700
    }
    let output_type = ''
    if (generateRequirementGpt.output_type === 'easy to understand') {
        output_type = `Simplify the explanation as if teaching a young child. Use analogies and metaphors for complex concepts, and avoid jargon. The language should be straightforward and engaging, suitable for someone with no prior knowledge of the topic`
        temperature = 0.7
    } else if (generateRequirementGpt.output_type === 'gamify') {
        output_type = `Explain the topic so it feels like a game. Gamify the learning process. Use gamification techniques to engage the audience. Explain the topic by playing a Game. Introduce elements like challenges, rewards, and progress levels. Use playful language and scenarios to make the learning process fun and memorable`
        temperature = 0.7
    } else {
        output_type = `Explain the topic with precision and accuracy. Deliver the content with accuracy and depth. Use technical terms appropriately and provide clear definitions. Ensure that the information is up-to-date and cite reliable sources where applicable`
        temperature = 0.5
    }
    const emojiOption = ' Generate 5 to 7 meaningful emojis interspersed throughout the content. The emojis should be relevant to the context.'
    const instruction = `Act as an expert in the topic. ${output_type}. Don't be VERBOSE. Format the response using Markdown, but keep the Markdown formatting minimal. Avoid using bold formatting. Use headers for main headings and subheadings. Do not incluse bold formating with lists and bullet ponits. Avoid creating unnecessary white spaces and new lines. Include links for additional information. Make sure to aim for a word count of approximately ${words} words.${generateRequirementGpt.emojis ? emojiOption : ''} Conclude with an intriguing fact related to the topic. The topic is: ${generateRequirementGpt.generate_title}`
    const gptData = {
        model: 'gpt-3.5-turbo-1106',
        stream: true,
        temperature: temperature,
        max_tokens: tokens,
        messages: [
            {
                'role': 'system',
                'content': "You are generating content for 'Stickify', a note-taking app designed for a diverse user base ranging from students to professionals. The content should be adaptable for educational purposes, professional use, and personal knowledge enhancement. Keep in mind the varying levels of expertise and interests of the users."
            },
            {
                'role': 'user',
                'content': instruction,
            }
        ],
    }

    const {
        completion,
        input,
        stop,
        isLoading,
        handleInputChange,
        handleSubmit,
    } = useCompletion({
        api: '/api/completion',
        body: {
            geyi: gptData
        },
        initialInput: instruction,
        onError: () => {
            toast('Sorry could not generate', {
                icon: '🥺'
            })
        },
        onResponse: (res) => {
            //const resp = res.json()
            console.log(res)
        },
        onFinish: async () => {
            if (generateRequirementGpt.videos) {
                if (isEdit && noteFromNoteModal.ytVideo.length > 4) {
                    return
                }
                changeYtGptLoader(true)
                const ytTitle = `${generateRequirementGpt.generate_title}`
                const ytRes = await youtubeOneVideotHelper(
                    {
                        method: 'GET',
                        title: ytTitle,
                        headers: { 'Content-Type': 'application/json' }
                    }
                )
                // console.log('ytRes--')
                // console.log(ytRes)
                // If Videos not available
                if (ytRes.items.length === 0) {
                    const generatedData = {
                        'gptGeneratedContent': gptGeneratedContent,
                        'ytVideoData': [],
                    }
                    // changeNoteContentByGpt(generatedData, false)
                    changeYtGptLoader(false)
                    // changeGptRequirementModal()
                    toast('Sorry could not find', {
                        icon: '🥺'
                    })
                } else {
                    // If Videos available
                    const datas = ytRes.items
                    let ytVideoData = []
                    if (isEdit) {
                        const ytIdsFromNoteSet = new Set(noteFromNoteModal.ytVideo.map(video => video.ytVideoId));
                        datas.forEach(data => {
                            if (!ytIdsFromNoteSet.has(data.id.videoId)) {
                                const modify = {
                                    ytVideoId: data.id.videoId,
                                    ytVideoTitle: data.snippet.title,
                                }
                                ytVideoData.push(modify)
                            }
                        })
                    } else {
                        ytVideoData = datas.map(data => {
                            const modify = {
                                ytVideoId: data.id.videoId,
                                ytVideoTitle: data.snippet.title,
                            }
                            return modify
                        })
                    }
                    // console.log('yt video data--')
                    // console.log(ytVideoData)
                    setYoutubeVideosByGptModal(ytVideoData)
                    changeYtGptLoader(false)
                    toast('Boom!', {
                        icon: '🔥',
                        position: 'top-center'
                    })
                }
            } else {
                toast('Boom!', {
                    icon: '🔥'
                })
            }
        },
    });

    useEffect(() => {
        if (completion) {
            console.log(completion)
            changeNoteContentByGptTrial(completion)
        }
    }, [completion])

    // useEffect(() => {
    //     if (isLoading) {
    //         changeStreamGptLoader(true)
    //     } else {
    //         changeStreamGptLoader(false)
    //     }

    //     if (gptSubmitModalState) {
    //         closeGptRequirementModal()
    //     }
    // }, [isLoading])


    //console.log(ytGptLoader)

    return (
        <div
            className={`gpt-modal-blur inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center
                        ${gptSubmitModalState ? "gpt-fix-modal" : "hidden"} flex-wrap`}>
            <div className={`gpt-generate-modal rounded-3xl shadow-lg bg-zinc-900`} >
                <div className="modal-heading text-gray-300">
                    <div className="text-center ">Requirements</div>
                    <div className='close-btn cursor-pointer' onClick={changeGptRequirementModal}>
                        <AiOutlineCloseCircle className={`sm:text-3xl text-4xl text-gray-300 hover:text-red-400`} />
                    </div>
                </div>
                <form className="mt-4 text-zinc-200" onSubmit={handleSubmit} id='gptSubmitForm'>
                    {/* <div className="mb-4">
                        <label htmlFor="generate_title" className="block mb-2 text-sm font-medium">Title</label>
                        <input type="text" id="generate_title" className="bg-gray-700 border-b border-gray-400/75 block w-full 
                                p-2 text-sm font-bold placeholder-gray-500 text-gray-200 focus:outline-none bg-transparent"
                            placeholder="Title..." name="generate_title" value={generateRequirementGpt.generate_title}
                            onChange={changeGenerateRequirementGpt} required />
                    </div> */}
                    <div className="flex justify-between items-center gap-4 mb-4">
                        <div>
                            <label htmlFor="words" className="block mb-2 sm:text-[1rem] text-[1.1rem] font-medium">Words:</label>
                            <input type="number" name="words" id="words" placeholder='100' min="100" max="2000"
                                className='sm:text-[1rem] text-[1.1rem] rounded-lg w-full p-2 bg-zinc-700 border-zinc-700 
                                placeholder-zinc-400
                                text-zinc-100 focus:ring-blue-500 focus:border-blue-500 shadow-sm-light'
                                value={generateRequirementGpt.words} onChange={changeGenerateRequirementGpt}
                                title='Enter a number between 10 and 2000' />
                        </div>
                        <div className='flex-grow'>
                            <label htmlFor="output_type" className="block mb-2 sm:text-[1rem] text-[1.1rem] font-medium">Output type:</label>
                            <select name="output_type" id="output_type"
                                className='sm:text-[1rem] text-[1.1rem] rounded-lg w-full p-2 bg-zinc-700 border-gray-500 
                                placeholder-zinc-400 
                                text-zinc-100 focus:ring-blue-500 focus:border-blue-500 shadow-sm-light'
                                value={generateRequirementGpt.output_type} onChange={changeGenerateRequirementGpt} >
                                <option value="easy to understand">Easy to understand</option>
                                <option value="standard">Standard</option>
                                <option value="gamify">Gamify</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                        <div className='flex justify-center items-center gap-5'>
                            <div className='flex items-center'>
                                <input id="emojis" type="checkbox" name="emojis" checked={generateRequirementGpt.emojis}
                                    onChange={changeGenerateRequirementGpt}
                                    class="sm:w-4 sm:h-4 w-5 h-5 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 
                                bg-zinc-700 border-zinc-600" />
                                <label for="emojis" class="ml-2 sm:text-[1rem] text-[1.1rem] font-medium text-zinc-300">
                                    Add emojis
                                </label>
                            </div>
                            <div className='flex items-center'>
                                <input id="videos" type="checkbox" name="videos" checked={generateRequirementGpt.videos}
                                    onChange={changeGenerateRequirementGpt}
                                    class="sm:w-4 sm:h-4 w-5 h-5 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 
                                    bg-zinc-700 border-zinc-600" />
                                <label for="videos" class="ml-2 sm:text-[1rem] text-[1.1rem] font-medium text-zinc-300">
                                    Add videos
                                </label>
                            </div>
                        </div>
                        <button
                            className="border border-gray-400 focus:outline-none font-medium rounded-full text-[1.1rem] px-2
                                    py-2 mb-2 bg-transparent text-whiteborder-gray-600  hover:bg-green-500
                                    focus:ring-gray-700"
                            type="submit"
                        >
                            <BiSolidSend className='font-bold sm:text-2xl text-3xl' />
                        </button>
                    </div>
                </form>
            </div>
            {/* {isLoading &&
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
                        Hold on!
                    </div>
                    <div className="text-lg mt-2 font-bold text-[#f1f5f9] text-center">
                        Optimizing Your Wait ⚙️🚀 <br />
                    </div>
                </div>
            } */}
        </div>

    )
}

export default GptSubmit