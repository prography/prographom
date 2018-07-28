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

var hashMap={}
module.exports={
  hashMap:hashMap
}

function reverseHash(id){
    return hashMap[id];
}
function hash(email){
    return sha256("pRoG" + email + "rApHy");
}
function verify_user(id, pw){
    if (id == "webteam" && pw == "isbest") {
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
var application_specific = require('./application-specific.js');
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
        res.render('login', {'data': {}})
    });
	app.post('/login', function(req, res){
		var body = req.body;
		if (verify_user(body.admin_id, body.admin_pw)){
			var body = req.body;
			var sql = `SELECT application_id, email, name, field
				FROM Applications, Applicants 
				WHERE Applications.id = Applicants.email`;

			client.query(sql, function (error, results) {
				if (error){
					console.log(error);
				} else {
					// console.log(results);
					res.render('admin/admin-total', {data: results});
				}
			});
		}
		else {
			res.render('login', {'data': '<script type="text/javascript">alert("아이디와 비밀 번호가 일치하지 않습니다.");</script>'});
		}
	});
    app.use('/admin', admin);
    app.use('/application', application);
    app.use('/application-specific', application_specific);
    app.use('/recruit', recruit);
    app.use('/send', send);
    app.use('/verify', verify);
    app.get('/recruit-fin', function(req, res) {
      res.render('recruit/recruit-fin');
    });

    app.get('/check_result1', function(req, res){
        var email = req.query.email
		var query = "SELECT survived, name FROM Applicants WHERE email = '"+email+"'";
        client.query(query, function(error, result){
            if (error){
                console.log('에러');
            } else {
                res.send(result);

            }
        });
    });

    app.post('/inputTime', function(req, res){
        var day = req.body.day;
        var hour = req.body.hour;
        var min = req.body.min;
        var email = req.body.email;
        console.log(day);
        console.log(hour);
        console.log(min);
        console.log(email);


        var query = "UPDATE Applications SET interview_date = "+day+", interview_hour = "+hour+", interview_min = "+min+" WHERE id = '"+email+"'";
        console.log('쿼리문성공');
        client.query(query, function(error, result){
            if (error){
                console.log('에러');
                console.log(error);
            }
            else {
                console.log('mainelse성공');
                res.send(result);
            }
        });
    });



    app.get('/recruit-result1', function(req, res) {
      res.render('recruit/recruit-result1');
    });

    app.get('/recruit-result2', function(req, res) {
      res.render('recruit/recruit-result2');
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
