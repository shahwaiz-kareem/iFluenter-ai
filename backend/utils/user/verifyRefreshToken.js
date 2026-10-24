import jwt from "jsonwebtoken";
import UserRefreshTokenModel from "../../models/userRefreshToken.model.js";
const verifyRefreshToken = async (refreshToken) => {
  try {
    // check if expired

    const tokenDetails = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    // console.log("3 tokenDetails ", tokenDetails);

    const dbRefreshToken = await UserRefreshTokenModel.findOne({
      token: refreshToken.toString(),
    });

    // console.log("4 dbRefreshToken ", dbRefreshToken);

    if (!dbRefreshToken)
      throw {
        error: true,
        status: 401,
        message: "Invalid refresh token (DB)",
      };

    // check if valid token
    if (dbRefreshToken?.token !== refreshToken || dbRefreshToken?.blacklisted)
      throw { error: true, status: 401, message: "Unauthorized access!" };

    return {
      tokenDetails,
      error: false,
      message: "Valid token",
    };
  } catch (error) {
    // console.log("The main error", error);
    throw {
      ...error,
      error: true,
      status: error.status || 500,
      message: "Invalid refresh token",
    };
  }
};

export default verifyRefreshToken;
