import express from "express";
import {
  getChatSessionsData,
  createChatSession,
} from "../../controllers/user/chatSession.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
const router = express.Router();

const chatAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
];

// Private routes
router.get("/get-stats", chatAuthMiddlewares, getChatSessionsData);
// router.post("/create", chatAuthMiddlewares, createChatSession);

export default router;
