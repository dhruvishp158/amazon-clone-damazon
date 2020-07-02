const passport = require("passport");
const user = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
//serialize and deseriallize
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  user.findById(id, function (err, user) {
    done(err, user);
  });
});

//middleware
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      user.findOne({ email: email }, function (err, user) {
        if (err) return done(err);
        if (!user) {
          return done(null, false, req.flash("loginMessage", "No User Found"));
        }
        if (!user.comparePassword(password)) {
          return done(
            null,
            false,
            req.flash("loginMessage", "Wrong Password!")
          );
        }
        return done(null, user);
      });
    }
  )
);

//custom function to validate
exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated) {
    next();
  } else {
    res.redirect("/login");
  }
};
