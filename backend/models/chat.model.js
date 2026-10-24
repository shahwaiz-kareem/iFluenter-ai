import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    topic: { type: String, required: true },
    mode: { type: String, required: true },
  },
  { timestamps: true }
);

const ChatModel = mongoose.models.chat || mongoose.model("chat", chatSchema);

export default ChatModel;
