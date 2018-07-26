var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var express = require('express');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var params = require('params');

function reverseHash(id){
    return hashMap[id];
}
function hash(email){
    return sha256("pRoG" + email + "rApHy");
}
function verify_user(id, pw){
    if (id == "웹팀이" && pw == "1등이야") {
        return true;
    } else {
        return false;
    }
}
var client = mysql.createConnection({
    host: 'ec2-13-125-217-76.ap-northeast-2.compute.amazonaws.com',
    user : 'root',
    password : '',
    database : 'prography',
    multipleStatements: true
});

client.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

var app = express();

var nodemailer=require("nodemailer");
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "prography.verify",
        pass: "verify.test"
    }
});

var rand,mailOptions,host,link;
var sha256 = require('js-sha256');

var admin = require('./admin.js');
var application = require('./application.js');
var recruit = require('./recruit.js');
var send = require('./send.js');
var verify = require('./verify.js');

module.exports = function(app)
{
    app.get('/', function(req,res) {
        res.render('index')
    });
    app.get('/about', function(req,res) {
        res.render('about')
    });
    app.get('/history', function(req, res) {
        res.render('history')
    });
    app.get('/product', function(req, res) {
        res.render('product')
    });
    app.get('/login', function(req, res) {
        res.render('login')
    });

    app.use('/admin', admin);
    app.use('/application', application);
    app.use('/recruit', recruit);
    app.use('/send', send);
    app.use('/verify', verify);

    app.get('/recruit-fin', function(req, res) {
      res.render('recruit-fin');
    });

    app.get('/check_result1', function(req, res){
        var email = req.query.email;
        var query = "SELECT survived FROM Applicants WHERE email = '"+email+"'";
        client.query(query, function(error, result){
            if (error){
                console.log(error);
            } else {
                survived = JSON.stringify(result[0]['survived']);
                res.send( survived);
            }
        });
    });

    app.get('/recruit-result1', function(req, res) {
      res.render('recruit-result1');
    });

    app.get('/recruit-result2', function(req, res) {
      res.render('recruit-result2');
    });

    app.get('/etc', function(req, res) {
      res.render('etc')
    });
    app.get('/activity', function(req, res) {
      res.render('activity')
    });
    app.get('/layout', function(req, res) {
      res.render('layout')
    });


};
