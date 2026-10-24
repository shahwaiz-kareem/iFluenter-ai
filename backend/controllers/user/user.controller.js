import UserOtpModel from "../../models/userOtp.model.js";
import UserModel from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendVerificationOtp from "../../utils/user/sendVerificationOtp.js";
import generateTokens from "../../utils/user/generateTokens.js";
import setTokenCookies from "../../utils/user/setTokenCookies.js";
import UserRefreshTokenModel from "../../models/userRefreshToken.model.js";
import transporter from "../../config/nodemailer.config.js";
import { cachedData } from "../../utils/cache/cacheFromDB.js";

class userController {
  // User Registration
  static userRegistration = async (req, res) => {
    try {
      const { name, email, password, confirmationPassword } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }

      if (password !== confirmationPassword) {
        return res.status(400).json({
          status: "failed",
          message: "Password and confirm Password don't match",
        });
      }

      const dbUser = await UserModel.findOne({ email });

      if (dbUser) {
        return res.status(409).json({
          status: "failed",
          message: "User already exists with this email. Choose another.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });
      //generate tokens
      const {
        accessToken,
        refreshToken,
        refreshTokenExpiry,
        accessTokenExpiry,
      } = await generateTokens(newUser);
      // set cookies

      setTokenCookies(res, {
        accessToken,
        refreshToken,
        refreshTokenExpiry,
        accessTokenExpiry,
      });
      sendVerificationOtp(newUser);

      res.status(201).json({
        status: "success",
        message:
          "You have been registered successfully! Get your OTP from your email.",
        user: { name: newUser.name, email: newUser.email, _id: newUser._id },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to register, please try again later!",
      });
    }
  };

  // User login
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }

      const existingUser = await UserModel.findOne({ email }).lean();
      // console.log(existingUser);
      if (!existingUser) {
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid email or password!" });
      }

      const verify = await bcrypt.compare(password, existingUser.password);
      if (!verify) {
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid email or password!" });
      }

      const userObj = {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        age: existingUser.age,
        roles: existingUser.roles,
        isOnboarded: existingUser.isOnboarded,
        isVerified: existingUser.isVerified,
        // isProUser:
        //   existingUser.subscriptionStatus === "active" &&
        //   Date.now() < new Date(existingUser.subscriptionEndsAt).getTime(),
      };

      if (!existingUser.isVerified) {
        // sendVerificationOtp(existingUser);
        return res.status(200).json({
          status: "success",
          user: existingUser,
          message:
            "Verification Required! You need to verify your account before logging in. Please verify yourself first to proceed.",
        });
      }
      //generate tokens
      const {
        accessToken,
        refreshToken,
        refreshTokenExpiry,
        accessTokenExpiry,
      } = await generateTokens(existingUser);
      // set cookies

      setTokenCookies(res, {
        accessToken,
        refreshToken,
        refreshTokenExpiry,
        accessTokenExpiry,
      });

      res.status(200).json({
        status: "success",
        message: "Login successful!",
        user: userObj,
        accessToken,
        refreshToken,
        refreshTokenExpiry,
        isAuth: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Something went wrong, please try again.",
      });
    }
  };

  static userProfile = async (req, res) => {
    if (!req.user.isVerified) sendVerificationOtp(req.user);
    let config = cachedData.systemConfig;
    // console.log("config data is :", config);
    res.status(200).json({
      user: {
        ...req.user,
        subscriptionExpired:
          !req.user.subscriptionEndsAt ||
          new Date() > new Date(req.user.subscriptionEndsAt),
      },
      systemConfig: {
        totalEarlyUsers: config.totalEarlyUsers,
        isEarlyPhase: config.isEarlyPhase,
        earlyUsersLimit: config.earlyUsersLimit,
      },
      message: "Profile fetched successfully!",
      status: "success",
    });
  };

  static updateUser = async (req, res) => {
    try {
      const { _id } = req.user._id;

      if (!_id) {
        return res
          .status(400)
          .json({ status: "failed", message: "Access denied!" });
      }

      let user = await UserModel.findOne({ _id }).select("-password");

      if (!user) {
        return res
          .status(400)
          .json({ status: "failed", message: "user not found" });
      }

      const filteredBody = {
        name: req.body?.name,
        proficiencyLevel: req.body?.proficiencyLevel,
        ageRange: req.body?.ageRange,
        theme: req.body?.theme,
        practiceFrequency: req.body?.practiceFrequency,
        goals: req.body?.goals,
        nativeLanguage: req.body?.nativeLanguage,
        isOnboarded: true,
      };

      const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        {
          $set: filteredBody,
        },
        {
          new: true,
        }
      );

      res.status(201).json({
        status: "success",
        message: "You profile has been updated successfully!",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to onboard, please try again later!",
      });
    }
  };

  static userLogout = async (req, res) => {
    try {
      await UserRefreshTokenModel.deleteMany({ userId: req.user._id });

      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res.clearCookie("isAdmin");
      res.clearCookie("isOnboarded");

      res.status(200).json({
        status: "success",
        message: "You have been logged out successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Something went wrong, please try again.",
      });
    }
  };
  static changeUserPassword = async (req, res) => {
    try {
      const { password, confirmationPassword, oldPassword } = req.body;

      if (!password || !confirmationPassword || !oldPassword)
        return res.status(400).json({
          status: "failed",
          message: "All fields are required!",
        });

      const user = await UserModel.findOne({ _id: req.user._id });
      const verify = await bcrypt.compare(oldPassword, user.password);

      if (!verify)
        return res.status(400).json({
          status: "failed",
          message: "Your existing password is incorrect!",
        });

      if (password !== confirmationPassword)
        return res.status(400).json({
          status: "failed",
          message: "Passwords didn't match!",
        });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { password: hashedPassword } }
      );

      res.status(200).json({
        status: "success",
        message: "Your password has been changed successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Something went wrong, please try again.",
      });
    }
  };

  static resetUserEmail = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(400).json({
          status: "failed",
          message: "Email field is required!",
        });

      const user = await UserModel.findOne({ email });

      if (user)
        return res.status(400).json({
          status: "failed",
          message: "The provided email already exists!",
        });

      const mailRes = await sendVerificationOtp(req.user, email);
      if (!mailRes.success)
        return res.status(400).json({
          status: "failed",
          message: "Something went wrong, please try again! ",
        });

      await UserModel.findByIdAndUpdate(req.user._id, {
        $set: {
          resetEmail: email,
          isVerified: false,
        },
      });
      res.status(200).json({
        status: "success",
        user: user,
        message: "Please verify your email to reset!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Something went wrong, please try again.",
      });
    }
  };
  // User Email verification

  static userEmailVerification = async (req, res) => {
    try {
      const { email } = req.user;
      const { otp } = req.body;
      const isResendReq = req.headers["request-action"] === "resend";
      // console.log(req.headers.resendRequest);
      if (!email || (!isResendReq && !otp)) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required!" });
      }

      const existingUser = await UserModel.findOne({ email });

      const { resetEmail } = existingUser;

      if (!existingUser) {
        return res.status(400).json({
          status: "failed",
          message: "Your email is incorrect.",
        });
      }

      if (existingUser.isVerified) {
        return res.status(400).json({
          status: "failed",
          message: "Your account is already verified.",
        });
      }

      if (isResendReq) {
        sendVerificationOtp(existingUser);
        return res.status(200).json({
          status: "success",
          message: `A new OTP has been sent to your email, please check your email and enter the new otp!`,
        });
      }

      const userOtpData = await UserOtpModel.findOne({
        userId: existingUser._id,
        otp,
      });

      if (!userOtpData) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid OTP!",
        });
      }

      // If otp is valid, check the otp's expire period else send otp again.
      const currentDate = Date.now();
      const expiryDate =
        new Date(userOtpData.createdAt).getTime() + 1000 * 60 * 10;

      if (currentDate > expiryDate) {
        if (!existingUser.isVerified) {
          sendVerificationOtp(existingUser);
        }
        return res.status(400).json({
          status: "failed",
          message:
            "Your OTP has expired, a new OTP has been sent to your email. Please enter the new code below to proceed.!",
        });
      }
      await UserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            isVerified: true,
            email: existingUser.resetEmail || existingUser.email,
            signupSource: resetEmail ? "Email" : existingUser.signupSource,
            resetEmail: null,
          },
        }
      );
      await UserOtpModel.deleteMany({ userId: existingUser });

      return res.status(200).json({
        status: "success",
        redirect: resetEmail ? "/dashboard" : "/onboarding",
        message: "Your verification has been completed successfully!.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Something went wrong, please try again later.",
      });
    }
  };

  static sendUserResetEmail = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email)
        return res.status(400).json({
          status: "failed",
          message: "Email field is required!",
        });

      const user = await UserModel.findOne({ email });

      if (!user)
        return res.status(400).json({
          status: "failed",
          message: "User does not exist!",
        });
      const secret = user._id + process.env.JWT_ACCESS_TOKEN_KEY;
      const token = jwt.sign({ userId: user._id }, secret, {
        expiresIn: "10m",
      });

      const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/?_id=${user._id}&token=${token}`;
      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #eef2f7;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
          }

          .otp-container {
            background: #ffffff;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
          }

          .otp-container h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: #4caf50;
          }

          .otp-container h2 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: #333;
          }

          .otp-container p {
            margin-bottom: 0.5rem;
            font-size: 1rem;
            line-height: 1.6;
          }


          .otp-link {
            display: inline-block;
            background: #4caf50;
            color: white !important;
            padding: 0.5rem 1.5rem;
            border-radius: 5px;
            text-decoration: none;
            font-size: 1rem;
            font-weight: bold;
            transition: background-color 0.3s ease;
          }

          .otp-link:hover {
            background: #388e3c;
          }

          .footer {
            margin-top: 1.5rem;
            font-size: 0.9rem;
            color: #666;
            line-height: 1.4;
          }

          .footer a {
            color: #4caf50;
            text-decoration: none;
            font-weight: bold;
          }

          .footer a:hover {
            text-decoration: underline;
          }

          .otp-code {
            display: inline-block;
            background: #f4f4f4;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-size: 1.2rem;
            font-weight: bold;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="otp-container">
          <h1>Welcome to iFluenter!</h1>
          <h2>Dear ${user.name},</h2>
          <p></p>
          <p>To reset your password, please click the link below</p>
          <a href="${resetLink}" class="otp-link">Reset</a>
          <p>Your link will automatically expire after 10 minutes. If you haven't request this link, please ignore this email.</p>
          <p>Thanks</p>
          <div class="footer">
            Need help? Contact our support team at:
            <a href="mailto:${process.env.CONTACT_EMAIL}">${process.env.CONTACT_EMAIL}</a>
          </div>
        </div>
      </body>
      </html>`;

      await transporter.sendMail({
        from: `iFluenter <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Reset Your Password",
        html,
      });

      res.status(200).json({
        status: "success",
        message: "We have sent reset link to your email, please check it out!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Something went wrong, please try again.",
      });
    }
  };

  static resetUserPassword = async (req, res) => {
    try {
      const { password, confirmationPassword } = req.body;
      const { _id, token } = req.query;

      if (!_id || !token)
        return res.status(400).json({
          status: "failed",
          message: "Invalid parameters!",
        });

      const newSecret = _id + process.env.JWT_ACCESS_TOKEN_KEY;
      jwt.verify(token, newSecret);

      if (!password || !confirmationPassword)
        return res.status(400).json({
          status: "failed",
          message: "All fields are required!",
        });

      if (password !== confirmationPassword)
        return res.status(400).json({
          status: "failed",
          message: "Passwords didn't match!",
        });

      const user = await UserModel.findOne({ _id });

      if (!user)
        return res.status(400).json({
          status: "failed",
          message: "No user found with this email, please check you email!",
        });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await UserModel.findOneAndUpdate(
        { _id },
        { $set: { password: hashedPassword } }
      );

      res.status(200).json({
        status: "success",
        message: "Your password has been reset successfully!",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(500).json({
          status: "failed",
          message: "Reset link expired. Please request a new reset link~",
        });
      } else {
        return res.status(500).json({
          status: "failed",
          message: "Unable to reset password. Please try again.",
        });
      }
    }
  };
}

export default userController;
