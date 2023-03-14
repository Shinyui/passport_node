const express = require("express");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");
const { registerAndLoginSchema } = require("../validation/joi");

const authRouter = express.Router();

authRouter.route("/register").post(async (req, res) => {
  try {
    const value = await registerAndLoginSchema.validateAsync({ ...req.body });
    const user = await User.find({ email: value.email });

    if (user.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "user alreay exists",
      });
    }

    if (user.length === 0) {
      const hased_password = await bcrypt.hash(value.password, 10);

      User.create({
        email: value.email,
        password: hased_password,
      });

      return res.status(StatusCodes.CREATED).json({
        message: "user created",
      });
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
});

authRouter.route("/login").post((req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message,
      });
    }

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "please cjeck email or password again it might be wrong or not included",
      });
    }

    // when using a custom callback, it becomes the application's responsibility
    // to establish a session (by calling req.login()) and send a response."
    // docs: https://www.passportjs.org/concepts/authentication/login/

    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.redirect("/profile");
    });
  })(req, res, next);
});

authRouter.route("/logout").post((req, res, next) => {
  req.logout((error) => {
    if (error) {
      next(error);
    }

    res.status(StatusCodes.ACCEPTED);
    res.redirect("/profile");
  });
});

module.exports = authRouter;
