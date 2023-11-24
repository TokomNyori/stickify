'use server'
import OpenAI from "openai";

//const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function openAiGptTextGeneration({ gptData: gptData }) {
    const openai = new OpenAI();
    try {
        const res = await openai.chat.completions.create(gptData);
        console.log(res)
        return res
    } catch (error) {
        console.log('error chat completion')
        console.log(error.error.message)
        return error.error.message
    }

    // if (res !== 200) {
    //     console.log(' error chat completion')
    //     console.log(res)
    //     throw new Error('Could not generate')
    // }
}

// export async function openAiTTSHelper({ method, headers, body }) {
//     const res = await fetch("https://api.openai.com/v1/audio/speech", {
//         method: method,
//         headers: headers,
//         body: JSON.stringify(body)
//     })

//     if (!res.ok) {
//         const errorData = await res.json();
//         console.log(errorData)
//         throw new Error(errorData.message)
//     }

//     return res.json()
// }