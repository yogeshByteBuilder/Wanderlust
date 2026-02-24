const express = require("express")
// const { Router } = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
const Review = require("../models/reviews.js")

// const { log } = require("console")
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema , reviewSchema} = require("../schema.js")
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")

const listingController = require("../controllers/listings.js")


const multer =  require("multer");
const {storage} = require("../cloudConfig.js")

const upload = multer({storage})


// index route//create route 
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
         upload.single('image'),
         validateListing,
        wrapAsync(listingController.addlisting)
    )
    
// new route
router.get("/new",isLoggedIn,listingController.createlistingpage)
//if new route is under show then /new will be traeted as an id and will gwt error


// Update route
// show route
//
// delete route
router.route("/:id")
    .get( wrapAsync(listingController.showlisting))
    .put(isLoggedIn, isOwner,
    upload.single('image'),
    validateListing, 
    wrapAsync(listingController.updatelisting))
    .delete(isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroylisting))



// Edit route
router.get("/:id/edit",isLoggedIn
    ,isOwner, wrapAsync(listingController.editlistingpage));

// router.all('/{*splat}',(req,res,next) =>{
//     next(new ExpressError(404,'page not found'))
// })

module.exports = router