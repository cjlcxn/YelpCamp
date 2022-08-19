// only configure the .env file, if we are in development phase
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

////////////////////////////importing modules///////////////////////////////////////////
// importing npm packages
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");

// importing own modules
const User = require("./models/user.js");
const { port, dbPath, secret } = require("./utilities/config.js");
const ExpressError = require("./utilities/ExpressError.js");

const usersRoutes = require("./router/users.js");
const campgroundsRoutes = require("./router/campground.js");
const reviewsRoutes = require("./router/review.js");
// const dbUrl = process.env.DB_URL;

////////////////////////////configuring middlewares/packages///////////////////////////////////
// To filter database injections
app.use(mongoSanitize());

// set express view engine to ejs, and configure its path when app runs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// parse incoming req.body, with 2 formats (3rd format - multer - is required in campgrounds router only)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// configure path of static files when app runs
app.use(express.static(path.join(__dirname, "/public")));

// configure custom request methods
app.use(methodOverride("_method"));

// set express app's viewEngine, with ejs-mate
app.engine("ejs", engine);

// set both session data storage options, and session options
const store = MongoStore.create({
  mongoUrl: dbPath,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});
const sessionOptions = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// configure express session with the options (req.session), and configure req.flash
app.use(session(sessionOptions));
app.use(flash());

// configure passport, and initialize passport with localStrategy (passport-local) set by passport-local-mongoose
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

(async function main() {
  try {
    await mongoose.connect(dbPath);
    console.log("connected to db");
  } catch (err) {
    console.log("mongo error, " + err);
  }
})();

app.use("/favicon.ico", (req, res, next) => {
  res.sendStatus(200);
});

// middleware to assign flash messages to req.locals
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// middleware for all campgrounds
app.use("/campgrounds", campgroundsRoutes);
// middleware for all reviews
app.use("/campgrounds/:id/reviews", reviewsRoutes);
// middleware for users
app.use("/", usersRoutes);

// route for main page
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// error catching for accessing "non-middleware handled" routes
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found"), 404);
});

// error handling, rendering error template
app.use((err, req, res, next) => {
  if (!err.message) err.message = "Oh No! smth went wrong";
  if (!err.status) err.status = 500;
  res.status(err.status).render("error.ejs", { err });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
