const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const imagesSchema = new Schema({
  url: String,
  filename: String,
});

// virtual to set up a "get" property on instance of imageSchema, to replace the url, to retrieve thumbnail format images from cloudify
imagesSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campGroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  // geolocation is in geoJSON format
  geolocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  images: [imagesSchema],
  // campground models has reference to author and review docs
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// middleware to delete ALL reviews from reviews collection, that is referenced by deleted campground
campGroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp) {
    await Review.deleteMany({ _id: { $in: camp.reviews } });
  }
});

module.exports = mongoose.model("Campground", campGroundSchema);
