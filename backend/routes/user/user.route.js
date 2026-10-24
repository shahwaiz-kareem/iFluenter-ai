import express from "express";
import userController from "../../controllers/user/user.controller.js";
import accessTokenRefresh from "../../middlewares/user/accessTokenRefresh.middleware.js";
import passport from "passport";
import { checkAccountStatus } from "../../middlewares/user/checkAccountStatus.js";
const router = express.Router();

const {
  userRegistration,
  userEmailVerification,
  userLogin,
  userProfile,
  updateUser,
  userLogout,
  changeUserPassword,
  sendUserResetEmail,
  resetUserPassword,
  resetUserEmail,
} = userController;

const userAuthMiddlewares = [
  accessTokenRefresh,
  passport.authenticate("jwt", { session: false }),
];

// Public routes
router.post("/register", userRegistration);
router.post("/login", userLogin);
router.post("/reset-password-link", sendUserResetEmail);
router.post("/reset-password-confirm", resetUserPassword);

// Private routes
router.get("/profile", userAuthMiddlewares, userProfile);
router.put("/update", userAuthMiddlewares, updateUser);
router.post("/change-password", userAuthMiddlewares, changeUserPassword);
router.post("/reset-email", userAuthMiddlewares, resetUserEmail);
router.post("/verify-email", userAuthMiddlewares, userEmailVerification);
router.post("/logout", userAuthMiddlewares, userLogout);

export default router;
