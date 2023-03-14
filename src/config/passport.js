const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { registerAndLoginSchema } = require("../validation/joi");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      try {
        const value = await registerAndLoginSchema.validateAsync({
          email: username,
          password: password,
        });

        const user = await User.findOne({ email: value.email });

        if (!user) {
          return done(null, false);
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ email: id });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
