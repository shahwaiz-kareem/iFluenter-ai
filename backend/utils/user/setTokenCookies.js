import jwt from "jsonwebtoken";

const setTokenCookies = (
  res,
  { accessToken, refreshToken, refreshTokenExpiry, accessTokenExpiry }
) => {
  const now = Math.floor(Date.now() / 1000);
  const accessTokenMaxAge = (accessTokenExpiry - now) * 1000;
  const refreshTokenMaxAge = (refreshTokenExpiry - now) * 1000;
  const hostname = new URL(process.env.FRONTEND_HOST.toString()).hostname;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    domain: `.${hostname}`,
    path: "/",
    maxAge: accessTokenMaxAge,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    domain: `.${hostname}`,
    path: "/",
    maxAge: refreshTokenMaxAge,
  });

  // console.log("cookies are set");

  const tokenDetails = jwt.decode(refreshToken);
  if (tokenDetails.roles.includes("admin")) {
    res.cookie("isAdmin", "admin", {
      httpOnly: true,
      secure: true,
      domain: `.${hostname}`,
      sameSite: "lax",
      path: "/",
      maxAge: refreshTokenMaxAge,
    });
  }
};

export default setTokenCookies;
