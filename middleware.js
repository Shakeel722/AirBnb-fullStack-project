const Listing = require("./models/listing");
const Review = require("./models/review");
const { reviewSchema , listingSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res,  next) => {

 if(!req.isAuthenticated()) { 
    req.session.redirectUrl = req.originalUrl;

     req.flash("error" , "you must be logged in first to access it");
     return res.redirect("/login");

    }
  
   next(); 
}

module.exports.isLoggedIn = (req, res, next) => {
    
    if (!req.isAuthenticated()) {// if not logged in redirected and stopped
        // save the original URL to redirect after login
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        }
        req.flash("error", "You must be logged in first to access it");
        return res.redirect("/login");
    }
    next();// if logged In then can access other routes continued
};


module.exports.saveRedirectUrl = (req, res, next) => {

    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
      
    }
 
   next();
}

module.exports.isOwner = async( req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id)) {

        req.flash("error" , "You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req, res ,next)=> {
    let { error } =  listingSchema.validate(req.body);
    
    if( error)  {
        throw new ExpressError (400 , error);
    }
    else {

        next();
    }
}

module.exports.validateReview = (req, res ,next)=> {
    let { error } =  reviewSchema.validate(req.body);
    
    if( error)  {
        throw new ExpressError (400 , error);
    }
    else {

        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next ) => {

   
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)) {

        req.flash("error" , "You are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }

    next();

    
}