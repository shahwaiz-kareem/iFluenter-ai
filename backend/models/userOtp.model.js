import mongoose from "mongoose";

const userOtpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "10m" },
});

const UserOtpModel =
  mongoose.models.userOtp || mongoose.model("userOtp", userOtpSchema);

export default UserOtpModel;
