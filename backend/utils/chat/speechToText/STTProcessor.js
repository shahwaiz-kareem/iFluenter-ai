// speechToText/STTProcessor.js
import Groq from "groq-sdk";
import { Buffer } from "buffer";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function STTProcessor(audioData, language = "en", topic) {
  const buffer = Buffer.from(audioData);
  const arrayBuffer = buffer.buffer;

  const transcription = await groq.audio.transcriptions.create({
    file: new File([arrayBuffer], "audio.wav", { type: "audio/wav" }),
    model: "whisper-large-v3-turbo",
    language,
    temperature: 0,
    prompt: `Verbatim transcription. Capture every word exactly as spoken, including grammatical errors, stutters, and filler words. Topic: ${topic}. Do not clean up the speech.`,
  });

  return transcription;
}
