import UserModel from "../../models/user.model.js";
import generateTokens from "./generateTokens.js";
import verifyRefreshToken from "./verifyRefreshToken.js";

const refreshUserAccessToken = async (req) => {
  try {
    // console.log("once or twice");
    const refreshToken = req.cookies.refreshToken;
    // console.log("2 token", refreshToken.slice(-4));

    const { error, tokenDetails, message } = await verifyRefreshToken(
      refreshToken
    );
    // console.log("5 verifyRefreshToken error", error);

    if (error) {
      const err = new Error(message);
      err.statusCode = 401;
      throw err;
    }

    const user = await UserModel.findById(tokenDetails._id);

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 401;
      throw err;
    }
    // console.log("6 user found");

    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      refreshTokenExpiry: newRefreshTokenExpiry,
      accessTokenExpiry: newAccessTokenExpiry,
    } = await generateTokens(user);
    // console.log(
    //   "7 tokens generated",
    //   "refreshToken",
    //   newRefreshToken.slice(-4)
    // );

    return Promise.resolve({
      newAccessToken,
      newRefreshToken,
      newRefreshTokenExpiry,
      newAccessTokenExpiry,
    });
  } catch (error) {
    console.log(error);
    const err = new Error("Something went wrong!");
    err.statusCode = 500;
    throw { ...error, err };
  }
};

export default refreshUserAccessToken;
