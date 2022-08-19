const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  body: String,
  rating: Number,
  // refences user docs
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
