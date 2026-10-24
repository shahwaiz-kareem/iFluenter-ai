import mongoose from "mongoose";
const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  spokenDuration: { type: Number, default: 0 },
  messages: { type: Number, default: 0 },
  inspires: { type: Number, default: 0 },
  ua: { type: Object, required: true },
  ip: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  chatMode: { type: String },
  endedAt: { type: Date, default: Date.now },
});

const ChatSessionModel =
  mongoose.models.chatSession ||
  mongoose.model("chatSession", chatSessionSchema);

export default ChatSessionModel;
