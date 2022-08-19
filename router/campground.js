/////////////imported packages///////////
const express = require("express");
const router = express.Router();
const multer = require("multer");
// imported setup of cloudinary
const { storage } = require("../cloudinary");
const upload = multer({ storage });

/////////////imported own modules/////////////
const catchAsync = require("../utilities/catchAsync.js");
const ExpressError = require("../utilities/ExpressError.js");
const Campground = require("../models/campground.js");
const { joiCampgroundSchema } = require("../joiSchema.js");
const {
  loggedIn,
  isFound,
  isAuthor,
  idInvalid,
  validate,
} = require("../middleware.js");
const campgrounds = require("../controllers/campgrounds.js");

// route for index of campgrounds
router.get("/", catchAsync(campgrounds.index));

// route to show form to create new campground
router.get("/new", loggedIn, campgrounds.renderNewForm);

//route that actually creates and add campground to db
router.post(
  "/",
  loggedIn,
  // multer uploads 1-many images to cloudify
  upload.array("image"),
  validate(joiCampgroundSchema),
  catchAsync(campgrounds.createCampground)
);

// route to show specifics of campgrounds
router.get("/:id", idInvalid, isFound, catchAsync(campgrounds.showCampground));

// route to render form for edits
router.get(
  "/:id/edit",
  loggedIn,
  idInvalid,
  isFound,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

// route to actually edit campground in db
router.put(
  "/:id",
  loggedIn,
  idInvalid,
  isFound,
  isAuthor,
  // multer uploads 1-many imaages to cloudify
  upload.array("image"),
  validate(joiCampgroundSchema),
  catchAsync(campgrounds.editCampground)
);

// route to delete campgrounds from db
router.delete(
  "/:id",
  loggedIn,
  isFound,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
