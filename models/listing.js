//listing model

const mongoose = require("mongoose");
const Review = require("./review.js");


// schema
const ListingSchema = new mongoose.Schema({
    title: {
        type:String, 
        required: true,
    }, 
    description: {
        type: String
    }, 
    image: {
        url: String , 
        filename: String ,
    },
    price: Number, 
    location: String , 
    country: String,

    reviews: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ] , 

    owner: {
        type: mongoose.Schema.Types.ObjectId ,
        ref:"User"
    } , 
    geometry : {
        type: {
           type: String, 
           enum: ["Point"],
        },
        coordinates: {
            type:[Number],
            required: true
        }
    },
});

//post mongoose middleware
ListingSchema.post("findOneAndDelete" , async(listing)=> {
 
    if(listing) {

       await Review.deleteMany( {_id: {$in : listing.reviews}});
       
    }
    

});

//model
const Listing = mongoose.model("Listing" , ListingSchema );

module.exports = Listing;