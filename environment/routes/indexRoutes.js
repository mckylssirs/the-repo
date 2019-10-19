var express = require("express");
var router = express.Router();
var post = require("../models/post.js");
router.get("/",function(req,res){
    res.render("indexRoutes/homepage")
})
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


module.exports = router;