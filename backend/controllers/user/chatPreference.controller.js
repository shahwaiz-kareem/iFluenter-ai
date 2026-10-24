import chatPreferencesModel from "../../models/chatPreferences.model.js";
import ChatModel from "../../models/chat.model.js";
import { cachedData } from "../../utils/cache/cacheFromDB.js";
class ChatPreferenceController {
  static getChatPreferences = async (req, res) => {
    try {
      const { chatMode } = req.query;
      const preferences = await chatPreferencesModel
        .findOne({ userId: req.user._id })
        .populate("avatar")
        .populate("env")
        .lean();

      const recentChats = await ChatModel.find({
        userId: req.user._id,
        mode: chatMode,
      })
        .sort("-updatedAt")
        .select("_id topic")
        .limit(5)
        .lean();

      const isAdmin = req.user.roles.includes("admin");
      const userTier = !req.user.subscriptionExpired ? "pro" : "free";

      const avatars = cachedData.avatars.filter(
        (avatar) =>
          isAdmin ||
          userTier === "pro" ||
          (userTier === "free" && avatar.forTier === "free")
      );

      const envs = cachedData.envs.filter(
        (env) =>
          isAdmin ||
          userTier === "pro" ||
          (userTier === "free" && env.forTier === "free")
      );
      // console.log(preferences);
      res.status(200).json({
        status: "success",
        ...preferences,
        recentChats,
        avatars,
        envs,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "Server error",
      });
    }
  };

  static upsertChatPreference = async (req, res) => {
    try {
      const { chatSettings, chatMode } = req.body;
      // console.log("settings", chatSettings);
      const isAdmin = req.user.roles.includes("admin");
      const userTier = !req.user.subscriptionExpired ? "pro" : "free";
      await ChatModel.updateOne(
        {
          _id: chatSettings?.selectedChat,
        },
        { $set: { updatedAt: new Date() } }
      );

      const recentChats = await ChatModel.find({
        userId: req.user._id,
        mode: chatMode,
      })
        .sort("-updatedAt")
        .select("_id topic")
        .limit(5)
        .lean();

      const updatedPref = await chatPreferencesModel
        .findOneAndUpdate(
          { userId: req.user._id },
          {
            $set: { ...chatSettings },
          },
          { upsert: true, new: true }
        )
        .lean();

      const avatars = cachedData.avatars.filter(
        (avatar) =>
          isAdmin ||
          userTier === "pro" ||
          (userTier === "free" && avatar.forTier === "free")
      );

      const envs = cachedData.envs.filter(
        (env) =>
          isAdmin ||
          userTier === "pro" ||
          (userTier === "free" && env.forTier === "free")
      );

      res.status(200).json({
        status: "success",
        data: { ...updatedPref, avatars, envs, recentChats },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "something went wrong",
      });
    }
  };
}

export const { getChatPreferences, upsertChatPreference } =
  ChatPreferenceController;
