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
    console.log("Connected!");
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
                res.render('admin', {data:results});
            }
        });
    } else if(req.query.filter=="result"){
        res.render('admin-result')
    }
});

module.exports = router;
