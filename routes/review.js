const express = require("express")
// const { Router } = require("expss"); 
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");

// const wrapAsync = require("../utils/wrapAsync.js");

const {validateReview, isLoggedIn, isOwner, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")

//Review delection
router.delete("/:reviewId", 
    isLoggedIn, isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
)
//day47 review creation post route
router.post("/" , isLoggedIn,
    validateReview,wrapAsync(reviewController.createReview));


module.exports = router;