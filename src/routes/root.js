const express = require("express");
const { StatusCodes } = require("http-status-codes");

const rootRouter = express.Router();

rootRouter.route("/").get((req, res) => {
  res.status(StatusCodes.OK).json({ message: "server is up" });
});

module.exports = rootRouter;
