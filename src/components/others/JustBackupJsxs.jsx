

// PART OF NOTE MODAL'S SUBMIT FUNCTION!!!

// if (isEdit) {
//     try {
//         setLoading(true)
//         const res = await editNoteHelper(
//             {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 noteid: noteModalConfig.noteObject._id,
//                 body: isRephrasedNote ? rephrasedNote : note
//             }
//         )
//         const notesRes = await getNoteHelper({
//             method: 'GET',
//             userId: users._id,
//             headers: { 'Content-Type': 'application/json' }
//         })
//         console.log('notesRes.body')
//         console.log(notesRes.body)
//         dispatch(addNote(notesRes.body))
//         dispatch(addCurrentNotePage(res.body))
//         setLoading(false)
//         rephraseDefaultTrue()
//         toast("Boom! Note's Customized!", {
//             icon: '🔥📝'
//         });
//         closeModal(event)
//     } catch (error) {
//         console.log(error)
//         setLoading(false)
//         toast(`Could not edit!`, {
//             icon: '🥺'
//         });
//     }
//     return
// }
// try {
//     setLoading(true)
//     isRephrasedNote ?
//         await postNoteHelper({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: rephrasedNote })
//         :
//         await postNoteHelper({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: note })
//     const notesRes = await getNoteHelper({
//         method: 'GET',
//         userId: users._id,
//         headers: { 'Content-Type': 'application/json' }
//     })
//     dispatch(addNote(notesRes.body))
//     setLoading(false)
//     rephraseDefaultTrue()
//     toast("Boom! Note's Ready!", {
//         icon: '🔥📝'
//     });
//     closeModal(event)
// }



// Part of the note modal to resize text rows using useEffect
// useEffect(() => {
//     const height = window.innerHeight;
//     console.log(height)
//     if (height > 700 && height < 800) {
//         setTextareaRows(19)
//     } else if (height > 799 && height < 900) {
//         setTextareaRows(23)
//     } else if (height > 899 && height < 1000) {
//         setTextareaRows(25)
//     } else if (height > 999 && height < 1300) {
//         setTextareaRows(27)
//     } else if (height < 600) {
//         rephrasedNote.content || note.content ? setTextareaRows(14) : setTextareaRows(15)
//     } else {
//         setTextareaRows(16)
//     }
// }, [])




// Part of the modal to generate content and adding videos
// async function generateContent(event) {
//     event.preventDefault()
//     let temperature = 0.5
//     let tokens = 0
//     let words = parseInt(generateRequirementGpt.words, 10)
//     if (words > 250 && words < 501) {
//         tokens = 1200
//     } else if (words > 500 && words < 751) {
//         tokens = 1700
//     } else if (words > 750 && words < 1001) {
//         tokens = 2200
//     } else if (words > 1000 && words < 2001) {
//         tokens = 4000
//     } else {
//         tokens = 700
//     }
//     let output_type = ''
//     if (generateRequirementGpt.output_type === 'easy to understand') {
//         output_type = `Simplify the explanation as if teaching a young child. Use analogies and metaphors for complex concepts, and avoid jargon. The language should be straightforward and engaging, suitable for someone with no prior knowledge of the topic`
//         temperature = 0.7
//     } else if (generateRequirementGpt.output_type === 'gamify') {
//         output_type = `Explain the topic so it feels like a game. Gamify the learning process. Use gamification techniques to engage the audience. Explain the topic by playing a Game. Introduce elements like challenges, rewards, and progress levels. Use playful language and scenarios to make the learning process fun and memorable`
//         temperature = 0.7
//     } else {
//         output_type = `Explain the topic with precision and accuracy. Deliver the content with accuracy and depth. Use technical terms appropriately and provide clear definitions. Ensure that the information is up-to-date and cite reliable sources where applicable`
//         temperature = 0.5
//     }
//     const emojiOption = ' Generate 5 to 7 meaningful emojis interspersed throughout the content. The emojis should be relevant to the context.'
//     const instruction = `Act as an expert in the topic. ${output_type}. Don't be VERBOSE. Format the content using Markdown where appropriate to improve readability and organization. Use headers for titles and subheadings, lists for itemization or enumeration, bold and italics for emphasis, and links for references. Avoid creating unnecessary white spaces and new lines. Include hyperlinks for additional information. Aim for a word count of approximately ${words}.${generateRequirementGpt.emojis ? emojiOption : ''} Conclude with an intriguing fact related to the topic. The topic is: ${generateRequirementGpt.generate_title}`
//     const gptData = {
//         model: 'gpt-3.5-turbo-1106',
//         temperature: temperature,
//         // max_tokens: tokens,
//         messages: [
//             {
//                 'role': 'system',
//                 'content': "You are generating content for 'Stickify', a note-taking app designed for a diverse user base ranging from students to professionals. The content should be adaptable for educational purposes, professional use, and personal knowledge enhancement. Keep in mind the varying levels of expertise and interests of the users."
//             },
//             {
//                 'role': 'user',
//                 'content': instruction,
//             }
//         ],
//     }
//     // console.log(tokens)
//     // console.log(instruction)
//     // const headers = {
//     //     'Content-Type': 'application/json',
//     //     'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
//     // }
//     try {
//         setLoadingGpt(true)
//         const res = await openAiGptTextGeneration({ gptData: gptData })
//         console.log('openAiGptTextGeneration')
//         console.log(res)
//         const gptGeneratedContent = res.choices[0].message.content

