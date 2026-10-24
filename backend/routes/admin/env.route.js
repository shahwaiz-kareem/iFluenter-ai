import express from "express";
import envController from "../../controllers/admin/envs.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
import adminCheckMiddleware from "../../middlewares/user/adminCheckMiddleware.js";
const router = express.Router();

const { upsertEnv, getEnvs } = envController;

const adminAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
  adminCheckMiddleware,
];

// Admin routes
router.get("/envs", adminAuthMiddlewares, getEnvs);
router.post("/upsert", adminAuthMiddlewares, upsertEnv);

export default router;
