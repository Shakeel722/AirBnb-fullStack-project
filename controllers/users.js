const User = require("../models/user");

module.exports.renderSignupForm = (req, res)=> {

  res.render("users/signup.ejs");
}

module.exports.signup = async (req, res)=> {
   try {
          let {username , email , password } = req.body;

       const newUser = new User({ // creating a new user
        username: username, 
        email: email,
    });

     let registeredUser =  await User.register(newUser , password); //storing to db
     console.log(registeredUser);
     req.login(registeredUser, (err)=> {    //passport method to automatically login

        if(err) {
         return next(err);
        }

        req.flash("success" , "you are logged In !" );
        res.redirect("/listings");
     });
   

   } 
   catch(err) {

    req.flash("error", err.message);
    console.log(err.message);
    res.redirect("/signup");
   }

}

module.exports.renderLoginForm = (req, res)=> {
  
  res.render("users/login.ejs");
}

module.exports.login = (req, res)=> { //we used passport.authenticate is a middleware used to authenticate user

//if the middleware authenticated user succeed
req.flash("success" , "you are now logged in");
let redirectUrl = res.locals.redirectUrl || "/listings";

res.redirect(redirectUrl);

}

module.exports.logout = (req, res ,next)=> {
  req.logout((err)=> {
    if(err)  {
      return next(err);
    }

    req.flash("success" , "you are logged out!");
    res.redirect("/listings");
  });
}