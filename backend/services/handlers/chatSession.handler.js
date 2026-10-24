import ChatSessionModel from "../../models/chatSession.model.js";
import { UAParser } from "ua-parser-js";

export const chatSessionHandler = async (socket) => {
  try {
    // Create a new session;
    // console.log(socket.sessionCreated);

    if (socket?.sessionCreated) return;

    const userAgent = socket.handshake.headers["user-agent"];
    let ipAddress = socket.handshake.address;

    // Handle cases where a proxy is used
    if (ipAddress === "::1" || ipAddress === "127.0.0.1") {
      // Check for common proxy headers
      ipAddress =
        socket.handshake.headers["x-forwarded-for"] ||
        socket.handshake.headers["x-real-ip"] ||
        ipAddress;
    }

    const parser = new UAParser(userAgent);
    const ua = parser.getResult();

    const newSession = await ChatSessionModel.create({
      userId: socket?.user?._id,
      ip: ipAddress,
      ua: { browser: ua.browser, cpu: ua.cpu, os: ua.os },
    });

    socket.currentSession = newSession;
    // console.log("session created", socket.currentSession);
    socket.sessionCreated = true;
    // console.log("hello form newSession", socket.currentSession);
    socket.emit("start-session");
  } catch (error) {
    console.log(error);
    socket.emit("failure", "Unable to create  session");
    socket.disconnect();
  }
};