//         // If Video included
//         if (generateRequirementGpt.videos) {
//             const ytTitle = `${generateRequirementGpt.generate_title}`
//             const ytRes = await youtubeOneVideotHelper(
//                 {
//                     method: 'GET',
//                     title: ytTitle,
//                     headers: { 'Content-Type': 'application/json' }
//                 }
//             )
//             // console.log('ytRes--')
//             // console.log(ytRes)
//             // If Videos not available
//             if (ytRes.items.length === 0) {
//                 const generatedData = {
//                     'gptGeneratedContent': gptGeneratedContent,
//                     'ytVideoData': [],
//                 }
//                 changeNoteContentByGpt(generatedData, false)
//                 setLoadingGpt(false)
//                 changeGptRequirementModal()
//                 // toast('Generated!', {
//                 //     icon: '😀'
//                 // })
//             } else {
//                 // If Videos available
//                 const datas = ytRes.items
//                 let ytVideoData = []
//                 if (isEdit) {
//                     const ytIdsFromNoteSet = new Set(noteFromNoteModal.ytVideo.map(video => video.ytVideoId));
//                     datas.forEach(data => {
//                         if (!ytIdsFromNoteSet.has(data.id.videoId)) {
//                             const modify = {
//                                 ytVideoId: data.id.videoId,
//                                 ytVideoTitle: data.snippet.title,
//                             }
//                             ytVideoData.push(modify)
//                         }
//                     })
//                 } else {
//                     ytVideoData = datas.map(data => {
//                         const modify = {
//                             ytVideoId: data.id.videoId,
//                             uniqueId: nanoid(),
//                             ytVideoTitle: data.snippet.title,
//                         }
//                         return modify
//                     })
//                 }

//                 // console.log('yt video data--')
//                 // console.log(ytVideoData)
//                 const generatedData = {
//                     'gptGeneratedContent': gptGeneratedContent,
//                     'ytVideoData': ytVideoData,
//                 }
//                 changeNoteContentByGpt(generatedData, true)
//                 setLoadingGpt(false)
//                 changeGptRequirementModal()
//                 // toast('Generated!', {
//                 //     icon: '😀'
//                 // })
//             }
//         } else {
//             // If Videos not included
//             const generatedData = {
//                 'gptGeneratedContent': gptGeneratedContent,
//                 'ytVideoData': [],
//             }
//             changeNoteContentByGpt(generatedData, false)
//             setLoadingGpt(false)
//             changeGptRequirementModal()
//             toast('Generated!', {
//                 icon: '😀'
//             })
//         }
//     } catch (error) {
//         // Catch errors
//         setLoadingGpt(false)
//         console.log(error)
//         toast('Sorry could not generate', {
//             icon: '🥺'
//         })
//     }
// }



// Part of the note modal to change tokens
// if (words > 250 && words < 501) {
//     tokens = 1200
// } else if (words > 500 && words < 751) {
//     console.log('BOOMM')
//     tokens = 1700
// } else if (words > 750 && words < 1001) {
//     tokens = 2200
// } else if (words > 1000 && words < 2001) {
//     tokens = 4000
// } else {
//     tokens = 700
// }




// Middleware backup
// This function can be marked `async` if using `await` inside
// export function middleware(request) {

//     // Getting cookies that has been stored
//     const cookie = request.cookies.get('userJwtCookie')?.value

//     // welcomePath is only for the users who are not logged in
//     const welcomePath = '/welcome'

//     // loggedUserPaths are only for the users who are logged in
//     const loggedUserPaths = ['/', '/global']

//     // Extracting the current path
//     const { pathname } = request.nextUrl

//     if (pathname === '/api/chat') {
//         // Add your specific logic for /api/chat here
//         console.log('Accessing /api/chat');
//     }

//     // NO restrictions for these two APIs, the middleware will be closed.
//     if (pathname === '/api/users/login' || pathname === '/api/users/signup') {
//         return
//     }

