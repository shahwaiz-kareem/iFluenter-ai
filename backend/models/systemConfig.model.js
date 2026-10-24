import mongoose from "mongoose";

const systemConfigSchema = new mongoose.Schema(
  {
    bannerData: {
      bannerId: { type: Date, default: Date.now },
      content: String,
      activeEndpoints: { type: Array, required: true },
    },
    freeUserMessagesLimit: { type: Number, default: 40 },
    freeUserUsageTimeLimit: { type: Number, default: 10 },
    proUserMessagesLimit: { type: Number, default: 300 },
  },

  { timestamps: true }
);

const SystemConfigModel =
  mongoose.models.systemConfig ||
  mongoose.model("systemConfig", systemConfigSchema);

export default SystemConfigModel;
