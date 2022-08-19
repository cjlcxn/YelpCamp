const mongoose = require("mongoose");

const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const { dbPath } = require("../utilities/config.js");
const Campground = require("../models/campground.js");

(async function main() {
  try {
    await mongoose.connect(dbPath);
    console.log("connected to db");
  } catch (err) {
    console.log("mongo error, " + err);
  }
})();

//generate random campname, based on combo of place + descriptor
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

// "resets" the yelp-camp collection, and add seeded data randomly
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;
    const seededCampground = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non necessitatibus doloribus quas amet vel mollitia corrupti earum, maiores in quasi, est dolorem aut quis delectus, labore quod? Saepe ullam praesentium sapiente culpa eos nesciunt ab, earum illo, distinctio repellendus aliquid quam necessitatibus modi minus amet alias. Laudantium quibusdam saepe excepturi optio?",
      price,
      author: "62f9f845b0b54d1372143b1a",
      images: [
        {
          url: "https://res.cloudinary.com/dppkyurll/image/upload/v1660659807/Yelp-Camp/egshpngt0xbfera4eot2.jpg",
          filename: "Yelp-Camp/egshpngt0xbfera4eot2",
        },
        {
          url: "https://res.cloudinary.com/dppkyurll/image/upload/v1660659812/Yelp-Camp/kfuvpimpruzntbzuw8vm.jpg",
          filename: "Yelp-Camp/kfuvpimpruzntbzuw8vm",
        },
        {
          url: "https://res.cloudinary.com/dppkyurll/image/upload/v1660718119/Yelp-Camp/useuu0mnmys0suaaxprl.jpg",
          filename: "Yelp-Camp/useuu0mnmys0suaaxprl",
        },
      ],
      geolocation: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });
    seededCampground.save();
  }
};
seedDB();
