var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var user = require("../models/user.js")
var passport = require("passport")
router.get("/register",function(req,res){
    var err = "";
    res.render("authRoutes/register", {error:err})
})
router.post("/register", function(req, res){
    user.register(new user({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            
            return res.render("authRoutes/register", {error:err});
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/");
        });
    });
});

router.get("/login",function(req,res){
    var err= "";
    res.render("authRoutes/login",{error:err})
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/loginerr"
}) ,function(req,res){
    
})
router.get("/loginerr", function(req, res) {
   var  err = "UserError: Username or password is incorrect";
    res.render("authRoutes/login", {error:err});
})
router.get("/logout",function(req,res){
    req.logout()
    res.redirect("/")
})
module.exports = router;