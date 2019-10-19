var express    = require("express"), 
    app        = express(), 
    bodyParser = require("body-parser"), 
    mongoose   = require("mongoose"),
    post = require("../models/post"),
    message = require("../models/messages"),
    user = require("../models/user")
    var router = express.Router()
   var methodOverride = require("method-override")
    router.use(methodOverride("_method"));
    
    
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next()
    };
    res.redirect("/login")
}
var express = require("express");
var router = express.Router();

router.get("/profile/:id/newmessage",isLoggedin, function(req,res){
    res.render("messageRoutes/newmessage.ejs",{id:req.params.id})
    
})
router.get("/profile/:id/createmessage",isLoggedin, function(req,res){
    res.render("messageRoutes/freeformmessage.ejs",{id:req.params.id,err:false})
   
})


router.get("/profile/:id/messages",isLoggedin, function(req,res){
   message.find({"author.id":req.params.id},function(err,sent){
       if(err){
           console.log(err)
       }else{
    
    message.find({"receiver.id":req.params.id},function(err,received){
        if(err){}
        else{
        
         res.render("messageRoutes/messages",{messages:received,sent:sent})    
            
        }})
       }
   
})})
router.post("/messages/:id/markred", function(req,res){
   message.findByIdAndUpdate(req.params.id,{ $set: { read: true }}, function(err, updatedmessage){
      if(err){
          res.redirect("back");
      } else {
        
          res.redirect("back" );
      }
   })})
router.delete("/messages/:id", function(req,res){
    message.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/")
        }else{
            res.redirect("back")
        }
    })
})

router.post("/profile/:id/messages",isLoggedin, function(req,res){
    var text = req.body.message;
    text.author = {id:req.user._id,username:req.user.username}
    text.receiver = {id:req.params.id}
    message.create(text,function(err,message){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/")
            
        }
    })
})
 router.post("/profile/:id/creation",isLoggedin, function(req, res) {
     
     user.find({ "username": req.body.search.username }, function(err,found){
        if(err){
            res.redirect("back",{err:true})
        }
        else{
           
           if(found.length < 1){
                res.render("messageRoutes/freeformmessage",{id:req.params.id,err:true})
           }else{
             
               
           var text = req.body.message
            text.author =  text.author = {id:req.user._id,username:req.user.username}
            text.receiver = {id:found[0]._id,name:req.body.search.username}
            message.create(text,function(error,text){
                if(error){
                    res.redirect("back",{error:true})
                }else{
                   
                    res.redirect("/")
                }
            })
        }
    }
   })
 }) 
     

module.exports = router
