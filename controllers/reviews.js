const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  // queriedCamp is campground object queried from campground shows' id, from prev middlewares
  const camp = res.locals.queriedCamp;
  // create review, and add author to reviews collection in db
  const review = new Review(req.body);
  review.author = req.user._id;
  // update campground db's "reviews" field with the new review's reference
  camp.reviews.push(review);
  await camp.save();
  await review.save();
  req.flash("success", "Successfully created new review!");
  res.redirect(`/campgrounds/${camp.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  // query campgrounds, and update it by pulling reviews that match reviewID
  const camp = await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  // delete review doc from reviews collection
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted a review!");
  res.redirect(`/campgrounds/${id}`);
};
