const { cloudinary } = require("../cloudinary/index.js");
const Campground = require("../models/campground.js");
const mbxGeocode = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocode({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req, res) => {
  const campAll = await Campground.find({});
  res.render("campgrounds/index.ejs", { campAll });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new.ejs");
};

module.exports.createCampground = async (req, res) => {
  // API call with the inputted locations, to forward geocode, and return with coords
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  const newCamp = new Campground(req.body);
  // adds the returned GeoJSON into the newCamp
  newCamp.geolocation = geoData.body.features[0].geometry;
  // adds array of images based on uploaded images
  newCamp.images = req.files.map((img) => ({
    url: img.path,
    filename: img.filename,
  }));
  // add author, based on current logged in user, and saves
  newCamp.author = req.user._id;
  await newCamp.save();

  req.flash("success", "Successfully made a campground!");
  res.redirect(`/campgrounds/${newCamp.id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  // populate "reviews" field AND its "author" that are nested in it, also populate "author" that is nested in campgrounds collection.
  const camp = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  res.render("campgrounds/shows.ejs", { camp });
};

module.exports.renderEditForm = async (req, res) => {
  // queried camp is queried with campground object from shows' id, from prev middlewares
  const camp = res.locals.queriedCamp;
  res.render("campgrounds/edit.ejs", { camp });
};

module.exports.editCampground = async (req, res) => {
  // const camp = res.locals.queriedCamp;
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(id, req.body);

  // add image onto images array
  const imgs = req.files.map((img) => ({
    url: img.path,
    filename: img.filename,
  }));
  camp.images.push(...imgs);
  await camp.save();

  // delete images from images array and cloudinary
  if (req.body.deletedImgs) {
    for (let filename of req.body.deletedImgs) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deletedImgs } } },
    });
  }

  req.flash("success", "Successfully edited a campground!");
  res.redirect(`/campgrounds/${camp.id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;

  // delete all images associated w/ campground from cloudinary
  const camp = await Campground.findById(id);
  for (let image of camp.images) {
    await cloudinary.uploader.destroy(image.filename);
  }

  // remember the middleware that also deletes all referenced review from review
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a campground!");
  res.redirect(`/campgrounds`);
};
