import refreshUserAccessToken from "../../utils/user/refreshUserAccessToken.js";
import isTokenExpired from "../../utils/user/isTokenExpired.js";
import setTokenCookies from "../../utils/user/setTokenCookies.js";
const accessTokenRefresh = async (req, res, next) => {
  try {
    //Get refresh token and generate access token;
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // console.log("1 token", refreshToken.slice(-4));

    if (accessToken && !isTokenExpired(accessToken)) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
    }

    if (!accessToken || isTokenExpired(accessToken)) {
      if (!refreshToken) throw new Error("Access denied!");
      const {
        newAccessToken,
        newRefreshToken,
        newRefreshTokenExpiry,
        newAccessTokenExpiry,
      } = await refreshUserAccessToken(req, res);

      setTokenCookies(res, {
        accessToken: newAccessToken,
        accessTokenExpiry: newAccessTokenExpiry,
        refreshToken: newRefreshToken,
        refreshTokenExpiry: newRefreshTokenExpiry,
      });

      req.headers["authorization"] = `Bearer ${newAccessToken}`;
    }

    next();
  } catch (error) {
    // console.error(error);
    const statusCode = error.statusCode || 401;
    // if (statusCode === 403) res.clearCookie();
    res.status(statusCode).json({
      status: "failed",
      message: error.message || "Access denied!",
    });
  }
};

export default accessTokenRefresh;
