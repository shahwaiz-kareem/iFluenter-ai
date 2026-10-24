import MessageModel from "../../models/message.model.js";
import { getLlamaResponse } from "../../utils/chat/generateAIResponse/groqLLM.js";
import { getLLMPrompt } from "../../utils/shared/prompt.js";

// console.log(new Date());
class messageController {
  static getMessages = async (req, res) => {
    try {
      const { chatId, pageNo, pageLimit, msgsBeforeDate } = req?.query;
      if (!chatId || !pageLimit || !pageNo)
        return res.status(400).json({
          status: "failed",
          message: "All fields are required",
        });

      const now = new Date();

      const messages = await MessageModel.find({
        chatId,
        userId: req?.user?._id,
        createdAt: { $lt: msgsBeforeDate || now },
      })
        .sort("-createdAt")
        .skip((pageNo - 1) * pageLimit)
        .limit(pageLimit)
        .exec();
      // console.log(messages);

      res.status(200).json({
        status: "success",
        data: messages,
        // allMsgsFetched: msgRemainingStatus <= 0,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "failed",
        message: "something went wrong!",
      });
    }
  };
  static getFeedback = async (req, res) => {
    try {
      const { message, messageId } = req.body;
      if (!message)
        return res.status(400).json({
          status: "failed",
          message: "All fields are required",
        });

      const prompt = getLLMPrompt({
        promptFor: "feedback",
        isOutputJson: true,
      });

      const feedback = await getLlamaResponse({
        isStream: false,
        message,
        prompt,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "message_feedback",
            // strict: true,
            schema: {
              type: "object",
              properties: {
                grammarIssues: {
                  type: "array", // Removed "null"
                  items: {
                    type: "object",
                    properties: {
                      issueType: { type: "string" },
                      original: { type: "string" },
                      corrected: { type: "string" },
                      explanation: { type: "string" },
                    },
                    required: [
                      "issueType",
                      "original",
                      "corrected",
                      "explanation",
                    ],
                    additionalProperties: false,
                  },
                },
                vocabularyIssues: {
                  type: "array", // Removed "null"
                  items: {
                    type: "object",
                    properties: {
                      issueType: { type: "string" },
                      word: { type: "string" },
                      suggestion: { type: "string" },
                      reason: { type: "string" },
                    },
                    required: ["issueType", "word", "suggestion", "reason"],
                    additionalProperties: false,
                  },
                },
                coherenceIssues: {
                  type: "array", // Removed "null"
                  items: {
                    type: "object",
                    properties: {
                      issueType: { type: "string" },
                      original: { type: "string" },
                      problem: { type: "string" },
                      suggestion: { type: "string" },
                    },
                    required: [
                      "issueType",
                      "original",
                      "problem",
                      "suggestion",
                    ],
                    additionalProperties: false,
                  },
                },
                eitherSay: { type: "string" },
              },
              required: [
                "grammarIssues",
                "vocabularyIssues",
                "coherenceIssues",
                "eitherSay",
              ],
              additionalProperties: false,
            },
          },
        },
      });
      await MessageModel.findByIdAndUpdate(messageId, {
        $set: { aiFeedback: feedback },
      });

      res.status(200).json({ status: "success", data: feedback });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "failed",
        message: "something went wrong!",
      });
    }
  };
}

export const { getMessages, getFeedback } = messageController;
