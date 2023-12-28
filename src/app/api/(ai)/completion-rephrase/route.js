import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function POST(request) {
    const { geyi } = await request.json();

    console.log('Chat Completion API Triggered')
    console.log('body:', geyi)

    const response = await openai.chat.completions.create(geyi);

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}