// messageHandler.js

import { fillerWords } from "../../constants/socketService.js";
import ChatSessionModel from "../../models/chatSession.model.js";
import MessageModel from "../../models/message.model.js";
import { getLlamaResponse } from "../../utils/chat/generateAIResponse/groqLLM.js";
import STTProcessor from "../../utils/chat/speechToText/STTProcessor.js";
import sendToUnrealSpeech from "../../utils/chat/textToSpeech/unrealSpeech.js";
import { calculateFluencyScore } from "../../utils/services/socket/calculateFluencyScore.js";
import { getWavHeader } from "../../utils/shared/getWavHeader.js";
import { getLLMPrompt } from "../../utils/shared/prompt.js";

export const proMessageHandler = (socket) => {
  if (!socket.isProUser) return;
  const fireAndForget = (promise) => {
    promise.catch((err) => console.error("Background Task Error:", err));
  };
  let audioChunks = [];
  let requestId = 0;
  socket.on(
    "message",
    async (message, { chatMessages, userSpeechDuration }) => {
      try {
        const { chatId } = socket?.chatPreferences;
        const { _id: userId } = socket?.user;

        if (JSON.parse(chatMessages).length < 5) {
          chatMessages = await getChatMessages({ chatId, userId });
        }

        const prompt = getLLMPrompt({
          promptFor: socket.chatPreferences.chatMode,
          data: {
            user: socket.user,
            ...socket.chatPreferences,
            chatMessages,
          },
          isOutputJson: false,
        });

        //console.log("This is chat pr", prompt);
        const llamaResponse = await getLlamaResponse({
          prompt,
          message,
          isStream: false,
        });

        sendToUnrealSpeech({
          text: llamaResponse.trim(),
          socket,
        });

        socket.totalMessages = socket?.totalMessages + 1;

        MessageModel.create({
          chatId,
          userId,
          message,
          aiResponse: llamaResponse,
          userSpeechDuration: userSpeechDuration || 0,
        })
          .then((userMessage) => {
            socket.emit("user-message", userMessage);
          })
          .catch((err) => console.error("Message Save Error:", err));

        fireAndForget(
          ChatSessionModel.findByIdAndUpdate(socket?.currentSession?._id, {
            $inc: { spokenDuration: userSpeechDuration || 0, messages: 1 },
            $set: { endedAt: new Date() },
          }).exec()
        );
      } catch (error) {
        console.error("Message error:", error);
        socket.emit("failure", "Something went wrong!");
      }
    }
  );
  socket.on("inspire", async ({ chatMessages }) => {
    try {
      const { _id: userId } = socket?.user;
      // console.log(isFreeUser);
      const { chatId } = socket.chatPreferences;
      if (JSON.parse(chatMessages).length === 0) {
        chatMessages = await getChatMessages({ chatId, userId });
      }
      const prompt = getLLMPrompt({
        promptFor: "inspire",
        data: {
          user: socket.user,
          ...socket.chatPreferences,
          chatMessages,
        },
        isOutputJson: false,
      });

      const llamaResponse = await getLlamaResponse({
        isStream: false,
        prompt,
      });

      sendToUnrealSpeech({
        text: llamaResponse.trim(),
        socket,
      });

      fireAndForget(
        ChatSessionModel.findByIdAndUpdate(socket?.currentSession?._id, {
          $inc: { inspires: 1, messages: 1 },
          $set: { endedAt: new Date() },
        }).exec()
      );
      socket.totalMessages = socket?.totalMessages + 1;
    } catch (error) {
      console.error("Message error:", error);
      socket.emit("failure", "Something went wrong!");
    }
  });

  socket.on("audio-chunk", (audioData) => {
    audioChunks.push(audioData);
  });

  socket.on("speech-canceled", () => {
    audioChunks = [];
  });

  socket.on("speech-ended", async ({ chatMessages, userSpeechDuration }) => {
    const rawPCM = Buffer.concat(audioChunks);
    const header = getWavHeader(rawPCM.length, 16000);
    let audioBuff = Buffer.concat([header, rawPCM]);
    audioChunks = [];

    try {
      if (!socket.isProUser)
        return socket.emit("failure", "Please upgrade to pro");
      console.time("groqSTTLatency" + requestId);
      const sttResponse = await STTProcessor(
        audioBuff,
        "en",
        socket.chatPreferences.topic
      );
      console.timeEnd("groqSTTLatency" + requestId);

      audioBuff = null;

      const transcription = sttResponse.text?.trim();
      // console.log("transcript", transcription);

      const chatId = socket.chatPreferences.chatId;
      const { _id: userId } = socket?.user;

      if (JSON.parse(chatMessages).length === 0) {
        chatMessages = await getChatMessages({ chatId, userId });
      }

      if (transcription) {
        const prompt = getLLMPrompt({
          promptFor: socket.chatPreferences.chatMode,
          data: {
            user: socket.user,
            ...socket.chatPreferences,
            chatMessages,
          },
          isOutputJson: true,
        });

        console.time("groqLLMLatency" + requestId);

        const llamaResponse = await getLlamaResponse({
          prompt,
          message: transcription,
          isStream: false,
          response_format: {
            // strict: true,
            type: "json_schema",
            json_schema: {
              name: "message_response",
              schema: {
                type: "object",
                properties: {
                  userMessageResponse: { type: "string" },
                  grammaticalMistakesCount: { type: "number" },
                },
                required: ["userMessageResponse", "grammaticalMistakesCount"],
                additionalProperties: false,
              },
            },
          },
        });

        console.timeEnd("groqLLMLatency" + requestId);

        if (!llamaResponse)
          return socket.emit("failure", "Something went wrong!");

        sendToUnrealSpeech({
          text: llamaResponse?.userMessageResponse?.trim(),
          socket,
          requestId,
        });

        const wpm = transcription.split(" ").length / (userSpeechDuration / 60);

        let fillerCount = 0;
        fillerWords.forEach((w) => {
          fillerCount += (
            transcription.match(new RegExp(`\\b${w}\\b`, "gi")) || []
          ).length;
        });

        const fluencyScore = calculateFluencyScore(
          wpm,
          Number(llamaResponse.grammaticalMistakesCount),
          fillerCount
        );
        // console.log("The scores", userSpeechDuration, fluencyScore);

        const userMessage = MessageModel.create({
          chatId,
          userId,
          message: transcription,
          aiResponse: llamaResponse?.userMessageResponse?.trim(),
          grammaticalMistakesCount:
            Number(llamaResponse.grammaticalMistakesCount) || 0,
          fluencyScore,
          wpm,
          fillerCount,
          userSpeechDuration,
        });

        socket.totalMessages = socket?.totalMessages + 1;
        requestId++;

        fireAndForget(
          ChatSessionModel.findByIdAndUpdate(socket?.currentSession?._id, {
            $inc: { spokenDuration: userSpeechDuration || 0, messages: 1 },
            $set: { endedAt: new Date() },
          }).exec()
        );

        userMessage
          .then((data) => {
            socket.emit("user-message", data);
          })
          .catch((err) => console.error("Message Save Error:", err));
      } else {
        socket.emit("failure", "No speech detected");
      }
    } catch (error) {
      console.error("error: audio-full", error);
      socket.emit("failure", "Something went wrong?");
    }
  });
};

const getChatMessages = async ({ chatId, userId }) => {
  const chatMessages = await MessageModel.find({ chatId, userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .exec();
  return JSON.stringify(
    chatMessages.map((msg) => ({
      userMessage: msg.message,
      aiResponse: msg.aiResponse,
    }))
  );
};
