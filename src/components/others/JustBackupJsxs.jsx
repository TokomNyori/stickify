

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