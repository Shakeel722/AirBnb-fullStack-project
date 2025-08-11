const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");


router.route("/signup")
.get(userController.renderSignupForm) // signup page
.post(userController.signup);  // register to db


router.route("/login")
.get(userController.renderLoginForm)// authenticate and login
.post(saveRedirectUrl ,  passport.authenticate("local" , {failureRedirect:"/login" , failureFlash: true}) ,userController.login );//we used passport.authenticate as a middleware used to authenticate user

//logout
router.get("/logout" , userController.logout );



module.exports = router;