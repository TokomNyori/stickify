import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from "openai-edge";

export const runtime = 'edge'
//export const runtime = 'nodejs';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// const config = new Configuration({
//     apiKey: OPENAI_API_KEY
// });

// const openai = new OpenAIApi(config);

export async function POST(request) {
    const { geyi, messages } = await request.json();

    console.log('body:', geyi)

    const response = await openai.chat.completions.create(geyi);

    // const response = await openai.chat.completions.create({
    //     messages: [
    //         { "role": "system", "content": "You are a helpful assistant." },
    //         { "role": "user", "content": geyi },
    //     ],
    //     model: "gpt-3.5-turbo",
    //     stream: true,
    // }
    // );

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);

    // for await (const chunk of response) {
    //     const data = chunk.choices[0]?.delta?.content || "";
    //     rrr.write('data: ' + 'Heeelllooooo!!!!!!\n\n');
    // }
}