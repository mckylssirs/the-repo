var YourPort = process.env.PORT
var YourIP = process.env.IP
var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrat            = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user.js"),
    indexRoutes           = require("./routes/indexRoutes"),
    authRoutes           = require("./routes/authRoutes"),
    profileRoutes       = require("./routes/profileRoutes"),
    postRoutes          = require("./routes/postRoutes"),
    flash                = require("connect-flash"),
    messageRoutes      = require("./routes/messagesRoutes"),
    inviteRoutes      = require("./routes/inviteRoutes"),
    searchRoutes      = require("./routes/searchRoutes")
var app = express();
//required to use body parser
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "fmlmlmlmlmlmlmlmlmlmlmlmlmlmlmlmlmmlmlmlmmlmlmlmlmlmlmlmmmlmlmlmlmlmm",
    resave:false,
    saveUnitialized: false
}))

mongoose.connect("mongodb://root:5335@ds249605.mlab.com:49605/profproject",{ useNewUrlParser: true },function(err){
  if(err){}
  else{console.log("im in")}
  
})
app.set("view engine","ejs");
app.use(passport.initialize());
app.use(passport.session());
mongoose.Promise = global.Promise;

passport.serializeUser(User.serializeUser());
passport.use(new LocalStrat(User.authenticate()));
passport.deserializeUser(User.deserializeUser())
app.use(flash());
app.use(function(req, res, next){
   res.locals.currentuser = req.user;
   next();
});
app.use(function(req,res,next){
    res.locals.ide = req.params.id
    next()
})

app.use(express.static(__dirname + "/public"))
app.use(indexRoutes)
app.use(authRoutes)
app.use(profileRoutes)
app.use(messageRoutes)
app.use(postRoutes)
app.use(inviteRoutes)
app.use(searchRoutes)

app.listen(YourPort,YourIP,function(){
    console.log("Site started")
})
//FIX SPREAD SHEET MADNESS