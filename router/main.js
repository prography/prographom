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

    app.get('/recruit', function(req, res) {
        require('date-utils');
        var newDate = new Date();
        var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

        console.log(time); // remove;
        // before apply
        if (time < '2018-08-01 00:00:00')
           res.render('recruit-ing');
        // after apply
        else if (time < '2018-08-07 00:00:00')
           res.render('recruit-fin');
        // 1차 발표
        else if (time < '2018-08-09 00:00:00')
           res.render('recruit-result1');
        // 2차 발표
        else if (time < '2018-08-10 00:00:00')
           res.render('recruit-result2');

      });

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

    app.post('/send',function(req,res){
        email_to = req.body.email_to;
        rand = hash(email_to);
		hashMap[rand] = email_to;
		console.log(hashMap);
		setTimeout(function () {
			delete hashMap[rand];
			console.log(hashMap);
			}, 300000);
        host = req.get('host');
        link = "http://" + host + "/verify?id=" + rand;
        // link = "http://" + host + "/verify?id=" + email_to;

        mailOptions={
            to : email_to,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please click the link below to verify your email.<br><a href="+link+">Verify and write application form.</a>"
        }
        // console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response){
            if (error) {
                // console.log(error);
                // res.send("error");
            } else {
                console.log("Message sent: " + response.message);
                res.send("success");
            }
        });
    });

    app.get('/verify',function(req,res){
        console.log(req.protocol+":/" + req.get('host'));
        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
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
