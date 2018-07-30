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

var hashMap=require("./main.js").hashMap;
function reverseHash(id){
    return hashMap[id];
}
/* router.get('/', function(req ,res){
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
        res.render('recruit/recruit-fin', data);
        // 1차 발표
        else if (time < '2018-07-09 00:00:00')
        res.render('recruit/recruit-result1', data);
        // 2차 발표
        else
        res.render('application',data);
    } else {
        res.send('<h1>no id</h1>');
    }

}); */

router.get('/', function(req ,res){
      // 정보가 있으면 select, 없으면 그냥~~
      console.log(hashMap);
     require('date-utils');
        var id=req.query.id;
		var user=reverseHash(id);
		
        var answers=[];
         var newDate = new Date();
          var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

       // apply 진행 중
       if(id in hashMap){
		if (true) {

          if (time < '2018-08-01 00:00:00'){
			  
			client.query(`SELECT submit FROM Applications WHERE id = ?`, [user], function(error, result){
				if (error) console.log(error);
				else {
					if (result.length !=0 && result[0].submit == 1){
						res.render('application-reject');
					}
				}
			});
				
			  var sql = `SELECT name, sex, DATE_FORMAT(birth, \'%y-%m-%d\') AS birth, phone, college, address, field, email, q1, q2, q3, q5, q7, q8
			  FROM Applications, Applicants
			  WHERE Applications.id = Applicants.email and Applicants.email = ?`;
			  
			  var params = [user];
			  
			  client.query(sql, params, function(error, results){
				  if (error) console.log(error);
				  else {
					  if (results.length == 0){
						  res.render('application', {'data':{'email':user, 'q7':-1, 'q8':-1}, 'data2':[{},{},{},{},{},{},{}]});
					  }
					  var data = results[0];
					  
					  var sql = `SELECT Q4.field AS q4_field, term, activity
					  FROM Applications, Q4
					  WHERE Applications.id = Q4.application_id and Applications.id = ?`;
					  
					  client.query(sql, params, function(error, results){
						  if (error) console.log(error);
						  else {
							  var q4_length = results.length;
							  var remain_row = 7 - q4_length;
							  
							  for (var i = 0; i < remain_row; i++) {
								  results[q4_length + i] = {'q4_field': '', 'term': '', 'activity': ''};
							  }
							  res.render('application', {'data':data, 'data2':results});
						  }
					  });
				  }
			  });
		  }
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
	  }
	});

// DB에 내용 추가
	router.post('/', function(req, res) {
		var body = req.body;
		var id = body.id;
		var isSubmit = 0;
		if(body.isSubmit) isSubmit = 1;
		console.log(body.isSubmit);
		console.log(body);
		if (body.q7 == undefined) body.q7 = null;
		if (body.q8 == undefined) body.q8 = null;

		var field_length = 0; var term_length = 0; var activity_length = 0;
		for (var i=0; i<7; i++){
			if (body.q4_field[i] == "")
				body.q4_field[i] = null;
			else 
				field_length ++;
		}
		for (var i=0; i<7; i++){
			if (body.term[i] == "")
				body.term[i] = null;
			else 
				term_length ++;
		}
		for (var i=0; i<7; i++){
			if (body.activity[i] == "")
				body.activity[i] = null;
			else 
				activity_length ++;
		}
		
		var q4_length = field_length;
		if (q4_length < term_length) q4_length = term_length;
		if (q4_length < activity_length) q4_length = activity_length;
		
		console.log(body.q4_field);
		console.log(body.term);
		console.log(body.activity);
		var params1 = [id];
		var params2 = [id, body.sex, body.birth, body.college, body.address, body.field, body.q1, body.q2, body.q3, body.q5, body.q7, body.q8];
		console.log(params2);
		var params3 = [body.name, body.phone, id];
		var q4 = [body.q4_field, body.term, body.activity];
		var update1 = [body.sex, body.birth, body.college, body.address, body.field, body.q1, body.q2, body.q3, body.q5, body.q7, body.q8, id];
		var update2 = [body.name, body.phone, id];
		var update3 = [body.q4_field, body.term, body.activity, id];
        
        for (var k=0; k<12; k++){
            if (params2[k] == ''){
                params2[k] = null;
            }
        }

        for (var k=0; k<2; k++){
            if (params3[k] == ''){
                params3[k] = null;
            }
        }	
		// record가 있는지 없는지 select문으로 체크
		client.query(`SELECT * FROM Applications WHERE id = ?`, params1, function(error, result){
			// 해당 id가 db에 존재하지 않으면 모든 내용을 insert
			if (result.length == 0) {
				client.query(`INSERT INTO Applications (id, sex, birth, college, address, field, q1, q2, q3, q5, q7, q8, submit) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 0)`, params2, function(error, result){
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
										});
									}
									//submit 버튼이면 submit을 1로 update
									if (isSubmit == 1){
										client.query(`UPDATE Applications SET submit = 1 WHERE id = ?`, params1, function(error, result){
											//console.log(result);
											res.sendStatus(200);
										});
									}
									else {
										//console.log(result);
										res.sendStatus(200);
									}
								}
								else {
									//submit 버튼이면 submit을 1로 update
									if (isSubmit == 1){
										client.query(`UPDATE Applications SET submit = 1 WHERE id = ?`, params1, function(error, result){
											//console.log(result);
											res.sendStatus(200);
										});
									}
									else {
										//console.log(result);
										res.sendStatus(200);
									}
								}
							}
						});
					}
				});
			}



			// 해당 id가 db에 존재하면 update
			else {
				/*
				// 나중에 손 볼 부분 -> 사용자가 제출 완료한 상태에서 close하고 다시 수정해서 제출 버튼 눌렀을 시!
				client.query(`SELECT submit FROM Applications WHERE id = ?`, params1, function(error, result){
					if (error) console.log(error);
					else {
						console.log(result[0]);
						if (result[0].submit == 1){
							res.render('application-reject');
							return;
						}
					}
				}); */
				
				for (var k=0; k<11; k++){
					if (update1[k] == ''){
						update1[k] = null;
					}
				}

				for (var k=0; k<2; k++){
					if (update2[k] == ''){
						update2[k] = null;
					}
				}
		        console.log(update1);			
				client.query(`UPDATE Applications SET sex=?, birth=?, college=?, address=?, field=?, q1=?, q2=?, q3=?, q5=?, q7=?, q8=? WHERE id=?`, update1, function(error, result) {
					if (error)
						console.log("Error in UPDATE Applications!");
					else {
						client.query(`UPDATE Applicants SET name=?, phone=? WHERE email=?`, update2, function(error, result) {
							if (error)
								console.log("Error in UPDATE Applicants!");
							else {
								client.query(`DELETE FROM Q4 WHERE application_id = ?`, params1, function(error, result){ //일단 지우고
									console.log("q4 = " + q4);
									if (error)
										console.log("Error in DELETE FROM Q4!");
									else {
										if (q4_length == 0){
											//submit 버튼이면 submit을 1로 update
											if (isSubmit == 1){
												client.query(`UPDATE Applications SET submit = 1 WHERE id = ?`, params1, function(error, result){
													//console.log("1. " + result);
													res.sendStatus(200);
												});
											}
											else {
												//console.log("2. " + result);
												res.sendStatus(200);
											}
										}
										else {
											for (var i=0; i<q4_length; i++){
												client.query(`INSERT INTO Q4 (field, term, activity, application_id) VALUES (?, ?, ?, ?)`, [body.q4_field[i], body.term[i], body.activity[i], id], function(error, result){
													if (error)
														console.log("Error in INSERT INTO Q4(2)!");
												});
											}
											//submit 버튼이면 submit을 1로 update
											if (isSubmit == 1){
												client.query(`UPDATE Applications SET submit = 1 WHERE id = ?`, params1, function(error, result){
													//console.log("3. " + result);
													res.sendStatus(200);
												});
											}
											else {
												//console.log("4. " + result);
												res.sendStatus(200);
												return;
											}
										}
									}
								});
							}
						});
					}
				});
			}
		});
	});


module.exports = router;
