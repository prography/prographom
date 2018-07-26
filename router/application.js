var express = require('express');
var router = express.Router();

var hashMap={}

router.get('/', function(req ,res){
    // 정보가 있으면 select, 없으면 그냥~~
    require('date-utils');
    //var id = req.query.id;
    //var user = reverseHash(id);
    var answers = ['blah1', 'blah2', 'blah3', 'blah4'];
    var newDate = new Date();
    var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');       
    var user = 'yesung000@naver.com';
    var id = '4182a668a2d3924d6e4c5b1cb4d8e0cd213b9bfb4085e57786f2d182e09a74ca';
    
    //find the user info by the id from database

    data={
        user,
        id,
        answers
    }
    console.log(data);
    //
    // console.log(time); // remove
    // apply 진행 중
    if (id in hashMap) {
        if (time < '2018-08-01 00:00:00') res.render('application', data);
        // after apply
        else if (time < '2018-08-07 00:00:00')
        res.render('recruit-fin', data);
        // 1차 발표
        else if (time < '2018-07-09 00:00:00')
        res.render('recruit-result1', data);
        // 2차 발표
        else
        res.render('application',data);
    } else {
        res.send('<h1>no id</h1>');
    }
    
});

// DB에 내용 추가
router.post('/', function(req, res) {
    //var id = req.query.id;
    var body = req.body;
    var id = body.id;
    var isSubmit = 0;
    if (body.submit) isSubmit = 1;
    
    console.log(body);
    console.log("id = " + id);
    
    // record가 있는지 없는지 select문으로 체크
    client.query(`SELECT * FROM Applications WHERE id = ?`,["id"], function(error, result){
        console.log(result);
        // 해당 id가 db에 존재하지 않으면 모든 내용을 insert
        if (result.length == 0) {
            /* client.query(`INSERT INTO Applications (id, sex, birth, college, address, field, q1, q2, q3, q5, q7, q8, submit) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 0)` ,[
                id, body.sex, body.birth, body.college, body.address, body.field, body.q1, body.q2, body.q3, body.q5, body.q7, body.q8
            ], function(error, result){ */
            client.query(`INSERT INTO Applications (id, sex, submit) VALUES (?,?, 0)`, [
                id, body.sex
            ], function (error, result) {
                if (error) {
                    console.log("Error!");
                } else {
                    client.query(`INSERT INTO Applicants (name, phone, email, n_th, survived) VALUES (?, ?, ?, 3, 1)`, [body.name, body.phone, id], function(error, result) {
                        // q4 여러개일때 어떻게 넣지?
                        client.query(`INSERT INTO Q4 (field, term, activity, application_id) VALUES (?, ?, ?, ?)`, [body.q4_field, body.term, body.activity, id], function(error, result){
                        });
                    });
                }
            });
        }
        // 해당 id가 db에 존재하면 update
        else {
            client.query(`UPDATE Applications SET sex=?, birth=?, college=?, address=?, field=?, q1=?, q2=?, q3=?, q5=?, q7=?, q8=? WHERE id=?`, [
                body.sex, body.birth, body.college, body.address, body.field, body.q1, body.q2, body.q3, body.q5, body.q7, body.q8, id
            ], function (error, result) {
                client.query(`UPDATE Applicants SET name=?, phone=? WHERE email=?`, [body.name, body.phone, id], function(error, result) {
                    // q4 여러개일때 어떻게 넣지?
                    client.query(`UPDATE Q4 SET field=?, term=?, activity=? WHERE application_id = ?`, [body.q4_field, body.term, body.activity, id], function(error, result){
                    });
                });
            });
        }
        
        //submit 버튼이면 submit을 1로 update
        if (isSubmit == 1) {
            client.query(`UPDATE Applications SET submit = 1 WHERE id = ?`, [user], function(){
            });
        }
    });			
    // 없을때는 insert, complete = isSubmit, 있을때는 update (id빼고 다) => complete == 1이면 Exception (이미 제출되었습니다!), 0이면 update, complete = isSubmit
    /* client.query(`INSERT INTO applications (id, sex, college, address, field, q1, q2, q3, q5) VALUES (?,?,?,?,?,?,?,?,?)` [ //
        id, baody.college, body.address, body.field, body.q1, body.q2, body.q3, body.q5
    ], function() {
        res.redirect('/application');
    })); */
});


module.exports = router;
