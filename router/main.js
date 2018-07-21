var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var path = require('path');

var client = mysql.createConnection({
	user : 'root',
	password : 'ilove1421',
	database : 'prography'
});
var app = express();
app.use(bodyParser.urlencoded({
	extended : false
}));

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
    app.get('/', function(req,res) {
    	res.render('index.html')
	});
    app.get('/about', function(req,res) {
    	res.render('about.html')
	});
    app.get('/history', function(req, res) {
      res.render('history.html')
    });

    app.get('/login', function(req, res) {
      res.render('login.html')
  });

    app.get('/product', function(req, res) {
      res.render('product.html')
  });

    app.get('/admin', function(req, res) {
      res.render('admin.html')
  });

    app.get('/admin', function(req, res) {
      res.render('admin.html')
  });





    app.get('/recruit', function(req, res) {
        require('date-utils');
        var newDate = new Date();
        var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

        console.log(time); // remove
        // before apply
        if (time < '2018-08-01 00:00:00')
           res.render('recruit-ing.html');
        // after apply
        else if (time < '2018-08-07 00:00:00')
           res.render('recruit-fin.html');
        // 1차 발표
        else if (time < '2018-08-09 00:00:00')
           res.render('recruit-result1');
        // 2차 발표
        else if (time < '2018-08-10 00:00:00')
           res.render('recruit-result2.html');

      });

    app.get('/recruit-fin', function(req, res) {
      res.render('recruit-fin.html');
    });

    app.get('/recruit-result1', function(req, res) {
		var name= "국지원";
//		client.connect();
//		client.query('SELECT name FROM members', function(error, result, fields) {
//			if (error){
//				console.log(error);
//			} else {
//				console.log(result);
//			}
//
//			client.end();
//	   	});

      data={
        name
      }
      res.render('recruit-result1', data);

    });

    app.get('/recruit-result2', function(req, res) {
      res.render('recruit-result2.html');
    });

    app.get('/application', function(req, res) {
      res.render('application.html')
    });
	
	// DB에 내용 추가
	app.post('/application', function(req, res) {
		var id = req.query.id;
		var body = request.body;
		
		client.query(`INSERT INTO applications (id) VALUES (?)`, [
			id
		], function() {
			client.query(`INSERT INTO applications (sex, college, address, field, q1, q2, q3, q5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
				body.sex, body.college, body.address, body.field, body.q1, body.q2, body.q3, body.q5
			], /* function() {
				client.query(`INSERT INTO applicants (name, phone, n_th, application_id) VALUES (?, ?, ?, ?)`, [
				body.name, body.phone, 3, id
				], function() { */
					response.redirect('/application');
				});
			});
		});
	});

    app.get('/send',function(req,res){
        rand=sha256(req.query.to);
        host=req.get('host');
        link="http://"+req.get('host')+"/verify?id="+rand;
        mailOptions={
            to : req.query.to,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please click the link below to verify your email.<br><a href="+link+">Verify and write application form.</a>"
        }
        // console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response){
         if(error){
                console.log(error);
            res.end("error");
         }else{
                console.log("Message sent: " + response.message);
            res.end("sent");
             }
        });

    });
    app.get('/verify',function(req,res){
      console.log(req.protocol+":/"+req.get('host'));
      if((req.protocol+"://"+req.get('host'))==("http://"+host))
      {
          console.log("Domain is matched. Information is from Authentic email");
          if(req.query.id==rand)
          {
              console.log("email is verified");
              data={
                id:req.query.id,
                user:req.query.to,

              };
              //register data to database


              //redirect to application page
              res.redirect('/apply?id='+req.query.id);
          }
          else
          {
              console.log("email not verified");
              res.end("<h1>Bad Request</h1>");
          }
      }
      else
      {
          res.end("<h1>Request from unknown source");
      }
    });

    app.get('/etc', function(req, res) {
      res.render('etc.html')
    });
    app.get('/activity', function(req, res) {
      res.render('activity.html')
    });
    app.get('/layout', function(req, res) {
      res.render('layout.html')
    });


    app.get('/apply', function(req ,res){
	  require('date-utils');
        var id=req.query.id;
        var user="example@prography.com";
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
    //
		 console.log(time); // remove
		 // apply 진행 중
		 if (time < '2018-08-01 00:00:00')
		 	res.render('apply.ejs', data);
		 // after apply
		 else if (time < '2018-08-07 00:00:00')
		 	res.render('recruit-fin.html');
		 // 1차 발표
		 else if (time < '2018-07-09 00:00:00')
		 	res.render('recruit-result1.html');
		// 2차 발표
		else
			res.render('recruit-result2.html');
     });
}
