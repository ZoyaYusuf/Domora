const Listing = require("./models/listing");  //for isowner
const Review = require("./models/review"); //for reviewauthor

const ExpressError = require("./utils/expressError.js"); //for validatelisting
const {listingSchema , reviewSchema } = require("./schema.js"); //for validatelisting


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must Log-in");
        return res.redirect("/login");  
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next) =>{
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have access to Edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        console.log("valid err",error);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next) =>{
    const {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        // console.log("user:", currUser);
        req.flash("error","You are not the Author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}