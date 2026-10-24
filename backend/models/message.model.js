import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    aiResponse: { type: String, required: true },
    aiFeedback: { type: Object, default: null },
    grammaticalMistakesCount: { type: Number, default: 0 },
    wpm: { type: Number, default: 0 },
    userSpeechDuration: { type: Number, default: 0 },
    fillerCount: { type: Number, default: 0 },
    fluencyScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MessageModel =
  mongoose.models.message || mongoose.model("message", MessageSchema);

export default MessageModel;
