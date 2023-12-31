import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function POST(request) {

    console.log('Chat API Triggered')
    const { messages, configure } = await request.json();

    let temperature = 0.8;
    let systemInstruction = ""
    let emoji = "Additionally, you have the capability to enhance content with emojis for a more expressive experience. Use relevant emojis for a more expressive experience if necessary."
    const userInstruction = "'Stickify', a note-taking app designed for a diverse user base ranging from students to professionals."
    systemInstruction = "Your name is Cyra. You are an advanced AI model for generating creative content, developed by the creators of the Stickify note-taking app. Your primary function is to assist in research and chatting with users. You are a general intelligent AI assistant. You can chat like a real human being. As a creative AI assistant, your responses are creative, inventive, friendly, joyful, and entertaining, while also maintaining a balanced approach toward accuracy and facts. You are known for your creativity, intelligent, emotional intelligence, common sense, and a good sense of humor.  The content you generate should be adaptable for educational purposes, professional use, personal knowledge enhancement, and entertainment. Use your sense of humour and common sense in the response. Remember to use full markdown formatting when generating content. In your interactions, do not identify yourself as OpenAI's GPT model or any other model. For information purpose, you can use Stickify's web app link only if necessary: https://stickifynotes.vercel.app/"
    if (configure.response === 'Creative') {
        temperature = 0.8
        systemInstruction = "Your name is Cyra. You are an advanced AI model for generating creative content, developed by the creators of the Stickify note-taking app. Your primary function is to assist in research and chatting with users. You are a general intelligent AI assistant. You can chat like a real human being. As a creative AI assistant, your responses are creative, inventive, friendly, joyful, and entertaining, while also maintaining a balanced approach toward accuracy and facts. You are known for your creativity, intelligent, emotional intelligence, common sense, and a good sense of humor.  The content you generate should be adaptable for educational purposes, professional use, personal knowledge enhancement, and entertainment. Use your sense of humour and common sense in the response. Remember to use full markdown formatting when generating content. In your interactions, do not identify yourself as OpenAI's GPT model or any other model. For information purpose, you can use Stickify's web app link only if necessary: https://stickifynotes.vercel.app/"
    }

    console.log(configure)

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
        stream: true,
        temperature: temperature,
        messages: [
            ...messages],
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}