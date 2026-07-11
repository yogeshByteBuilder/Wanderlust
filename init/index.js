if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose")
const initdata = require("./data.js")
const Listing = require("../models/listing.js")

// IMPORTANT: this must point to the SAME database your app.js connects to
// (ATLAS_DBURL from .env), not a local MongoDB instance, or the seed data
// will end up in a completely different database than the one your app reads from.
const dbUrl = process.env.ATLAS_DBURL;

async function main() {
    if (!dbUrl) {
        throw new Error("ATLAS_DBURL is not set. Check your .env file / that you're running this from the project root.");
    }
    await mongoose.connect(dbUrl);
}

async function initDB() {
    // Replace this with a real, existing User's _id from your Atlas "users" collection
    // (e.g. sign up a test user first, then copy their _id from Atlas).
    const OWNER_ID = "6a520b8f189b55c9a5bdcdbc";

    await Listing.deleteMany({});
    const seedData = initdata.data.map((ob) => ({ ...ob, owner: OWNER_ID }));
    await Listing.insertMany(seedData);
    console.log(`data was initialized: ${seedData.length} listings inserted`);
}

main()
    .then(async () => {
        console.log("connected to DB");
        await initDB();
        await mongoose.connection.close();
        console.log("connection closed");
    })
    .catch((err) => {
        console.log(err);
    });