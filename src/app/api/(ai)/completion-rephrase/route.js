import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'edge'

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY

export async function POST(request) {
    const { geyi } = await request.json();

    const { messages, model, temperature, max_tokens } = geyi

    console.log(messages)

    const systemContent = messages[0].content
    const userContent = messages[1].content

    console.log(systemContent)
    console.log(userContent)

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
        const modelConfig = genAI.getGenerativeModel(
            {
                model: model,
                generationConfig: {
                    maxOutputTokens: max_tokens,
                    temperature: temperature,
                },
                systemInstruction: systemContent,
            }
        )

        const streamResponse = await modelConfig.generateContentStream(userContent)

        const stream = GoogleGenerativeAIStream(streamResponse)
        return new StreamingTextResponse(stream)
    } catch (error) {
        console.error("GeminiAI Error:", error)
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }
}