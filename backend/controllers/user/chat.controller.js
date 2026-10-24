import mongoose from "mongoose";
import ChatModel from "../../models/chat.model.js";

class chatController {
  static getChats = async (req, res) => {
    try {
      const { _id } = req.user;
      const { pageNo, pageLimit, excludeList, chatMode } = req?.query;
      // console.log("chatmode", chatMode);
      if (!pageLimit || !pageNo || !chatMode)
        return res.status(400).json({
          status: "failed",
          message: "All queries are required",
        });

      if (!_id)
        return res.status(400).json({
          status: "failed",
          message: "user not found!",
        });

      const chats = await ChatModel.find({
        userId: _id,
        chatId: { $nin: excludeList ? excludeList.split(",") : [] },
        mode: chatMode,
      })
        .sort("-updatedAt")
        .select("_id topic")
        .skip((pageNo - 1) * pageLimit)
        .limit(pageLimit)
        .exec();

      res.status(200).json({ status: "success", chats });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "something went wrong, please try again later!",
      });
    }
  };

  static upsertChat = async (req, res) => {
    try {
      const { chatId, chatMode, topic } = req.body;

      if (!req.user._id)
        return res.status(400).json({
          status: "failed",
          message: "user not found!",
        });
      const newChat = await ChatModel.updateOne(
        { _id: chatId ?? new mongoose.Types.ObjectId() },
        { mode: chatMode, topic, userId: req.user._id },
        { upsert: true, new: true }
      );

      res.status(201).json({
        status: "success",
        message: "Operation successful!",
        data: newChat,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "something went wrong, please try again later!",
      });
    }
  };

  static deleteChat = async (req, res) => {
    try {
      const { chatId } = req.body;
      if (!chatId) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }

      await ChatModel.findByIdAndDelete(chatId);

      return res.status(200).json({
        status: "success",
        message: "Chat deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "something went wrong, please try again later!",
      });
    }
  };
}

export const { getChats, upsertChat, deleteChat } = chatController;
