// messageHandler.js

import ChatSessionModel from "../../models/chatSession.model.js";
import MessageModel from "../../models/message.model.js";
import { getLlamaResponse } from "../../utils/chat/generateAIResponse/groqLLM.js";

import { getLLMPrompt } from "../../utils/shared/prompt.js";

export const freeMessageHandler = (socket) => {
  if (socket.isProUser) return;
  socket.on(
    "message",
    async (message, { chatMessages, topic, userSpeechDuration }) => {
      try {
        const { chatId } = socket?.preferences;
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
            topic,
          },
          isOutputJson: false,
        });

        //console.log("This is chat pr", prompt);
        const llamaResponse = await getLlamaResponse({
          prompt,
          message,
          isStream: true,
        });

        let finalMsg = "";
        let chunksCount = 0;
        const onEndHandler = async () => {
          socket.emit("total-chunks", chunksCount);
          const userMessage = await MessageModel.create({
            chatId,
            userId,
            message,
            aiResponse: finalMsg,
            userSpeechDuration,
          });

          socket.emit("user-message", userMessage);

          await ChatSessionModel.findByIdAndUpdate(
            socket?.currentSession?._id,
            {
              $inc: {
                spokenDuration: userSpeechDuration || 0,
                messages: 1,
              },
              $set: {
                endedAt: new Date(),
              },
            }
          );
        };

        llamaResponse.on("data", (chunk) => {
          socket.emit("ai-response", chunk.toString());
          finalMsg += chunk.toString();
          chunksCount++;
        });

        llamaResponse.on("error", (error) => {
          console.error("AI Stream error:", error);
          socket.emit("failure", "AI response failed");
        });
        llamaResponse.on("end", onEndHandler);
      } catch (error) {
        console.error("Message error:", error);
        socket.emit("failure", "Something went wrong!");
      }
    }
  );
  socket.on("inspire", async ({ chatMessages, topic }) => {
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
          topic,
        },
        isOutputJson: false,
      });

      const llamaResponse = await getLlamaResponse({
        isStream: true,
        prompt,
      });

      let chunksCount = 0;
      const onEndHandler = async () => {
        socket.emit("total-chunks", chunksCount);
        await ChatSessionModel.findByIdAndUpdate(socket?.currentSession?._id, {
          $inc: {
            inspires: 1,
          },
          $set: {
            endedAt: new Date(),
          },
        });
      };
      llamaResponse.on("data", (chunk) => {
        socket.emit("ai-response", chunk.toString());
        chunksCount++;
      });

      llamaResponse.on("error", (error) => {
        console.error("AI Stream error:", error);
        socket.emit("failure", "AI response failed");
      });
      llamaResponse.on("end", onEndHandler);
    } catch (error) {
      console.error("Message error:", error);
      socket.emit("failure", "Something went wrong!");
    }
  });
};

const getChatMessages = async ({ chatId, userId }) => {
  const chatMessages = await MessageModel.find({ chatId, userId })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .limit(5)
    .exec();
  return JSON.stringify(
    chatMessages.map((msg) => ({
      userMessage: msg.message,
      aiResponse: msg.aiResponse,
    }))
  );
};
