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
	database : 'prography',
	multipleStatements: true
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
				var sql = `SELECT name, sex, birth, phone, college, address, field , q1, q2, q3, q5, q7, q8
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
		 		  var params = [body.date, body.hour, body.minute];
				  console.log(params);

		      client.query(`SELECT Applications.id AS id, name, sex, DATE_FORMAT(birth, \'%y-%m-%d\'), phone, college, address, Applications.field AS field, q1, q2, q3, q5, q7, q8
		    	FROM Applications, Applicants
		    	WHERE Applications.id = Applicants.email and interview_date = ? and interview_hour = ? and interview_min = ?;
				SELECT Q4.field AS q4_field, term, activity, application_id
		    	FROM Applications, Q4
		    	WHERE Applications.id = Q4.application_id`, params, function (error, results) {
			 			 if (error){
			 				 console.log(error);
			 			 }
			 			 else {
							 //console.log(results);
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
		//var id = req.query.id;
		var body = req.body;
		var id = body.id;
		var isSubmit = 0;
		if(body.submit) isSubmit = 1;
		var params1 = [id];
		var params2 = [id, body.sex, body.birth, body.college, body.address, body.field, body.q1, body.q2, body.q3, body.q5];
		var params3 = [body.name, body.phone, id];
		var q4 = [body.q4_field, body.term, body.activity];
		var update1 = [body.sex, body.birth, body.college, body.address, body.field, body.q1, body.q2, body.q3, body.q5, id];
		var update2 = [body.name, body.phone, id];
		var update3 = [body.q4_field, body.term, body.activity, id];
		
		var q4_length = 0;
		//find longest q4 length
		for (var i=0; i<3; i++){
			var temp = 0;
			for (var j=0; j<7; j++){
				if (q4[i][j] != '')
					temp++;
			}
			if (temp > q4_length)
				q4_length = temp;
		}
		console.log("q4_length: " + q4_length);
		
		// record가 있는지 없는지 select문으로 체크
		client.query(`SELECT * FROM Applications WHERE id = ?`, params1, function(error, result){
			// 해당 id가 db에 존재하지 않으면 모든 내용을 insert
			if (result.length == 0) {
				console.log("정보 없음");
				client.query(`INSERT INTO Applications (id, sex, birth, college, address, field, q1, q2, q3, q5, submit) VALUES (?,?,?,?,?,?,?,?,?,?, 0)`, params2, function(error, result){
					if (error)
						console.log("Error in INSERT INTO Applications!");
					else {
						client.query(`INSERT INTO Applicants (name, phone, email, n_th, survived) VALUES (?, ?, ?, 3, 1)`, params3, function(error, result) {
							if (error)
								console.log("Error in INSERT INTO Applicants!");
							else {
								if (q4_length > 0) { // q4에 정보를 넣었을 때
									for (var i=0; i<q4_length; i++){
										client.query(`INSERT INTO Q4 (field, term, activity, application_id) VALUES (?, ?, ?, ?)`, [body.q4_field[i], body.term[i], body.activity[i], id], function(error, result){
											if (error)
												console.log("Error in INSERT INTO Q4!");
											else
												res.redirect('application', String(result));
										});
									}
								}
								else {
									res.redirect('application', String(result));
								}
							}
						});
					}
				});
			}
			
			
			
			// 해당 id가 db에 존재하면 update
			else {
				console.log("정보 이미 존재");
				
				for (var k=0; k<9; k++){
					if (update1[k] == ''){
						update1[k] = null;
					}
				}
				console.log(update1);
				
				for (var k=0; k<2; k++){
					if (update2[k] == ''){
						update2[k] = null;
					}
				}
				console.log(update2);
					
				client.query(`UPDATE Applications SET sex=?, birth=?, college=?, address=?, field=?, q1=?, q2=?, q3=?, q5=? WHERE id=?`, update1, function(error, result) {
					if (error)
						console.log("Error in UPDATE Applications!");
					else {
						client.query(`UPDATE Applicants SET name=?, phone=? WHERE email=?`, update2, function(error, result) {
							if (error)
								console.log("Error in UPDATE Applicants!");
							else {
								var post_length;
							
								client.query(`SELECT application_id FROM Q4 WHERE application_id = ?`, params1, function(error, res){
									post_length = res.length;
									console.log("post_length: " + post_length);
									if (post_length > q4_length){
										console.log("post>q4");
										client.query(`DELETE FROM Q4 WHERE application_id = ?`, params1, function(error, result){ //일단 지우고
											if (error)
												console.log("Error in DELETE FROM Q4!");
											else {
												for (var i=0; i<q4_length; i++){
													client.query(`INSERT INTO Q4 (field, term, activity, application_id) VALUES (?, ?, ?, ?)`, [body.q4_field[i], body.term[i], body.activity[i], id], function(error, result){
														if (error)
															console.log("Error in INSERT INTO Q4(2)!");
														else 
															res.redirect('application', String(result));
													});
												}
											}
										});
									}
									else {
										console.log("post<=q4");
										for (var i=0; i<q4_length; i++){
											client.query(`UPDATE Q4 SET field=?, term=?, activity=? WHERE application_id = ?`, [body.q4_field[i], body.term[i], body.activity[i], id], function(error, result){
												if (error)
													console.log("Error in UPDATE Q4(2)!");
												else
													res.redirect('application', String(result));
											});
										}										
									}	
								});
							}
						});
					}
				});
			}
			
			//submit 버튼이면 submit을 1로 update
			if (isSubmit == 1){
				client.query(`UPDATE Applications SET submit = 1 WHERE id = ?`, params1, function(error, result){
					
				});
			}
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
        //var id=req.query.id;
        //var user=reverseHash(id);
        var answers=['blah1','blah2','blah3','blah4'];
         var newDate = new Date();
          var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
               
			   var user = 'yesung000@naver.com';
			var id = '4182a668a2d3924d6e4c5b1cb4d8e0cd213b9bfb4085e57786f2d182e09a74ca';

      //find the user info by the id from database



      //
      data={
        user,
        id,
        answers
      }
         console.log(data);
    //
       // console.log(time); // remove
       // apply 진행 중
       //if(id in hashMap){
		if (true) {

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
		
	   //}
	});
};