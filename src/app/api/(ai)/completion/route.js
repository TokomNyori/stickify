import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from "openai-edge";

export const runtime = 'edge'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// const config = new Configuration({
//     apiKey: OPENAI_API_KEY
// });

// const openai = new OpenAIApi(config);

export async function POST(request) {
    console.log('Completion API Triggered')
    const { geyi } = await request.json();

    const response = await openai.chat.completions.create(geyi);

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}