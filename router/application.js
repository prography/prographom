var express = require('express');
var router = express.Router();

var hashMap = require('./main.js').hashMap;
var client = require('./main.js').client;
var n_th = require('./main.js').n_th;
var dates = require('./main.js').dates;

function reverseHash(id){
    return hashMap[id];
}

router.get('/', function(req ,res){
    var id = req.query.id;
    if (!(id in hashMap)) {
        res.render('application/application-unauthorized', {'n_th': n_th, title: n_th+"기 지원서 작성"});
    } else {
        var email = reverseHash(id);

        require('date-utils');
        var date = new Date();
        date.setHours(date.getHours() + 9);
        var time = date.toFormat('YYYY-MM-DD HH24:MI:SS');

        // if (id in hashMap) {}
        if (time < '2018-08-18 00:00:00') {		 
            client.query(`SELECT submit FROM application WHERE email = ?`, [email], function(error, result){
                if (error) {
                    console.log(error);
                } else {
                    if (result.length != 0 && result[0].submit == 1) {
                        res.render('application/application-reject', {'n_th': n_th, title: n_th+"기 지원서 작성", url : req.protocol + '://' + req.headers.host + req.url});
                    } else {
                        var query_string = `SELECT name, sex, DATE_FORMAT(birth, \'%y-%m-%d\') AS birth, phone, college, address, field, email, q1, q2, q3, q5, q6, q7 FROM application WHERE email = ?`;
                        client.query(query_string, [email], function(error, results){
                            if (error) {
                                console.log(error);
                            } else {
                                if (results.length == 0) {
                                    res.render('application/application', {'dates': dates, 'n_th': n_th, 'data': {'email': email, 'q6': -1, 'q7': -1}, 'data2': [{}, {}, {}, {}, {}, {}, {}], title: n_th+"기 지원서 작성", url : req.protocol + '://' + req.headers.host + req.url});
                                } else {
                                    var data = results[0];    
                                    if (data.q6 == null) data.q6 = -1;
                                    if (data.q7 == null) data.q7 = -1;
                                    var sql = `SELECT q4.field AS q4_field, term, activity FROM application, q4 WHERE application.email = q4.email and application.email = ?`;
                                    client.query(sql, [email], function(error, results){
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            var q4_length = results.length;
                                            var remain_row = 7 - q4_length;  
                                            for (var i = 0; i < remain_row; i++) {
                                                results[q4_length + i] = {'q4_field': '', 'term': '', 'activity': ''};
                                            }
                                            res.render('application/application', {'dates': dates, 'n_th': n_th, 'data': data, 'data2': results, title: n_th+"기 지원서 작성", url : req.protocol + '://' + req.headers.host + req.url});
                                        }
                                    });
                                }
                            }
                        }); 
                    }
                }
            });
        } else {
            res.render('application/application-fin', {'n_th': n_th, title: n_th+"기 지원서 작성" , url : req.protocol + '://' + req.headers.host + req.url});
        }
    }
});

router.post('/', function(req, res) {
    var body = req.body;
    if (body.q6 == undefined) body.q6 = null;
    if (body.q7 == undefined) body.q7 = null;
    if (body.birth == '') body.birth = null;

    var field_length = 0;
    var term_length = 0;
    var activity_length = 0;
    for (var i = 0; i < 7; i++) {
        if (body.q4_field[i] != '') field_length += 1;
        if (body.term[i] != '') term_length += 1;
        if (body.activity[i] != '') activity_length += 1;
    }
    var q4_length = Math.max(field_length, term_length, activity_length);
    var application_params = [body.name, body.phone, body.sex, body.birth, body.college, body.address, body.field, body.q1, body.q2, body.q3, body.q5, body.q6, body.q7, n_th, 1, body.isSubmit];

    var q4_exists = 0; 
    client.query(`SELECT * FROM q4 WHERE email = ?`, [body.email], function (error, result) {
        if (result.length != 0) q4_exists = 1;
    });
    client.query(`SELECT * FROM application WHERE email = ?`, [body.email], function (error, result) {
        var query_string = ''
        if (result.length == 0) {
            query_string = `INSERT INTO application (email, name, phone, sex, birth, college, address, field, q1, q2, q3, q5, q6, q7, n_th, survived, submit) VALUES ('` + body.email + `', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        } else {
            query_string = `UPDATE application SET name=?, phone=?, sex=?, birth=?, college=?, address=?, field=?, q1=?, q2=?, q3=?, q5=?, q6=?, q7=?, n_th=?, survived=?, submit=? WHERE email = '` + body.email + `'`;
            if (q4_exists) query_string += `; DELETE FROM q4 WHERE email = '` + body.email + `'`;
        }
        client.query(query_string, application_params, function(error, result){
            if (error) {
                console.log(error);
                console.log("Error in INSERT INTO application!");
            } else {
                for (var i = 0; i < q4_length; i++) {
                    client.query(`INSERT INTO q4 (email, field, term, activity) VALUES (?, ?, ?, ?)`, [body.email, body.q4_field[i], body.term[i], body.activity[i]], function(error, result){
                        if (error) {
                            console.log("Error in INSERT INTO q4!");
                            return;
                        } 
                    });
                }
                res.sendStatus(200);
            }
        });
    });
});

module.exports = router;
