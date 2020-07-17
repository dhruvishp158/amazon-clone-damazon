const passport = require("passport");
const user = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const FaceBookStrategy = require("passport-facebook").Strategy;
const secret = require("../config/secret");
const Cart = require("../models/cart");
const async = require("async");
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

//===================FaceBook============

passport.use(
  new FaceBookStrategy(secret.facebook, function (
    token,
    refreshToken,
    profile,
    done
  ) {
    User.findOne({ facebook: profile.id }, function (err, user) {
      if (err) return done(err);

      if (user) {
        return done(null, user);
      } else {
        async.waterfall([
          function (callback) {
            let newUser = new User();
            newUser.email = profile._json.email;
            newUser.facebook = profile.id;
            newUser.tokens.push({ kind: "facebook", token: token });
            newUser.profile.name = profile.displayName;
            newUser.profile.picture =
              "https://graph.facebook.com/" +
              profile.id +
              "/picture?type=large";

            newUser.save(function (err) {
              if (err) throw err;
              callback(err, newUser._id);
            });
          },
          function (newUser) {
            let cart = new Cart();
            cart.owner = newUser._id;
            cart.save(function (err) {
              if (err) return done(err);
              return done(err, newUser);
            });
          },
        ]);
      }
    });
  })
);

//custom function to validate
exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};
