const mongoose = require("mongoose");
const Listing = require("../models/listing.js"); // require model
const data = require("./data.js");


//db connect
async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=> {
    console.log("database connected successfully1!");
});

// insert docs into the model


async function initDB() {
    console.log("adding the data to the db");

    await Listing.deleteMany({});
    data.data = data.data.map( (obj) => ( { ...obj , owner:'688fa3f0de67760ea87fcc8c'} ));
    await Listing.insertMany(data.data);

}

initDB().then((data)=> {
    console.log("data is saved in the database");
}).catch((err)=> {
    console.log(err);
});
