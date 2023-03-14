const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const rootRouter = require("./routes/root");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const path = require("path");
const connectToMongo = require("./config/mongo");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("./config/passport");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", rootRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

const startServer = async () => {
  const PORT = 8000;

  try {
    await connectToMongo();

    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    });
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
    process.exit(error ? 1 : 0);
  }
};

startServer();
