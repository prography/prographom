var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var client = mysql.createConnection({
    host: 'ec2-13-125-217-76.ap-northeast-2.compute.amazonaws.com',
    user : 'root',
    password : '',
    database : 'prography',
    multipleStatements: true
});

client.connect(function (err) {
    if (err) throw err;
});

router.get('/', function(req, res) {
    if(!req.query.filter) {
        var body = req.body;
        //var sql = `SELECT Applications.id AS id, name, sex, birth, phone, college, address, Applications.field AS field, q1, q2, q3, q5, q7, q8
        //FROM Applications, Applicants
        //WHERE Applications.id = Applicants.email;
        //SELECT Q4.field AS q4_field, term, activity, application_id
        //FROM Applications, Q4
        //WHERE Applications.id = Q4.application_id`;
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
    } else if (req.query.filter == "interviewTime") {
        var body = req.body;
        var sql = `SELECT name, sex, birth, phone, college, address, field , q1, q2, q3, q5, q7, q8
        FROM Applications, Applicants
        WHERE Applications.id = Applicants.email and interview_date = ? and interview_hour = ? and interview_min = ?`;
        var params = [body.date, body.hour, body.minute];

        client.query(sql, params, function (error, results) {
            if (error){
                console.log(error);
            } else {
                res.render('admin/admin', {data:results});
            }
        });
    } else if(req.query.filter=="result"){
        res.render('admin/admin-result')
    }
});

router.post('/', function(req, res) {//조회하기 클릭 시 처리
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

module.exports = router;
