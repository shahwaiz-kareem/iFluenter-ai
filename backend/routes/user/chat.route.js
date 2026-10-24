import express from "express";
import {
  upsertChat,
  getChats,
  deleteChat,
} from "../../controllers/user/chat.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
const router = express.Router();

const chatAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
];

// Private routes
router.get("/", chatAuthMiddlewares, getChats);
router.post("/upsert", chatAuthMiddlewares, upsertChat);
router.delete("/delete", chatAuthMiddlewares, deleteChat);

export default router;
