const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const Review = require("./models/review.js");
const catchAsync = require("./utilities/catchAsync.js");
const ExpressError = require("./utilities/ExpressError.js");

// to check if any user logged in atm (authentication)
module.exports.loggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // sets the original pre-redirected URL in the session, before visitor redirected to login page
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    res.redirect("/login");
  } else next();
};

// to check whether current logged in user is author of campground (authorization)
module.exports.isAuthor = (req, res, next) => {
  const camp = res.locals.queriedCamp;
  const currentUser = res.locals.currentUser;
  if (!currentUser || !camp.author._id.equals(currentUser._id)) {
    req.flash("error", "You do not have permission to do that!");
    res.redirect(`/campgrounds/${camp.id}`);
  } else {
    next();
  }
};

// to check whether current logged in user is author of REVIEW (authorization)
module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;
  const currentUser = res.locals.currentUser;
  // extract reviewId of review, search for it
  const review = await Review.findById(reviewId);

  if (!currentUser || !review.author._id.equals(currentUser._id)) {
    req.flash("error", "You do not have permission to do that!");
    res.redirect(`/campgrounds/${id}`);
  } else {
    next();
  }
});

//if the id length is shorter/ longer, invalid ID, and mongoose made error shown, throw btr looking error
module.exports.idInvalid = function (req, res, next) {
  ObjectID = mongoose.Types.ObjectId;
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    req.flash("error", "Invalid ID!");
    res.redirect("/campgrounds");
  } else next();
};

// if the id length is same, but no data queried from db
module.exports.isFound = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "Campground not found in database!");
    res.redirect("/campgrounds");
  } else {
    res.locals.queriedCamp = camp;
    next();
  }
});

// takes schema as argument, validates the req.body with joiSchema
module.exports.validate = function (joiSchema) {
  return function (req, res, next) {
    const { error } = joiSchema.validate(req.body);

    if (error) {
      const msg = error.details.map((er) => er.message).join(",");
      throw new ExpressError(msg, 400);
    } else next();
  };
};
