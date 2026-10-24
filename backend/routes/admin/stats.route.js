import express from "express";
import statsController from "../../controllers/admin/stats.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
import adminCheckMiddleware from "../../middlewares/user/adminCheckMiddleware.js";
const router = express.Router();

const { getStats } = statsController;

const adminAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
  adminCheckMiddleware,
];

// Admin routes
router.get("/", adminAuthMiddlewares, getStats);

export default router;
