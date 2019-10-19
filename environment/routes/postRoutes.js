var express = require("express");
var app = express();
var post = require("../models/post.js");
var mongodb = require("mongodb");
var bodyParser = require("body-parser");
var passPort =require("passport");
var mongoose = require("mongoose");
var expressSession = require("express-session");
var router = express.Router();
var methodOverride = require("method-override");
var user = require("../models/user.js");




router.use(methodOverride("_method"));
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}


router.get("/profile/:id/post",function(req,res){
   
    console.log(req.user.username)
    res.render("postRoutes/newpost")
})
router.post("/profile/:id/post",function(req,res){
   var team = req.body.post;
   var tags = team.tags
   tags.trim()
   tags = tags.split(" ")
    team.tags = tags
     console.log(team.tags)
     team.author = {
        username:req.user.username,
        id:req.user._id
    };
    team.members = req.user.id
    console.log(team)
    post.create(team,function(err,poster){
        if(err){
            console.log(err)
            res.redirect("/");
        }
        else{
            console.log(poster)
            res.redirect("/")
        }
    })
})

router.post("/posts/:post/:user/leave",function(req,res){
    post.findByIdAndUpdate(req.params.post,{$pull:{"members":req.params.user}},function(err,newguy){
        if(err){}
        console.log(newguy)
        res.redirect("/")
})
})
router.get("/post/:id",function(req,res){
    
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
         // Yes, it's a valid ObjectId, proceed with `findById` call.
        post.findById(req.params.id).populate("members").exec(function(err,foundpost){
           
           if(err){
               console.log(err)
               res.redirect("/")
           } 
           else{
               console.log(foundpost.members);
            post.find({ "members": { "$in" : [req.user.id]} }, function(err,found){
                if(err){
                    console.log(err)
                }
                else{
                   console.log(found);
                    if(found.length > 0){
                         res.render("postRoutes/show",{post:foundpost,perm:"mem"})
                    }else{
                         res.render("postRoutes/show",{post:foundpost,perm:"bum"})
                    }
              
           }
        })
        
     
    }}
)}
    else{
        res.redirect("/")
    }
})




//Edit Routes

//Get
router.get("/posts/:id/edit",isLoggedin,function(req,res){
     post.findById(req.params.id,function(err,poster){
        if(err){
            console.log(err)
            res.redirect("/")
        }
        else{
            res.render("postRoutes/edit",{post:poster})
        }
    })
    
})

//Post

router.put("/posts/:id/edit",function(req,res){
    post.findByIdAndUpdate(req.params.id,req.body.post,function(err,newguy){
        if(err){
            res.redirect("/");
        }else{
            console.log(newguy)
            res.redirect("/post/"+newguy._id)
        }
    })
})

//Delete

router.delete("/posts/:id", function(req,res){
    post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/")
        }else{
            res.redirect("/")
        }
    })
})



module.exports = router;