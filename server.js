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
const flash = require("express-flash");
const mainRoutes = require("./routes/main");
const userRoutes = require("./routes/user");

connectDB();

//middleware
app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({ resave: true, saveUninitialized: true, secret: "dhruvishp158" })
);
app.use(flash());
app.engine("ejs", engine);
app.set("view engine", "ejs");

//routes
app.use(mainRoutes);
app.use(userRoutes);
app.listen(3000, function (err) {
  if (err) throw err;
  console.log("server is running on port 3000");
});
