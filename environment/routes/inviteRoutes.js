var express    = require("express"), 
    app        = express(), 
    bodyParser = require("body-parser"), 
    mongoose   = require("mongoose"),
    post = require("../models/post"),
    message = require("../models/messages"),
    user = require("../models/user")
    
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next()
    };
    res.redirect("/login")
}
function yourplace(req,res,next){
    if(req.user._id.equals(req.params.userid)){
        next()
    }else{
        res.redirect("/")
        console.log("not your place")
    }
}
function isowner(req,res,next){
    post.find({"_id":req.params.postid},function(err,found){
        if(err){
            res.redirect("/")
        }else{
            if(req.user._id.equals(found[0].author.id)){
                next()
            }
            else{
                console.log(found[0].author.id)
                console.log(req.user._id)
                res.redirect("/")
            }
        }
    })
    
}
function isInArray(array, search)
{
    return array.indexOf(search) >= 0;
}
function isrightin(req,res,next){
    if(req.user.id== req.params.userid ){
        return next()
    };
    console.log(req.params.userid)
    res.redirect("/login")
}
var express = require("express");
var router = express.Router();

router.get("/post/:id/invite",isLoggedin, function(req,res){
    res.render("inviteRoutes/newinvite.ejs",{iden:req.params.id})
    console.log("at pinvite")
})
router.post("/post/:id/invite",isLoggedin, function(req,res){
    var everything = {}
    post.find({"_id":req.params.id},function(err,found){
      if(err){console.log(err)}else{
          console.log(found)
          everything.text = "You have been invited to join "+found[0].name;
      }  
    })
    
    
    
    
    user.find({"username":req.body.person},function(err,found){
        if(err){
            console.log(err)
        }else{
           everything.author = {id:req.user._id,username:req.user.username}
           console.log(found)
           console.log(found[0]._id)
           everything.receiver = {id:found[0]._id,name:req.body.person}
           everything.link ="/post/"+req.params.id+"/"+found[0]._id+"/acceptinvite";
           everything.type="invite"
           message.create(everything,function(err,message){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(message)
                        res.redirect("back")
                        
                    }
                })
        }
    })
 })
   router.get("/posts/:postid/:userid/acceptance",isLoggedin,isowner, function(req,res){
    post.find({"_id":req.params.postid},function(err,found){
        if(err){console.log(err)}
        else{
             if(isInArray(found[0].members,req.params.userid)){
                
                 res.render("back")
                 
                 
              }else{
                 found[0].members.push(req.params.userid)
                 found[0].save()
                 console.log(found[0])
                 console.log(req.params)
                 var linker = "/posts/"+req.params.postid+"/"+ req.params.userid + "/acceptance";
                 console.log(linker)
                 
                 message.find({"link":linker},function(err,found){
                     if(err){console.log(err)
                         
                     }else{
                        console.log(found._id)
                         console.log(found)
                          console.log(found.id)
                         message.findByIdAndRemove(found[0]._id, function(err){
                                if(err){
                                    res.redirect("/")
                                }else{
                                    res.redirect("back")
                                }
                            })
                     }
                 })
               
                 
            }
        }
    } 
    )
})
    
 router.get("/post/:id/requestinvite",isLoggedin, function(req,res){
      post.find({"_id":req.params.id},function(err,found){
        if(err){
            console.log(err)
        }
        else{
            console.log("hello")
            
            var invite = {text:req.user.username+" wants to join "+ found[0].name+ "!"};
            invite.author = {id:req.user._id,username:req.user.username}
            invite.receiver = {id:found[0].author.id,name:found[0].author.username}
            invite.type = "request"
            invite.link    = "/posts/"+req.params.id+"/"+req.user._id+"/acceptance"
            message.create(invite,function(err,message){
                        if(err){
                            console.log(err);
                        }
                        else{
                            
                            res.redirect("back")
                            
                        }
                    })
        }
    })
})
    router.get("/post/:postid/:userid/acceptinvite",isLoggedin,isrightin, function(req,res){
    post.find({"_id":req.params.postid},function(err,found){
        
        console.log(req.params.userid);
        if(err){console.log(err)}
        else{
             if(isInArray(found[0].members,req.params.userid)){
                
                 res.redirect("/login")
                
                 
              }else{
                post.findByIdAndUpdate(req.params.postid,{$push:{"members":req.params.userid}},function(err,newguy){
            if(err){}
            console.log(newguy)
            console.log(found.members);
            res.redirect("/")
})
                
            }
        }
    })
})


module.exports = router
