import express from "express";
import {
  createBackground,
  getBackgrounds,
  deleteBackground,
} from "../../controllers/user/background.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
const router = express.Router();

const AdminAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
];

// Private routes
router.get("/getAll", AdminAuthMiddlewares, getBackgrounds);
router.post("/create", AdminAuthMiddlewares, createBackground);
router.delete("/delete", AdminAuthMiddlewares, deleteBackground);

export default router;
