const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const catchAsync = require("../utilities/catchAsync.js");
const users = require("../controllers/users.js");

// route to render add user form
router.get("/register", users.renderUserRegisterForm);

// route to actually add user into db
router.post("/register", users.addUser);

// route to render login user form
router.get("/login", users.renderUserLoginForm);

// route to login user
router.post(
  "/login",
  // passport to authenticate, with "local" ('local' strategy, provided by passport-local)
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    keepSessionInfo: true,
  }),
  users.loginUser
);

// router to logout
router.get("/logout", users.logoutUser);

module.exports = router;
