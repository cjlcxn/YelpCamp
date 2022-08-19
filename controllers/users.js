const User = require("../models/user.js");

module.exports.renderUserRegisterForm = (req, res) => {
  res.render("users/register.ejs");
};

module.exports.addUser = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    // create new user, but dont include password field
    const user = new User({ username, email });
    // hashes the password, and adds it to the unfinished "user" document, AND save() to db
    const registeredUser = await User.register(user, password);
    // login the newly created registeredUser document
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome for the first time, ${req.user.username}`);
      res.redirect("/campgrounds");
    });
  } catch (err) {
    // remember the mongoose middleware - that changes err.message for email uniqueness
    // hadles 2 error: "MongoServerError" - is for email uniqueness,
    // "UserExistsError" - is for user uniquenesss, which err.message already customized by passport.
    if (err.name === "MongoServerError" || err.name === "UserExistsError") {
      req.flash("error", err.message);
      res.redirect("/register");
    } else next(err);
  }
};

module.exports.renderUserLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", `Welcome, ${req.user.username}`);
  // returnTo is the route visitor was on, before he was redirected to login page. if that x exist, then default route.
  const redirectUrl = req.session.returnTo || "/campgrounds";
  // deletes the returnTo ppt in session
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  // passport added method, logs user out (clear session and req.user)
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out!");
    res.redirect("/campgrounds");
  });
};
