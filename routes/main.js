const router = require("express").Router();
const Product = require("../models/product");
const Cart = require("../models/cart");
const async = require("async");
const user = require("../models/user");
const stripe = require("stripe")(
  "sk_test_51H50w7LOJkrpYleYrtQi10IyHeRbt2c6KcTQ92rD0MMW3W7zwNpECNtznB9ZJYbso14Jq8gnU1oOuuqRWoDWfkut00TPsgyPP3"
);

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

router.get("/cart", function (req, res, next) {
  Cart.findOne({ owner: req.user._id })
    .populate("items.item")
    .exec(function (err, foundCart) {
      if (err) return next(err);
      res.render("main/cart", {
        message: req.flash("remove"),
        foundCart: foundCart,
      });
    });
});

router.post("/product/:product_id", function (req, res, next) {
  Cart.findOne({ owner: req.user._id }, function (err, cart) {
    cart.items.push({
      item: req.params.product_id,
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(req.body.quantity),
    });
    cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
    cart.save(function (err) {
      if (err) next(err);
      return res.redirect("/cart");
    });
  });
});

router.post("/remove", function (req, res, next) {
  console.log(String(req.body.item));
  Cart.findOne({ owner: req.user._id }, function (err, foundCart) {
    foundCart.items.pull(String(req.body.item));
    console.log(foundCart.total);
    foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
    foundCart.save(function (err, found) {
      if (err) return next(err);
      req.flash("remove", "Successfully removed");
      res.redirect("/cart");
    });
  });
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

//payment
router.post("/payment", function (req, res, next) {
  let stripeToken = req.body.stripeToken;
  let currentCharges = Math.round(req.body.stripeMoney * 100);
  console.log("token: " + stripeToken + " and charges: " + currentCharges);
  stripe.customers
    .create({
      source: stripeToken,
    })
    .then(function (customer) {
      return stripe.charges.create({
        amount: currentCharges,
        currency: "CAD",
        customer: customer.id,
      });
    })
    .then(function (charge) {
      async.waterfall([
        function (callback) {
          Cart.findOne({ owner: req.user._id }, function (err, cart) {
            callback(err, cart);
          });
        },
        function (cart, callbck) {
          user.findOne({ _id: req.user._id }, function (err, user) {
            if (user) {
              for (let i = 0; i < cart.items.length; i++) {
                user.history.push({
                  item: cart.items[i].item,
                  paid: cart.items[i].price,
                });
              }
              user.save(function (err, user) {
                if (err) return err;
                callbck(err, user);
              });
            }
          });
        },
        function (user) {
          Cart.update(
            { owner: user._id },
            { $set: { items: [], total: 0 } },
            function (err, updated) {
              if (updated) {
                res.redirect("profile");
              }
            }
          );
        },
      ]);
    });
});

module.exports = router;
