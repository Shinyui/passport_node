const express = require("express");
const { StatusCodes } = require("http-status-codes");

const profileRouter = express.Router();

profileRouter.route("/").get((req, res) => {
  if (req.isUnauthenticated()) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "you're not logged in",
    });
  }

  if (req.isAuthenticated()) {
    return res.status(StatusCodes.OK).json({
      message: "your in",
      user: req.user,
      session: req.session,
    });
  }
});

module.exports = profileRouter;
