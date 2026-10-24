import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, max: 30, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },

    resetEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true, minlength: 8, trim: true },
    isVerified: { type: Boolean, default: false },
    roles: { type: [String], enum: ["user", "admin"], default: ["user"] },

    proficiencyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advance"],
      default: "beginner",
    },
    ageRange: {
      type: String,
      enum: ["10-15", "16-20", "21-30", "31-40", "41-50", "50+"],
      default: "21-30",
    },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    practiceFrequency: {
      type: String,
      enum: ["daily", "weekly", "randomly"],
      default: "daily",
    },
    goals: {
      type: [String],
      validate: {
        validator: (value) => value.length > 0,
        message: "You have to select at least one goal.",
      },
      default: ["goal_1"],
    },
    signupSource: {
      type: String,
      enum: ["Google", "Facebook", "Email", "Other"],
      default: "Email",
    },
    nativeLanguage: String,

    visitSource: {
      type: String,
      enum: [
        "Google search",
        "Facebook",
        "Youtube",
        "Advertisement",
        "Instagram",
        "Reddit",
        "Discord",
        "Chatgpt",
        "Recommended by someone",
        "Other",
      ],
      default: "Other",
    },
    isOnboarded: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    loginCount: { type: Number, default: 0 },
    subscriptionStatus: { type: String, default: "free" },
    nextPaymentDate: { type: Date, default: null },
    subscriptionEndsAt: { type: Date, default: null },
    subscriptionCreatedAt: { type: Date, default: null },
    renewsAt: { type: Date, default: null },

    subscriptionId: Number,
    productId: Number,
    variantId: String,
    productName: String,
    variantName: String,
    cardBrand: String,
    // updatePaymentMethod: String,
    // customerPortal: String,
    eventName: String,
  },
  { timestamps: true }
);

const UserModel = mongoose.models.user || mongoose.model("user", userSchema);

export default UserModel;
