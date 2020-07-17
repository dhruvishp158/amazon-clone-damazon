const router = require("express").Router();
const User = require("../models/user");
const passport = require("passport");
const passportConfig = require("../config/passport");
const async = require("async");
const Cart = require("../models/cart");
router.get("/signup", function (req, res) {
  res.render("accounts/signup", {
    errors: req.flash("errors"),
  });
});

router.post("/signup", function (req, res, next) {
  async.waterfall([
    function (callback) {
      let user = new User();
      user.profile.name = req.body.name;
      user.password = req.body.password;
      user.email = req.body.email;
      user.profile.picture = user.gravatar();

      User.findOne({ email: req.body.email }, function (err, existingUser) {
        if (existingUser) {
          req.flash("errors", "Email address already exist");
          return res.redirect("/signup");
        } else {
          user.save(function (err, user) {
            if (err) return next(err);
            // return res.redirect("/");
            callback(null, user);
          });
        }
      });
    },
    function (user) {
      let cart = new Cart();
      cart.owner = user._id;
      cart.save(function (err) {
        if (err) return next(err);
        req.logIn(user, function (err) {
          if (err) return next(err);
          res.redirect("/profile");
        });
      });
    },
  ]);
});

router.get("/login", function (req, res) {
  //   if (req.user) return res.redirect("/");
  res.render("accounts/login", { message: req.flash("loginMessage") });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/profile", passportConfig.isAuthenticated, function (req, res) {
  User.findOne({ _id: req.user._id })
    .populate("history.item")
    .exec(function (err, foundUser) {
      if (err) return next(err);
      res.render("accounts/profile", { user: foundUser });
    });
  //   res.json(req.user);
});

router.get("/logout", function (req, res, next) {
  req.logOut();
  res.redirect("/");
});

router.get("/edit-profile", function (req, res, next) {
  res.render("accounts/edit-profile.ejs", { message: req.flash("success") });
});
router.post("/edit-profile", function (req, res, next) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err) return next(err);

    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.address) user.address = req.body.address;

    user.save(function (err) {
      if (err) return next(err);
      req.flash("success", "Successfully Edited your profile");
      return res.redirect("edit-profile");
    });
  });
});

//facebook
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);
module.exports = router;
