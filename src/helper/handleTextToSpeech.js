'use server'
import fs from "fs";
import path from "path";
import OpenAI from "openai";

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