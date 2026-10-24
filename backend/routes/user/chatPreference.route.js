import express from "express";
import {
  upsertChatPreference,
  getChatPreferences,
} from "../../controllers/user/chatPreference.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
const router = express.Router();

const AdminAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
];

// Private routes
router.get("/", AdminAuthMiddlewares, getChatPreferences);
router.post("/upsert", AdminAuthMiddlewares, upsertChatPreference);

export default router;