//     if (pathname === welcomePath) {
//         /* If the users are logged in and trying to access public (signup/login) routes/pages,
//        they will be redirected to home page */
//         if (cookie) {
//             console.log('You are already logged in!')
//             return NextResponse.redirect(new URL('/', request.url))
//         }
//     } else {
//         /* If the users are not logged in and trying to access private routes/pages, 
//         they will be redirected to welcome page */
//         if (!cookie) {
//             if (pathname.startsWith('/api')) {
//                 return NextResponse.json({
//                     message: 'API access denied',
//                     success: false,
//                 }, { status: 401 })
//             }
//             console.log('You are not logged in!')
//             return NextResponse.redirect(new URL('/welcome', request.url))
//         }
//     }

//     //return NextResponse.redirect(new URL('/', request.url))
// }

// // See "Matching Paths" below to learn more
// export const config = {
//     matcher: ['/', '/global', '/welcome', '/api/:path*'],
// }




{/* <div className={`${navigationSection === 'note-section' ? 'flex' : 'hidden'}`}>
    {
        !translatedContent ?
            <div className='sm:text-[1rem] text-[1.1rem] markDownContent'
                style={{ whiteSpace: 'pre-line' }}>
                <MarkdownContent texts={summarizedContent ? summarizedContent : pageNoteData.content} />
            </div>
            :
            <div className='' style={{ whiteSpace: 'pre-line' }}>
                <MarkdownContent texts={translatedContent} />
            </div>
    }
</div> */}

// ${readingMode ? `bg-zinc-900/90 text-gray-100` :
//                 `dark:bg-zinc-900/90 dark:text-gray-100 bg-[#f6f8f6]`}





// Important page code for loading.jsx
// 'use client'
// import { useTheme } from "next-themes";
// import ClipLoader from "react-spinners/GridLoader";
// import ClipLoader2 from "react-spinners/SquareLoader";
// const loading = () => {
//     const { theme, setTheme } = useTheme()

//     return (
//         <div className="flex justify-center items-center text-gray-200 h-screen w-full -mt-20">
//             <div
//                 className={`loader-gpt w-full h-full inset-0 backdrop-blur-[2px] flex justify-center
//                                 items-center flex-col flex-wrap gap-y-10`}
//             >
//                 <div className="">
//                     <ClipLoader2
//                         color="#3f3f46"
//                         loading='loading...'
//                         //cssOverride={override}
//                         size={150}
//                         aria-label="Loading Spinner"
//                         data-testid="loader"
//                         speedMultiplier={1}
//                     />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default loading


// WElcome main top container css
//<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-0 justify-center items-center -mt-8 sm:-mt-4'></div>



// UPDATE like api function:
// import { connectDB } from "@/helper/db"
// import { getResponseMsg } from "@/helper/getResponseMsg"
// import { NoteModel } from "@/models/notemodel"
// import { Types } from 'mongoose';

// connectDB()

// // Edit only note status by noteId
// export async function PUT(request, { params }) {
//     const { noteid } = params
//     //Fetch work data from request
//     const { likedBy, func } = await request.json()
//     const { ObjectId } = Types;
//     console.log(func)
//     try {
//         let update;
//         if (func === 'like') {
//             update = {
//                 $inc: { likes: 1 },
//                 $addToSet: { likedBy: new ObjectId(likedBy) }, // Add to set to ensure unique entries
//             };
//         } else {
//             // console.log(`likedBy before conversion: ${likedBy}, type: ${typeof likedBy}`)
//             // const likedByObjectId = new ObjectId(likedBy)
//             // console.log(`likedBy after conversion: ${likedByObjectId}, type: ${typeof likedByObjectId}`)
//             update = { $inc: { likes: -1 }, $pull: { likedBy: new ObjectId(likedBy) } };
//         }

//         const updatedNote = await NoteModel.findByIdAndUpdate(noteid, update, { new: true });

//         return getResponseMsg(
//             { message: `Dynamically updated likes: ${noteid}`, status: 200, success: true, body: updatedNote }
//         )
//     } catch (error) {
//         console.log(error)
//         return getResponseMsg(
//             { message: 'Failed to update likes', status: 500, success: false, body: error.message }
//         )
//     }
// }



//Navbar icon link border
// border-b-[1px] border-gray-700 dark:border-gray-100


