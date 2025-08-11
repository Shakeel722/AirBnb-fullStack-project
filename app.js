//server file

// Load environment variables
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); //listing model
const Review = require("./models/review");  // review model
const User = require("./models/user.js");  //user model
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const MongoStore = require("connect-mongo");
const listingRouter= require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter  = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const atlasDbUrl = process.env.ATLAS_DB_URL;



//store
const store = MongoStore.create({
    mongoUrl: atlasDbUrl,
    crypto: {
        secret:"mysecretcode",
    },
    touchAfter: 24* 3600
});

//session setup
const sessionOptions = {
    store: store,
    secret: "mysecretcode", 
    resave : false, 
    saveUninitialized: true,
    cookie : {
        expires: Date.now()+ 7 * 24 * 60 * 60 * 1000 , 
        maxAge:7 * 24 * 60 * 60 * 1000 ,
        httpOnly: true,
    }
}
store.on("error" , ()=> {
    console.log("MONGOOSE STORE CONNECTION ERROR: ",err );
});

app.use(session(sessionOptions));
app.use(flash());

//passport authentication and authorization setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash messages middleware
app.use(( req, res, next)=> { // store succes msg in locals

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});




//static files
app.use(express.static(path.join(__dirname, "public")));



//ejsMate setup
app.engine("ejs" , ejsMate);

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//ejs setup
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));

//method override
app.use(methodOverride("_method"));

//db connect
async function main() {
    mongoose.connect(atlasDbUrl);//atlas db connection url
}
main().then(()=> {
    console.log("database connected successfully!");
});



//routes

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);





//error handling middleware
app.use(( err, req, res, next ) =>  {
  let{ status = 500 , message = "something went wrong" } = err;

    res.render("listings/error.ejs" , {status, message});

});




//start server
app.listen(8080, ()=> {
    console.log("server is listening at port: 8080");
});




