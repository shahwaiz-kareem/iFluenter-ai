import Groq from "groq-sdk";
import { Readable } from "stream";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export async function getLlamaResponse({
  prompt = "",
  isStream = false,
  message = "",
  response_format = null,
}) {
  const groqChat = await getGroqChat({
    isStream,
    prompt,
    message,
    response_format,
  });
  if (isStream) {
    const responseStream = new Readable({ read: () => {} });

    let responseChunk = "";

    for await (const chunk of groqChat) {
      responseChunk += chunk.choices[0]?.delta?.content || "";

      if (
        (responseChunk.endsWith(",") ||
          responseChunk.endsWith("!") ||
          responseChunk.endsWith(".") ||
          responseChunk.endsWith("?")) &&
        !/^\$?\d+(?:[.,]\d*)?$/.test(responseChunk.split(" ").at(-1)) &&
        responseChunk.split(" ").length > 3
      ) {
        responseStream.push(responseChunk);
        responseChunk = "";
      }
    }

    if (responseChunk.length > 0) {
      responseStream.push(responseChunk);
    }
    responseStream.push(null);

    return responseStream;
  } else {
    return response_format
      ? JSON.parse(groqChat.choices[0].message.content || "{}")
      : groqChat.choices[0]?.message?.content || "";
  }
}

const getGroqChat = async ({ prompt, isStream, message, response_format }) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt,
      },

      {
        role: "user",
        content: `${message}`,
      },
    ],
    model: process.env.GROQ_AI_MODEL.toString() || "openai/gpt-oss-20b",
    stop: null,
    max_completion_tokens: 200,
    response_format,
    stream: isStream,
  });
};
