var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var express = require('express');
// var bodyParser = require('body-parser');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var params = require('params');

var hashMap={}

function reverseHash(id){
	return hashMap[id];
}
function hash(email){
	return sha256("pRoG"+email+"rApHy");
}
function verify_user(id, pw){
	if(id=="웹팀이" && pw=="1등이야"){
		return true;
	}
	else{
		return false;
	}
}
var client = mysql.createConnection({
	host: 'ec2-13-125-217-76.ap-northeast-2.compute.amazonaws.com',
	user : 'root',
	password : '',
	database : 'prography'
});
client.connect(function(err) {
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

/* =================================================== */

module.exports = function(app)
{

	app.get('/test', function(req,res) {
		data=[{
				entry1:"1번의 entry1",
				entry2:"1번의 entry2",
			},
			{
				entry1:"2번의 entry1",
				entry2:"2번의 entry2",
			}]
		res.render('test', data)
});
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

    app.get('/admin', function(req, res) {
			if(!req.query.filter){
				res.render('admin-total');
			}
			else if(req.query.filter=="interviewTime"){
				var body = req.body;
				var sql = `SELECT name, sex, birth, phone, college, address, field , q1, q2, q3, q5
				FROM Applications, Applicants
				WHERE Applications.id = Applicants.email and interview_date = ? and interview_hour = ? and interview_min = ?`;
				var params = [body.date, body.hour, body.minute];

				client.query(sql, params, function (error, results) {
					 if (error){
						 console.log(error);
					 }
					 else {
						 console.log(results);
						 res.render('admin', {data:results});
					 }
				});
			}
			else if(req.query.filter=="result"){
				res.render('admin-result')
			}
  });

    app.post('/admin', function(req, res) {//조회하기 클릭 시 처리
			id=req.body.admin_id;
			pw=req.body.admin_pw;
			// console.log(id, pw);
			// if(verify_user(id, pw)){
				if(req.query.filter=='interviewTime'){
					var body = req.body;
		 		  var sql = `SELECT name, sex, birth, phone, college, address, field , q1, q2, q3, q5
		    	FROM Applications, Applicants
		    	WHERE Applications.id = Applicants.email and interview_date = ? and interview_hour = ? and interview_min = ?`;
		 		  var params = [body.date, body.hour, body.minute];

		      client.query(sql, params, function (error, results) {
			 			 if (error){
			 				 console.log(error);
			 			 }
			 			 else {
							 console.log(results);
			 				 res.send(results);
			 			 }
					});
				} else{
					res.redirect('/admin');
				}

			// }
			// else{
			// 	res.send("<h1>nope, don't even try</h1>")

  	});

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
			}
			else {
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


	// DB에 내용 추가
	app.post('/application', function(req, res) {
		var id = req.query.id;
		var body = req.body;
		var isSubmit = 0;
		if(body.submit) isSubmit = 1;

		// record가 있는지 없는지 select문으로 체크
		client.query(`SELECT * FROM Applications WHERE `),
		// 없을때는 insert, complete = isSubmit, 있을때는 update (id빼고 다) => complete == 1이면 Exception (이미 제출되었습니다!), 0이면 update, complete = isSubmit
		client.query(`INSERT INTO applications (id, sex, college, address, field, q1, q2, q3, q5) VALUES (?,?,?,?,?,?,?,?,?)` [ //
			id, body.college, body.address, body.field, body.q1, body.q2, body.q3, body.q5
		], function() {
			res.redirect('/application');
		});
	});

    app.post('/send',function(req,res){
        email_to=req.body.email_to;
        rand=hash(email_to);
				hashMap[rand]=email_to;
				console.log(hashMap);
				setTimeout(function(){
					delete hashMap[rand];
					console.log(hashMap);
				},300000);
        host=req.get('host');
        link="http://"+host+"/verify?id="+rand;
        // link="http://"+host+"/verify?id="+email_to;

        mailOptions={
            to : email_to,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please click the link below to verify your email.<br><a href="+link+">Verify and write application form.</a>"
        }
        // console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response){
         if(error){
            // console.log(error);
            // res.send("error");
         }else{
                console.log("Message sent: " + response.message);
            res.send("success");
             }
        });

    });

    app.get('/verify',function(req,res){
      console.log(req.protocol+":/"+req.get('host'));
      if((req.protocol+"://"+req.get('host'))==("http://"+host))
      {
          console.log("Domain is matched. Information is from Authentic email");
          if(req.query.id in hashMap)
          {
              console.log("email is verified");
							id=req.query.id;
              //register data to database


              //redirect to application page
              res.redirect('/application?id='+id);
          }
          else
          {
              console.log("email not verified");
              res.end("<h1>not verified.</h1>");
          }
      }
      else
      {
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


    app.get('/application', function(req ,res){
		// 정보가 있으면 select, 없으면 그냥~~
	  require('date-utils');
        var id=req.query.id;
				var user=reverseHash(id);
        var answers=['blah1','blah2','blah3','blah4'];
  	    var newDate = new Date();
    		var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
      //find the user info by the id from database



      //
      data={
        user,
        id,
        answers
      }
			console.log(data)
    //
		 // console.log(time); // remove
		 // apply 진행 중
		 if(id in hashMap){

			 if (time < '2018-08-01 00:00:00')
			 	res.render('application', data);
			 // after apply
			 else if (time < '2018-08-07 00:00:00')
			 	res.render('recruit-fin', data);
			 // 1차 발표
			 else if (time < '2018-07-09 00:00:00')
			 	res.render('recruit-result1', data);
			// 2차 발표
				else
					res.render('application',data);
		     }
		 else{
			 res.send('<h1>no id</h1>');
		 }
	 });
};
