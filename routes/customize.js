const router = require("express").Router();
const Product = require("../models/product");
const Cart = require("../models/cart");
const async = require("async");
const User = require("../models/user");
const passport = require("passport");
const passportConfig = require("../config/passport");
router.get("/cart-history", passportConfig.isAuthenticated, function (
  req,
  res
) {
  User.findOne({ _id: req.user._id })
    .populate("history.item")
    .exec(function (err, foundUser) {
      if (err) return next(err);
      res.render("customize/cartHistory", { user: foundUser });
    });
});

module.exports = router;
