export const checkAccountStatus = (req, res, next) => {
  const user = req.user;

  next();
};
