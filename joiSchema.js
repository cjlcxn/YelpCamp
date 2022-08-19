const Joi = require("joi");

module.exports.joiCampgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().greater(0),
  description: Joi.string().required(),
  location: Joi.string().required(),
  // image: Joi.string().required(),
  deletedImgs: Joi.array(),
}).required();

module.exports.joiReviewSchema = Joi.object({
  body: Joi.string().required(),
  rating: Joi.number().required().min(1).max(5),
}).required();
