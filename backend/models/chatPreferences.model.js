import mongoose from "mongoose";

const chatPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    avatar: { type: mongoose.Schema.Types.ObjectId, ref: "avatar" },
    env: { type: mongoose.Schema.Types.ObjectId, ref: "env" },
    accent: { type: String, enum: ["us", "uk", "au", "in"], default: "us" },
    difficulty: {
      type: String,
      enum: ["easy", "normal", "hard"],
      default: "normal",
    },
    speechSpeed: { type: Number, min: -2, max: 2, default: 0 },
    redemptionMs: { type: Number, min: 300, max: 3000, default: 1500 },
    captionsActive: { type: Boolean, default: true },
    voiceControl: { type: String, enum: ["manual", "auto"], default: "manual" },
  },
  { timestamps: true }
);

export default mongoose.models.chatPreference ||
  mongoose.model("chatPreference", chatPreferencesSchema);
