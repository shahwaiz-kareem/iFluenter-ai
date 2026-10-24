import express from "express";
import userController from "../../controllers/admin/user.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
import adminCheckMiddleware from "../../middlewares/user/adminCheckMiddleware.js";
const router = express.Router();

const { getUsers, updateUser, searchUser, getUser } = userController;

const adminAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
  adminCheckMiddleware,
];

// Admin routes
router.get("/user", adminAuthMiddlewares, getUser);
router.get("/users", adminAuthMiddlewares, getUsers);
router.get("/search", adminAuthMiddlewares, searchUser);
router.put("/update", adminAuthMiddlewares, updateUser);

export default router;
