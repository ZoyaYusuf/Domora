const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");

const upload = multer({storage});

//index and create
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn, 
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  )
//new route
router.get("/new", isLoggedIn , listingController.renderNewForm);

//show and update
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateLisitng))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;


