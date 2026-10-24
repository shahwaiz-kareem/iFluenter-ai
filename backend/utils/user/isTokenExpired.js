import jwt from "jsonwebtoken";

const isTokenExpired = (token) => {
  if (!token) return true;
  const tokenDetails = jwt.decode(token);
  const currentDate = Math.floor(Date.now() / 1000);
  return tokenDetails.exp < currentDate;
};

export default isTokenExpired;
