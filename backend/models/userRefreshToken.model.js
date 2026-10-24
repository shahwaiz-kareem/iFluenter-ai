import mongoose from "mongoose";

const userRefreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
  token: { type: String, required: true },
  isRevoked: { type: Boolean, default: false },
  revokedAt: { type: Date },
  blacklisted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: "20d" },
});

const UserRefreshTokenModel =
  mongoose.models.userRefreshToken ||
  mongoose.model("userRefreshToken", userRefreshTokenSchema);

export default UserRefreshTokenModel;
