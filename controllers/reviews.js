const Review = require("../models/reviews")
const Listing = require("../models/listing")
module.exports.createReview = async (req,res) => {
   let listing = await Listing.findById(req.params.id);
   if (!listing) {
       req.flash("error", "Listing you requested does not exist");
       return res.redirect("/listings");
   }
   let newReview = new Review(req.body.review)
   newReview.author = req.user._id;
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
    console.log("New review saved");
    req.flash("success", "Review created succesfully")
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req,res)=>{
        let {id, reviewId} = req.params;
        await Listing.findByIdAndUpdate(id, 
            {$pull : {reviews : reviewId}})
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted successfully");
        res.redirect(`/listings/${id}`)
    }