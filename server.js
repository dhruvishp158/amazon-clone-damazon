const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const User = require("./models/user");
const ejs = require("ejs");
const engine = require("ejs-mate");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const flash = require("express-flash");
const mainRoutes = require("./routes/main");
const userRoutes = require("./routes/user");
const secret = require("./config/secret");
const adminRoutes = require("./routes/admin");
const Category = require("./models/category");
const apiRoutes = require("./api/api");
const cartLength = require("./middleware/middlewares");
const customize = require("./routes/customize");
const path = require(path);
connectDB();

//middleware
app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({ url: secret.database, autoReconnect: true }),
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(cartLength);
app.use(function (req, res, next) {
  Category.find({}, function (err, categories) {
    if (err) return next(err);
    res.locals.categories = categories;
    next();
  });
});
app.engine("ejs", engine);
app.set("view engine", "ejs");

//routes
app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use(customize);
app.use("/api", apiRoutes);
//PRODUCTION
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}
app.listen(secret.port, function (err) {
  if (err) throw err;
  console.log("server is running on port 3000");
});
