const router = require("express").Router();
const Product = require("../models/product");

Product.createMapping(function (err, mapping) {
  if (err) {
    console.log("error creating mapping");
    console.log("err");
  } else {
    console.log("mapping created");
    console.log(mapping);
  }
});

let stream = Product.synchronize();
let count = 0;

stream.on("data", function () {
  count++;
});
stream.on("close", function () {
  console.log("Index: " + count + " documents");
});
stream.on("error", function (err) {
  console.log(err);
});

router.post("/search", function (req, res, next) {
  console.log(req.body.q);
  res.redirect("/search?q=" + req.body.q);
});
router.get("/search", function (req, res, next) {
  if (req.query.q) {
    console.log(req.body.q);
    Product.search(
      {
        query_string: { query: req.query.q },
      },
      function (err, results) {
        if (err) return next(err);
        let data = results.hits.hits.map(function (hit) {
          return hit;
        });
        res.render("main/search-result", {
          query: req.query.q,
          data: data,
        });
      }
    );
  }
});

function paginate(req, res, next) {
  let perPage = 9;
  let page = req.params.page;

  Product.find()
    .skip(perPage * page)
    .limit(perPage)
    .populate("category")
    .exec(function (err, products) {
      if (err) return next(err);
      Product.count().exec(function (err, count) {
        if (err) return next(err);
        res.render("main/product-main", {
          products: products,
          pages: count / perPage,
        });
      });
    });
}
router.get("/", (req, res, next) => {
  if (req.user) {
    paginate(req, res, next);
  } else {
    res.render("main/home");
  }
});
router.get("/page/:page", function (req, res, next) {
  paginate(req, res, next);
});

router.get("/about", (req, res) => {
  res.render("main/about");
});

router.get("/products/:id", function (req, res, next) {
  Product.find({ category: req.params.id })
    .populate("category")
    .exec(function (err, products) {
      if (err) return next(err);
      res.render("main/category", {
        products: products,
      });
    });
});

router.get("/product/:id", function (req, res, next) {
  Product.findById({ _id: req.params.id }, function (err, product) {
    res.render("main/product", {
      product: product,
    });
  });
});

module.exports = router;
