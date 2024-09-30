const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");
//REVIEWS
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//del review
router.delete("/:reviewId" , isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;

