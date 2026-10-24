const adminCheckMiddleware = (req, res, next) => {
  const user = req.user;
  if (!user.roles.includes("admin")) {
    return res
      .status(403)
      .json({ status: "failed", message: "Access Denied!" });
  }
  next();
};

export default adminCheckMiddleware;
