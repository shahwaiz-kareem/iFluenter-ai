import mongoose from "mongoose";

const EnvSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    preview: { type: String, required: true, trim: true },
    forTier: {
      type: String,
      enum: ["free", "pro"],
      trim: true,
      required: true,
    },
    actModes: { type: [String], default: ["conversation"] },
    isActive: { type: Boolean, default: false },
  },

  { timestamps: true }
);

const EnvModel = mongoose.models.env || mongoose.model("env", EnvSchema);

export default EnvModel;
