const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


//User Schema

const userSchema = new mongoose.Schema({

    email : {
        type: String, 
        required: true,
    },

});

userSchema.plugin(passportLocalMongoose);//username and password field is default added by passportLocalMongoose

//model
const User = mongoose.model("User" , userSchema);


module.exports = User;
