import { cachedData } from "../../cache/cacheFromDB.js";

export const checkLimitReached = (socket) => {
  let limitReached = false;
  const isProUser = socket.isProUser;
  const systemConfig = cachedData.systemConfig;

  const FREE_USER_MESSAGES_LIMIT = systemConfig.freeUserMessagesLimit;

  const PRO_USER_MESSAGES_LIMIT = systemConfig.proUserMessagesLimit;

  const userMessageLimit = !isProUser
    ? FREE_USER_MESSAGES_LIMIT
    : PRO_USER_MESSAGES_LIMIT;

  const totalSessionMessages = socket?.totalMessages;

  if (totalSessionMessages >= userMessageLimit) {
    socket.rateLimitExceeded = "messages";
    limitReached = true;
  }

  if (socket.rateLimitExceeded) {
    socket.emit("rate-limit-exceeded", socket.rateLimitExceeded);
    socket.disconnect();
  }

  return {
    limitReached,
    totalSessionMessages,
  };
};
