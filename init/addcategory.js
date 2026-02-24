const mongoose = require("mongoose");
const Listing = require("../models/listing");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

async function addCategory() {
  // example: assign "trending" to old listings
  const result = await Listing.updateMany(
    { category: { $exists: false } },
    { $set: { category: "trending" } }
  );

  console.log("Updated listings:", result.modifiedCount);
  mongoose.connection.close();
}

addCategory();
