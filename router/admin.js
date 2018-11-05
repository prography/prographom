var express = require('express');
var router = express.Router();

var client = require("./main.js").client;

router.get('/', function(req, res) {
    if (req.session.adminUser) {
        if (!req.query.filter) {
            var sql = `SELECT email, name, field FROM application WHERE survived = 1 and submit = 1`;
            client.query(sql, function (error, results) {
                if (error){
                    console.log(error);
                } else {
                    res.render('admin/admin', {data: results, title: "운영진 페이지 - 전체 지원서", url: req.protocol + '://' + req.headers.host + req.url});
                }
            });
        } else if (req.query.filter == "interviewTime") {
            res.render('admin/admin-interview', {title: "운영진 페이지 - 개별 지원서", url: req.protocol + '://' + req.headers.host + req.url});
        } else if (req.query.filter == "specific") {
            var email = req.query.email;

            var query_string = `SELECT name, sex, DATE_FORMAT(birth, \'%y-%m-%d\') AS birth, phone, college, address, field, email, q1, q2, q3, q5, q6, q7 FROM application WHERE email = ?`;
            client.query(query_string, [email], function(error, results){
                if (error) {
                    console.log(error);
                    client.end();
                } else {
                    var data = results[0];    
                    if (data.q6 == null) data.q6 = -1;
                    if (data.q7 == null) data.q7 = -1;
                    var sql = `SELECT q4.field AS q4_field, term, activity FROM application, q4 WHERE application.email = q4.email and application.email = ?`;
                    client.query(sql, [email], function(error, results){
                        if (error) {
                            console.log(error);
                        } else {
                            res.render('admin/admin-specific', {'data': data, 'data2': results, title: "운영진 페이지 - 개별 지원서", url: req.protocol + '://' + req.headers.host + req.url});
                        }
                    });
                }
            });
        }
    } else {
        res.render('admin/admin-login', {'err': false, 'errmsg': '', title: "운영진 페이지 로그인", url: req.protocol + '://' + req.headers.host + req.url});
    }
});

router.post('/', function(req, res) {
    if (req.query.filter == "interviewTime") {
        var body = req.body;
        var params = [body.date, body.hour, body.minute];
        client.query(`SELECT email, name, sex, DATE_FORMAT(birth, \'%y-%m-%d\'), phone, college, address, field, q1, q2, q3, q5, q6, q7
                    FROM application WHERE interview_date = ? and interview_hour = ? and interview_min = ? and submit = 1 and survived = 1`, params, function (error, results) {
            if (error) {
                console.log(error);
            } else {
                count = 0;
                if (results.length == 0) {
                    res.send(results);
                } else {
                    for (var i = 0; i < results.length; i++) {
                        results[i].q4 = {};
                        client.query(`SELECT ` + i + ` AS results_index, field, term, activity FROM q4 WHERE email = ?`, [results[i].email], function (error, q4_results) {
                            if (error) {
                                console.log(error);
                            } else {
                                for (var j = 0; j < q4_results.length; j++) {
                                    results[Number(q4_results[j].results_index)].q4[j] = q4_results[j];
                                }
                                count += 1;
                                if (count == results.length) {
                                    res.send(results);
                                }
                            }
                        });
                    }
                }
            }
        });
    } else {
		var body = req.body;
		if (body.admin_id == 'webteam' && body.admin_pw == 'isbest') {
            req.session.adminUser = 'admin';
		    var sql = `SELECT email, name, field FROM application WHERE submit = 1 and survived = 1`;
            client.query(sql, function (error, results) {
                if (error){
                    console.log(error);
                } else {
                    res.render('admin/admin', {data: results, title: "운영진 페이지 - 전체 지원서", url: req.protocol + '://' + req.headers.host + req.url});
                }
            });
		} else {
			res.render('admin/admin-login', {'err': true, 'errmsg': '아이디와 비밀 번호가 일치하지 않습니다.', title: "운영진 페이지 로그인", url: req.protocol + '://' + req.headers.host + req.url});
		}
    }
});

module.exports = router;
