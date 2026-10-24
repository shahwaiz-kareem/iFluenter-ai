import UserModel from "../../models/user.model.js";
import cookie from "cookie";
import verifyRefreshToken from "../../utils/user/verifyRefreshToken.js";

export const authenticate = async (socket, next) => {
  try {
    // console.log("inside auth middleware");
    const cookieStr = socket.handshake.headers.cookie;
    const refreshToken = cookie.parse(cookieStr || "").refreshToken;
    const { tokenDetails } = await verifyRefreshToken(refreshToken);
    const user = await UserModel.findById(tokenDetails._id)
      .select("-password")
      .lean();
    // const systemConfig = cachedData.systemConfig;
    socket.user = user;
    // socket.systemConfig = systemConfig;
    if (new Date() < new Date(user.subscriptionEndsAt)) {
      socket.isProUser = true;
    }
    // console.log(
    //   "current date:",
    //   new Date(),
    //   "end date:",
    //   new Date(user.subscriptionEndsAt),
    //   "user sub status:",
    //   user.subscriptionEndsAt,
    //   "user active:",
    //   new Date() < new Date(user.subscriptionEndsAt),
    //   "isUserPro:",
    //   socket.isProUser
    // );

    next();
  } catch (error) {
    console.log(error);
    socket.disconnect();
    socket.emit("failure", "Unauthorized Access!");
    next(new Error("Unauthorized Access!"));
  }
};
