const Listing = require("../models/listing.js");
const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//index
module.exports.index = async(req,res,next)=>{
    const AllListing = await Listing.find({}).populate("image");
    res.render("./listing/index.ejs",{AllListing});
};

//new
module.exports.renderNewForm = async(req,res,next)=>{
    res.render("./listing/new.ejs");
};

//show
module.exports.showListing = async(req,res,next)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path : "review",  //hr ek list ke sath review aye
            populate:{
                path:"author" //hr ek review ke sath author aye
            }
        })
        .populate("owner");
    if(!listing){
        req.flash("error","OOPS! Listing does not exit!");
        res.redirect("/listings");
    }
    res.render("./listing/show.ejs",{listing});
};

//create
module.exports.createListing = async(req,res,next)=>{   
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,filename)
    const newLisitng = new Listing(req.body.listing);  //^
    newLisitng.owner = req.user._id;
    newLisitng.image = {url , filename};
    await newLisitng.save();  //^
    req.flash("success","New listing added successfully!");
    res.redirect("/listings");
};

//edit
module.exports.renderEditForm = async(req,res,next) =>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","OOPS! Listing you are trying to edit, does not exit!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250"); //add cloudinary image transformation features
    res.render("./listing/edit.ejs",{listing,originalImageUrl});
};

//update
module.exports.updateLisitng = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename};
    await listing.save();}
    req.flash("success","Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}

//delete
module.exports.destroyListing = async(req,res)=>{
    let{id} = req.params;
    let deletedListings =  await Listing.findByIdAndDelete(id);
    // console.log(deletedListings);
    req.flash("success","Listing successfully deleted");
    res.redirect("/listings");
    
}