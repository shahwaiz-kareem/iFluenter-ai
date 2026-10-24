import express from "express";
import avatarController from "../../controllers/admin/avatar.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
import adminCheckMiddleware from "../../middlewares/user/adminCheckMiddleware.js";
const router = express.Router();

const { getAvatars, upsertAvatar } = avatarController;

const adminAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
  adminCheckMiddleware,
];

// Admin routes
router.get("/avatars", adminAuthMiddlewares, getAvatars);
router.post("/upsert", adminAuthMiddlewares, upsertAvatar);

export default router;
