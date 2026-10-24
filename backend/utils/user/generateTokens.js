import jwt from "jsonwebtoken";
import UserRefreshTokenModel from "../../models/userRefreshToken.model.js";

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id, roles: user.roles };
    const accessTokenExpiry = Math.floor(Date.now() / 1000) + 60 * 15;
    // const accessTokenExpiry = Math.floor(Date.now() / 1000) + 10;
    const accessToken = jwt.sign(
      { ...payload, exp: accessTokenExpiry },
      process.env.JWT_ACCESS_SECRET_KEY
    );
    const refreshTokenExpiry =
      Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 20;
    const refreshToken = jwt.sign(
      { ...payload, exp: refreshTokenExpiry },
      process.env.JWT_REFRESH_SECRET_KEY
    );

    await UserRefreshTokenModel.updateMany(
      { userId: user._id, isRevoked: false },
      {
        $set: {
          isRevoked: true,
          revokedAt: Date.now(),
        },
      }
    );

    await UserRefreshTokenModel.create({
      userId: user._id,
      token: refreshToken,
      isRevoked: false,
    });

    const cleanupTime = new Date(Date.now() - 60 * 1000);
    await UserRefreshTokenModel.deleteMany({
      userId: user._id,
      isRevoked: true,
      revokedAt: { $lt: cleanupTime },
    });

    return Promise.resolve({
      accessToken,
      refreshToken,
      refreshTokenExpiry,
      accessTokenExpiry,
    });
  } catch (error) {
    Promise.reject(error);
  }
};

export default generateTokens;
