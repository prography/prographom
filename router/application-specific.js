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
    var id = req.query.id;
    var sql = `SELECT name, sex, birth, phone, college, address, field, email, q1, q2, q3, q5, q7, q8
    FROM Applications, Applicants
    WHERE Applications.id = Applicants.email and Applicants.application_id=?`;
    
    var params = [id];

    client.query(sql, params, function (error, results) {
        if (error){
            console.log(error);
        } else {
            var data = results[0];
            var email = data.email;

            var sql = `SELECT Q4.field, term, activity
            FROM Applications, Q4
            WHERE Applications.id = Q4.application_id and Q4.application_id=?`;
            
            var params = [email];

            client.query(sql, params, function (error, results) {
                if (error){
                    console.log(error);
                } else {
                    res.render('application-specific', {'data': data, 'data2':results});
                }
            });
        }
    });
});

module.exports = router;
