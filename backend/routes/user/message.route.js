import express from "express";
import {
  getMessages,
  getFeedback,
} from "../../controllers/user/message.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
const router = express.Router();

const chatAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
];

// Private routes
router.get("/", chatAuthMiddlewares, getMessages);
router.post("/feedback", chatAuthMiddlewares, getFeedback);

export default router;
