const Listing = require("../models/listing");

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;



module.exports.index =  async(req, res)=> {

    let allListings = await Listing.find({}); 

    

    res.render("listings/index" , { allListings });
};

module.exports.renderNewForm = (req, res)=> {

    res.render("listings/new");

}

module.exports.showListing = async (req, res)=> {
    let {id} = req.params;

    const data = await Listing.findById(id).populate( {path:"reviews" , populate: {path:"author"}} ).populate("owner");
    
if (!data) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings"); 
}

    let apiKey = process.env.MAPTILER_API_KEY;

    res.render("listings/show.ejs" , {data, apiKey});

}

module.exports.renderEditForm = async (req ,res)=> {

    let {id} = req.params;

    const data = await Listing.findById(id);
    if (!data) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
}
   let originalImgUrl = data.image.url;
    originalImgUrl = originalImgUrl.replace("/upload" , "/upload/h_200,w_350");
    console.log(originalImgUrl);
    res.render("listings/edit.ejs" , {data , originalImgUrl});

}

module.exports.updateListing = async (req, res)=> {

     let {id} = req.params;
     const data = await Listing.findByIdAndUpdate(id , req.body.listing);

     if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        data.image = { url , filename};
        await data.save();
     }

     req.flash("success" , "Listing Updated!");
     res.redirect(`/listings/${id}`);

    
}

module.exports.createListing = async (req, res)=> {


//geoCoding 
async function performForwardGeocoding(query) {
  try {
    const result = await maptilerClient.geocoding.forward(query, {

        limit: 1, // Limit the number of results returned

    });
    return result.features[0].geometry;// Array of geocoded features
  } catch (error) {
    console.error("Geocoding error:", error);
  }
}
    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = new Listing(req.body.listing );
    newListing.owner = req.user._id;
    newListing.image = { url , filename};
    
    let geoCode = await performForwardGeocoding(req.body.listing.location);

    if (geoCode) {
        newListing.geometry = geoCode;
    }

     await newListing.save();
     console.log("saved in db");

    req.flash("success" , "New Listing Created Succesfully!");
    res.redirect("/listings");


    }

   
module.exports.destroyListing = async (req, res)=> {

    let {id} = req.params ;  
    console.log(id);

   let deletedVal = await Listing.findByIdAndDelete(id);

   req.flash("success", "Listing Deleted!");
   
   res.redirect("/listings");
}
