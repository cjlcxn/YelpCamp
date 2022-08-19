const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");

const catchAsync = require("../utilities/catchAsync.js");
const Campground = require("../models/campground.js");
const Review = require("../models/review.js");
const { joiReviewSchema } = require("../joiSchema.js");
const ExpressError = require("../utilities/ExpressError.js");
const {
  idInvalid,
  validate,
  isFound,
  loggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviews = require("../controllers/reviews.js");

// route to create a new review on a campground
router.post(
  "/",
  loggedIn,
  validate(joiReviewSchema),
  idInvalid,
  isFound,
  catchAsync(reviews.createReview)
);

// route to delete review from model and campground
router.delete(
  "/:reviewId",
  loggedIn,
  idInvalid,
  isFound,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
