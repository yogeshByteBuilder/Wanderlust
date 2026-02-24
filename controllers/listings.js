const Listing = require("../models/listing")

module.exports.index = async (req,res) =>{

    const {category} = req.query;
    let filter = {};
    if(category){
        filter.category = category;
    }

   const allListings = await Listing.find(filter);
   res.render("listing/index.ejs",{allListings, category})
}

module.exports.createlistingpage = (req,res) =>{
    // console.log(req.user)
    
    res.render("listing/new.ejs")
}
module.exports.addlisting = async (req,res,next) => {
    // let {title, description,image,price,country,location} = req.body //it is lenght we can use objects in form
    // if (!req.body.listing) {
    //     throw new ExpressError(400,"Send Valid data for Listing")
    // }
   let url = req.file.path;
   let filename = req.file.filename;
   console.log(url,filename)
    const newListing =new  Listing(req.body.listing);
    // co nsole.log(req.user);
    
    newListing.owner = req.user._id
    newListing.image = {filename, url};
    await newListing.save();
    req.flash("success","New listing created!")
    res.redirect("/listings")
    }

module.exports.editlistingpage = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl =originalImageUrl.replace("/upload", "/upload/w_300,h_200,c_fill")

    res.render("listing/edit.ejs", { listing , originalImageUrl});
});
module.exports.updatelisting = async (req, res) => {
    const { id } = req.params;

    let updatedListing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { new: true }
    );

    if (!updatedListing) {
        req.flash("error", "Listing you requested to update does not exist");
        return res.redirect("/listings");
    }

    // Correct file check
    if (req.file) {
        updatedListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await updatedListing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.showlisting= async (req,res,next) => {
    let {id} = req.params;
    const listingdata = await Listing.findById(id)
    .populate({path :"reviews" , populate : {path : "author",},})
    .populate("owner");
    if(!listingdata){
        req.flash("error","Listing you requested does not exists");
        return res.redirect("/listings")
    }
    // console.log(listingdata)
    res.render("listing/show.ejs", {listingdata})
    
}
module.exports.destroylisting = async (req,res,next) =>{
    let {id} = req.params;
    let dellisting = await Listing.findByIdAndDelete(id)
    console.log(dellisting);
    req.flash("success","Listing deleted!")
    res.redirect("/listings");
}