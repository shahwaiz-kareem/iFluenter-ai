import express from "express";
import { setWebhook } from "../../controllers/user/subscription.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
const router = express.Router();

const AuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
];

// Private routes
router.post("/webhook", setWebhook);

export default router;
