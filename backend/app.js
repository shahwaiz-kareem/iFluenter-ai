import jwt from "jsonwebtoken";

import express from "express";
import passport from "passport";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user/user.route.js";
import chatRouter from "./routes/user/chat.route.js";
import messageRouter from "./routes/user/message.route.js";
import systemConfigRouter from "./routes/systemConfig.route.js";
import progressRouter from "./routes/user/progress.route.js";
import preferencesRouter from "./routes/user/chatPreference.route.js";
import chatSessionRouter from "./routes/user/chatSession.route.js";
import subscriptionRouter from "./routes/user/subscription.route.js";
import adminUserRouter from "./routes/admin/user.route.js";
import adminAvatarRouter from "./routes/admin/avatar.route.js";
import adminEnvRouter from "./routes/admin/env.route.js";
import adminStatsRouter from "./routes/admin/stats.route.js";
import connectDb from "./config/db.config.js";
import "./config/passportJwt.config.js";
import "./config/passportGoogle.config.js";
import setTokenCookies from "./utils/user/setTokenCookies.js";
import { createServer } from "http";
import SocketService from "./services/socket.service.js";
import { refreshData } from "./utils/cache/cacheFromDB.js";

const app = express();
const server = createServer(app);
const socketService = new SocketService(server);

app.set("trust proxy", 1);
const frontendHost = new URL(process.env.FRONTEND_HOST.toString());
const allowedOrigins = [
  frontendHost.origin,
  `${frontendHost.protocol}//www.${frontendHost.host}`,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

await connectDb();
await refreshData("systemConfig", 1000 * 60 * 2);
await refreshData("assets", 1000 * 60 * 1); //Todo: make this 10 mins

app.use("/api/subscription/webhook", express.raw({ type: "*/*" }));
// app.get("/ping", (req, res) => {
//   res.status(200).send("pinged!");
// });

// Global middlewares
app.use(cors(corsOptions));
app.use("/api/admin", express.json({ limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(passport.initialize());

//TODO: if has free tier or expired paid tier show just one asset,
//  hint: separate assets files for free and paid users.

app.use("/api/system-config", systemConfigRouter);

app.use(
  "/assets",
  (req, res, next) => {
    const origin = req.headers.origin;
    if (origin === "localhost") {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Vary", "Origin");
    next();
  },
  express.static("uploads", {
    maxAge: 3600 * 24 * 30 * 1000,
  })
);

// Load routers
// Add this at the very top of your Express middleware/routes
// app.use((req, res, next) => {
//   console.log(`BINGO! Backend hit: ${req.method} ${req.originalUrl}`);
//   next();
// });
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/preferences", preferencesRouter);
app.use("/api/message", messageRouter);
app.use("/api/progress", progressRouter);
app.use("/api/chat-session", chatSessionRouter);
app.use("/api/subscription", subscriptionRouter);
// Admin routes
app.use("/api/admin/user", adminUserRouter);
app.use("/api/admin/avatar", adminAvatarRouter);
app.use("/api/admin/env", adminEnvRouter);
app.use("/api/admin/stats", adminStatsRouter);

// Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_HOST}/sign-in`,
  }),
  async (req, res) => {
    const { accessToken, refreshToken, refreshTokenExpiry, accessTokenExpiry } =
      req.user;
    setTokenCookies(res, {
      accessToken,
      refreshToken,
      refreshTokenExpiry,
      accessTokenExpiry,
    });
    // console.log(req.user);
    const { isOnboarded } = req.user;
    res.redirect(
      `${process.env.FRONTEND_HOST}/${isOnboarded ? "dashboard" : `onboarding`}`
    );
  }
);

socketService.registerHandlers();

server.listen(process.env.PORT, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}`);
});
