module.exports.port = process.env.PORT || 3000;
module.exports.dbPath =
  process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
module.exports.secret = process.env.DB_SECRET || "thisisnotasecret";
