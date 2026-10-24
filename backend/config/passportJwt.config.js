import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import UserModel from "../models/user.model.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_SECRET_KEY,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      if (!payload._id) {
        done(null, false);
      }
      const user = await UserModel.findOne({ _id: payload._id })
        .select("-password")
        .lean();

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      console.error(error);
      done(null, false);
    }
  })
);
