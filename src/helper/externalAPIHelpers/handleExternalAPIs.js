
// import fs from "fs";
// import path from "path";
// import OpenAI from "openai";

// API KEYS
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

//OPENAI API
export async function openAiGptTextGeneration({ gptData }) {
    const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(gptData)
    })

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

// export async function openAiGptTextGeneration({ gptData: gptData }) {
//     const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
//     try {
//         const res = await openai.chat.completions.create(gptData);
//         console.log(res)
//         return res.choices[0].message.content
//     } catch (error) {
//         console.log('error chat completion')
//         console.log(error.error.message)
//         return error.error.message
//     }
// }

export const handleTextToSpeech = async ({ text }) => {
    const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
    const speechFile = path.resolve("./speech.mp3");

    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "onyx",
        input: `${'Hello, this is Tokom. I am a software developer!!! Yes! Yes I am! And I feel so good about it!'}`,
    });
    console.log(speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
}

//YOUTUBE API
export async function youtubeOneVideotHelper({ method, title, headers }) {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?type=video&q=${title}&maxResults=3&videoDuration=medium&relevanceLanguage=en&part=snippet&key=${YOUTUBE_API_KEY}`,
        {
            method: method,
            headers: headers
        })

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export async function youtubeTenVideotHelper({ method, title, headers }) {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?type=video&q=${title}&maxResults=15&relevanceLanguage=en&part=snippet&key=${YOUTUBE_API_KEY}`,
        {
            method: method,
            headers: headers
        })

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}