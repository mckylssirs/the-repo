var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var user = require("../models/user.js")
var post = require("../models/post.js")

function LoginCheck(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    
    res.redirect("/login");
}
router.get("/searchRoutes/userSearch",LoginCheck,function(req,res){
    user.find({},function(err,allusers){
        if(err){
            console.log(err)
        }else{
            
        res.render("searchRoutes/userSearch.ejs",{user:req.user,allusers:allusers,name:"all"})
    
            }
        })
})
router.post("/searchRoutes/UserSearch",LoginCheck,function(req,res){
    user.find({ "username": req.body.username }, function(err,found){
        if(err){
            console.log(err)
        }
        else{
           res.render("searchRoutes/userSearch",{allusers:found})
        }})
        
    
})

router.post("/searchRoutes/tagSearch",LoginCheck,function(req,res){
    
   user.find({ "profile.tags": { "$in" : [req.body.tag]} }, function(err,found){
        if(err){
            console.log(err)
        } 
        else{
           
           res.render("searchRoutes/userSearch",{allusers:found})
        }
        
    });
})
router.get("/searchRoutes/postSearch",LoginCheck,function(req,res){
    post.find({},function(err,allposts){
        if(err){
            console.log(err)
        }else{
        res.render("searchRoutes/postSearch",{user:req.user,allposts:allposts,type:"all"})
    
            }
        })
    
})

router.post("/searchRoutes/postSearch",LoginCheck,function(req,res){
   var tag = req.body.tag
    if(req.body.tag != ""){
         post.find({ tags: { "$in" : [tag]} }, function(err,found){
        if(err){
            console.log(err)
        }
        else{
          
           res.render("searchRoutes/postSearch",{user:req.user,allposts:found,type:req.body.type})
        }
        
      });
        
    }
    else{
         post.find({},function(err,allposts){
        if(err){
            console.log(err)
        }else{
        res.render("searchRoutes/postSearch",{user:req.user,allposts:allposts,type:req.body.type})
    
            }
        })
    }
  
    
})

module.exports = router;
//FIX USER REQUIRMENT SHIT