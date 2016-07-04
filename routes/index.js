var express = require("express");
var passport = require("passport");
var User = require("../models/user");
var router = express.Router();

router.get("/",function(req,res){
  res.render("home");
});

/**
 * Register Form
 */

router.get("/register",isLoggedIn,function(req,res){
  res.render("register");
});

router.post("/register",isLoggedIn,function(req,res){
  User.register(new User({username: req.body.username}),req.body.password,function(err,user){
    if(err){
      console.log(err);
      req.flash("error",err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req,res,function(){
      req.flash("success","Welcome "+req.body.username+", you are successfully registered and logged in!");
      res.redirect("/campgrounds/");
    });
  });
});

/**
 * Login Form
 */

router.get("/login",isLoggedIn,function(req,res){
  res.render("login");
});

router.post("/login",isLoggedIn,passport.authenticate("local",{
  successRedirect: "/campgrounds/",
  failureRedirect: "/login/"
}),function(req,res){
});

/**
 * Logout
 */
router.get("/logout",function (req,res) {
  req.logout();
  req.flash("success","Successfully logged out.")
  res.redirect("/");
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    req.flash("error","Please Logout first!");
    return res.redirect("/campgrounds/");
  }
  return next();
}

module.exports = router;
