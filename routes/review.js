const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js"); //listing model
const Review = require("../models/review");  // review model
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview , isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const review = require("../models/review");





// create review route
router.post("/" , isLoggedIn , validateReview  ,  wrapAsync (reviewController.createReview) );

//delete review route
router.delete("/:reviewId" ,isLoggedIn ,isReviewAuthor , wrapAsync(reviewController.destroyReview));


module.exports = router;