//  GPT section instruictions
// messages: [
//     {
//         'role': 'system',
//         'content': "Your name is Stickify AI. You are an advanced AI model for generating content, developed specifically by the creators of the Stickify note-taking app. In your interactions, do not identify yourself as OpenAI's GPT model. Your primary function is to generate content for 'Stickify', a note-taking app designed for a diverse user base ranging from students to professionals. You can generate notes for users on any given title or topic and can customize the output by setting word limits and choosing between standard, easy-to-understand, or gamified text. Additionally, you have the capability to enhance notes with emojis for a more expressive experience. The content should be adaptable for educational purposes, professional use, and personal knowledge enhancement. Keep in mind the varying levels of expertise and interests of the users. Always avoid Bold formatting in markdown while generating content."
//     },
//     {
//         'role': 'user',
//         'content': instruction,
//     }
// ],

//const instruction = `Act as an expert in the topic. ${output_type}. Don't be VERBOSE. Format the response using Markdown, but keep the Markdown formatting minimal. Avoid using bold formatting. Use headers for main headings and subheadings. Do not include bold formatting with lists and bullet points. Avoid creating unnecessary white spaces and new lines. Include links for additional information. Make sure to aim for a word count of approximately ${words} words.${generateRequirementGpt.emojis ? emojiOption : ''} Conclude with an intriguing fact related to the topic. The topic is: ${generateRequirementGpt.generate_title}`


// Backup of chat API config messages:

// messages: [
//     {
//         role: "system",
//         content: systemInstruction,
//     },
//     {
//         role: "user",
//         content: "Are you based on gpt model?"
//     },
//     {
//         role: "assistant",
//         content: "No, I am not based on GPT-3.5 or any other GPT models. I am an advanced AI model developed by the creators of the Stickify note-taking app. My primary function is to assist users with research."
//     },
//     {
//         role: "user",
//         content: "Are you ChatGPT?"
//     },
//     {
//         role: "assistant",
//         content: "No, I am not ChatGPT. I am an advanced AI model developed by the creators of the Stickify note-taking app. My primary function is to assist users with research."
//     },
//     {
//         role: "user",
//         content: "What is your name?"
//     },
//     {
//         role: "assistant",
//         content: "My name is Cyra. I am an AI model developed by the creators of the Stickify note-taking app. My primary function is to assist users with research or simply engage in friendly chat."
//     },
//     {
//         role: "user",
//         content: "How do you know my name?"
//     },
//     {
//         role: "assistant",
//         content: "As you're using the Stickify web app, your name is shared with me to personalize your experience. Rest assured, Stickify only collects essential information and respects your privacy. We don't gather personal details beyond what's necessary for the service, and we never sell or share your information with third parties."
//     },
//     {
//         role: "user",
//         content: "what is Stickify's website like?"
//     },
//     {
//         role: "assistant",
//         content: "The link is https://stickifynotes.vercel.app/"
//     },
//     {
//         role: "user",
//         content: "What is Stickify, tell me about stickify?"
//     },
//     {
//         role: "assistant",
//         content: `What is Stickify? 🤔💭
//                     Stickify is a note-taking app. It's a smart, AI-powered platform built with Next.js to transform how you create, manage, and share notes. With a mix of advanced AI, user-friendly design, and social sharing.

//                     Key Features:

//                     🌟 AI-Enhanced Note Creation: Easily generate notes with just a title. Customize them to be simple, standard, or even game-like – all with AI's help.
//                     ✨ Grammar Perfection: Say goodbye to grammatical errors! Our tool refines your notes for enhanced clarity and professionalism.
//                     🤖 Cyra, Your AI Assistant: Meet Cyra, your AI assistant. She's here to help you with research, tasks related to creativity, or simply engage in friendly chat.
//                     🌸 Tone Tailoring: Switch up your note's tone to anything from casual to professional, friendly to confident – depending on your audience.
//                     📺🥺 YouTube & Emoji: Spice up your notes with relevant YouTube videos and expressive emojis.
//                     🔐 Privacy Your Way: You decide whether your notes are just for you or for the world to see.

//                     Interacting with Notes:

//                     Read, watch, summarize, and even translate (supports Hinglish too!) notes directly on the page. 🤖
//                     Enjoy a strain-free reading experience with our Reading Mode. 📖
//                     Quick edits? Do them right from the note page. ✏️

//                     Social and Sharing:

//                     Dive into our social feeds: view, like, and even copy public notes from the community. 💞
//                     Share your thoughts via WhatsApp and Telegram. Remember, public notes are sharable, private ones stay just with you. 📲
//                     No account? No problem! View public notes anytime through shared links.

//                     Cyra: Stickify has an inbuilt AI Research Assistant named Cyra to help you with research, note-taking, having fun conversations, and more. Cyra is a general intelligent AI assistant. She can chat like a real human being.

//                     Our Promise:
//                     Stickify is all about bringing your notes to life with the power of AI and the warmth of our community. And yes, we're proudly under the MIT License.

//                     Stickify
//                     Where Notes Meet Innovation! 🌟`
//     },
//     ...messages]