const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// adds to userSchema, password and username fields.
userSchema.plugin(passportLocalMongoose);

// middleware post save() of new user, if any email is not-unique, change the returned err.message
userSchema.post("save", function (err, doc, next) {
  if (
    err.name === "MongoServerError" &&
    err.code === 11000 &&
    err.keyValue.email
  ) {
    err.message = "A user with the given email is already registered";
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
