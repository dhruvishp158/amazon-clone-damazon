const router = require("express").Router();
const Category = require("../models/category");

router.get("/add-category", function (req, res, next) {
  res.render("admin/add-category", { message: req.flash("success") });
});

router.post("/add-category", function (req, res, next) {
  let category = new Category();
  category.name = req.body.name;
  category.save(function (err) {
    if (err) nect(err);
    req.flash("success", "successfully added a category");
    return res.redirect("/add-category");
  });
});

module.exports = router;
