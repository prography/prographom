var express = require('express');
var router = express.Router();

var hashMap = require('./main.js').hashMap;

router.get('/',function(req,res){
    console.log(req.protocol+":/" + req.get('host'));
    //if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
    if ((req.protocol + "://") == ("http://")) {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id in hashMap) {
            console.log("email is verified");
            id = req.query.id;
            //register data to database

            //redirect to application page
            res.redirect('/application?id=' + id);
        } else {
            console.log("email not verified");
            res.end("<h1>not verified.</h1>");
        }
    } else {
        res.end("<h1>wrong method.</h1>");
    }
});


module.exports = router;
