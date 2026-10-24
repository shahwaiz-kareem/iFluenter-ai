import { checkLimitReached } from "../../utils/services/socket/checkLimitReached.js";
import { chatSessionHandler } from "../handlers/chatSession.handler.js";
import { disconnectionHandler } from "../handlers/disconnection.handler.js";

export const rateLimit = async ({ event, args, next, socket }) => {
  const userEvents = ["speech-ended", "message", "inspire"];
  // console.log("I'm here", event, socket.user, socket.chatSession);
  //  Create a new chat session if not created!
  if (!userEvents.includes(event)) return next();
  if (!socket.sessionCreated) await chatSessionHandler(socket);

  const { limitReached } = checkLimitReached(socket);

  if (limitReached) {
    await disconnectionHandler(socket);
    return socket.disconnect();
  }

  // rate-limiting per connection
  const threshold = 500; // ms
  const now = Date.now();

  if (!socket.lastEmit) {
    socket.lastEmit = now;
    socket.violatedTimes = 0;
    return next();
  }

  const diff = now - socket.lastEmit;
  if (diff < threshold) {
    socket.emit("rate-limit-exceeded", "requests");
    if (socket.violatedTimes >= 5) socket.disconnect();
    socket.violatedTimes = socket.violatedTimes + 1;
    return;
  }

  socket.lastEmit = now;
  next();
};
