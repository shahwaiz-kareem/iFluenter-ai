import mongoose from "mongoose";

const AvatarSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    url: { type: String, required: true, trim: true, unique: true },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
      trim: true,
    },
    preview: { type: String, required: true },
    bio: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    forTier: { type: String, enum: ["free", "pro"], default: "pro" },
    voiceId: { type: String, required: true },
    actModes: { type: [String], default: ["conversation"] },
  },

  { timestamps: true }
);

const AvatarModel =
  mongoose.models.avatar || mongoose.model("avatar", AvatarSchema);

export default AvatarModel;
