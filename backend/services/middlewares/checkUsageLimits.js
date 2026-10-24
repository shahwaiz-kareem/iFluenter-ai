import ChatSessionModel from "../../models/chatSession.model.js";
import { cachedData } from "../../utils/cache/cacheFromDB.js";
export const checkUsageLimits = async (socket, next) => {
  try {
    // console.log("inside free users limit");
    const isProUser = socket.isProUser;
    const systemConfig = cachedData.systemConfig;

    const FREE_USER_MESSAGES_LIMIT = systemConfig.freeUserMessagesLimit;
    const PRO_USER_MESSAGES_LIMIT = systemConfig.proUserMessagesLimit;

    let totalUsedSeconds = 0;
    let totalMessages = 0;

    // if (socket.isProUser) return next();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    const sessions = await ChatSessionModel.find({
      userId: socket?.user?._id,
      createdAt: { $gte: today, $lt: tomorrow },
    });
    // console.log(sessions);

    totalMessages = sessions.reduce((acc, session) => {
      return acc + session.messages + session.inspires;
    }, 0);

    const userMessageLimit = !isProUser
      ? FREE_USER_MESSAGES_LIMIT
      : PRO_USER_MESSAGES_LIMIT;

    if (totalMessages >= userMessageLimit) {
      socket.rateLimitExceeded = "messages";
    } else {
      socket.totalUsedSeconds = totalUsedSeconds;
      socket.totalMessages = totalMessages;
    }

    next();
  } catch (error) {
    console.log(error);
    socket.disconnect();
    socket.emit(
      "failure",
      "Oops! we got an unexpected issue, Please try again."
    );
    next(new Error("Unable to check limits"));
  }
};
