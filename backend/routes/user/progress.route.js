import express from "express";
import { getProgress } from "../../controllers/user/progress.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
const router = express.Router();

const chatAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
];

// Private routes
router.get("/get-stats", chatAuthMiddlewares, getProgress);
// router.get("/fluency-scores-week-data", chatAuthMiddlewares, getFluencyScores);

export default router;
