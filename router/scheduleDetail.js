var express = require('express');
var router = express.Router();

var client = require("./main.js").client;

var moment = require('moment');
var fileUpload = require('express-fileupload');
var path = require('path');

router.get('/', function(req, res){
    if (!req.session.user) {
        res.render('feed/feed-login', {err: false, errmsg: '', title: "프로그라피드 로그인", url: req.protocol + '://' + req.headers.host + req.url});
    } else {

    }
});


router.get('/logout', function(req, res){
    req.session.user = null;
    res.redirect('/feed');
});

module.exports = router;
