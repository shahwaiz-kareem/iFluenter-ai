import express from "express";
import {
  createAvatar,
  getAllAvatars,
  deleteAvatar,
} from "../../controllers/user/avatar.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
const router = express.Router();

const AdminAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
];

// Private routes
router.get("/getAll", AdminAuthMiddlewares, getAllAvatars);
router.post("/create", AdminAuthMiddlewares, createAvatar);
router.delete("/delete", AdminAuthMiddlewares, deleteAvatar);

export default router;
