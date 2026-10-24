import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true },
    Progress: { type: String, required: true },
    aiResponse: { type: String, required: true },
    aiFeedback: { type: String, default: null },
    grammaticalMistakesCount: { type: Number, default: 0 },
    wpm: { type: Number, default: 0 },
    userSpeechDuration: { type: Number, default: 0 },
    fillerCount: { type: Number, default: 0 },
    fluencyScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProgressModel =
  mongoose.models.Progress || mongoose.model("progress", progressSchema);

export default ProgressModel;
