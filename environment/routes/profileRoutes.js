var express = require("express");
var router = express.Router();
var user = require("../models/user.js");
var methodOverride = require("method-override")
var post = require("../models/post.js")
var message = require("../models/messages");
router.use(methodOverride("_method"));

function LoginCheck(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    
    res.redirect("/login");
}
router.get("/profile/:id",LoginCheck,function(req,res){
    
    user.findById({"_id":req.params.id},function(err,fund){
        if(err){
            res.redirect("back")
            console.log(err)
        }
        else{post.find({"members":req.params.id},function(err,found){
        if(err){
            console.log(err)
        }else{
          
            var property = []
            post.find({"author.id":req.params.id},function(err,find){
                if(err){}
                else{
                    property = find
            
            message.find({"receiver.id":req.params.id},function(err,received){
                if(err){}else{
                var unread = 0;
                received.forEach(function(recmessage){
                    if(!recmessage.read){
                        unread++
                    }else{}
                })
                res.render("profileRoutes/profile",{ide:req.params.id,found:found,fund:fund,unread:unread,property:property})
            }})
             
        }
    })}
        
    
        })}
        })
    
    
})
router.get("/profile/:id/edit",LoginCheck,function(req,res){
    res.render("profileRoutes/edit")
})
router.put("/profile/:id/edit",function(req,res){
    var nuser = req.user
    nuser.profile = req.body.profile
 
   
    var tags = req.body.profile.skills
    tags.trim
    //regex
    tags = tags.split(/[\s,]+/)
    
    nuser.profile.tags = tags
   
    user.findByIdAndUpdate(req.params.id, nuser, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
        
          res.redirect("/profile/" + req.params.id );
      }
   });
});

module.exports = router;