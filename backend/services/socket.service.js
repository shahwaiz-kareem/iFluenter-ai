import { Server } from "socket.io";
import { authenticate } from "./middlewares/authenticate.js";
import { checkUsageLimits } from "./middlewares/checkUsageLimits.js";
import { disconnectionHandler } from "./handlers/disconnection.handler.js";
import { rateLimit } from "./middlewares/rate-limit.js";
import { proMessageHandler } from "./handlers/proMessage.handler.js";
// import { freeMessageHandler } from "./handlers/freeMessage.handler.js";
export default class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_HOST,
        allowedHeaders: ["authorization"],
        transports: ["websocket", "polling"],
      },
    });

    this.io.use(authenticate);
    this.io.use(checkUsageLimits);

    this.io.engine.on("connection_error", (err) => {
      console.error("Socket.IO connection error:", err);
    });
    this.io.setMaxListeners(30);
  }

  registerHandlers() {
    this.io.on("connection", (socket) => {
      // console.log("connected");
      socket.use(([event, ...args], next) =>
        rateLimit({ event, args, next, socket })
      );

      //Check if user has reached the limits
      if (socket.rateLimitExceeded) {
        // console.log("inside rate limit check");
        socket.emit("rate-limit-exceeded", socket.rateLimitExceeded);
        socket.disconnect();
      }

      socket.on("chat-preferences", (data) => {
        // console.log("chat pere", data);
        socket.chatPreferences = data;
      });

      proMessageHandler(socket);
      // freeMessageHandler(socket);
      socket.on("disconnect", () => disconnectionHandler(socket));
    });
  }
}
