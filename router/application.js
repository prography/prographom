var express = require('express');
var router = express.Router();

var hashMap={}

router.get('/', function(req ,res){
      // 정보가 있으면 select, 없으면 그냥~~
     require('date-utils');
        var id=req.query.id;
        var user=reverseHash(id);
        var answers=['blah1','blah2','blah3','blah4'];
         var newDate = new Date();
          var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
               
			   //var user = 'yesung000@naver.com';
			//var id = '4182a668a2d3924d6e4c5b1cb4d8e0cd213b9bfb4085e57786f2d182e09a74ca';

      //find the user info by the id from database



      //
      data={
        user,
        id,
        answers
      }
         console.log(data);
    //
	
       // apply 진행 중
       if(id in hashMap){
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
		
	   }
	});

// DB에 내용 추가
	router.post('/', function(req, res) {
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
		
		console.log(isSubmit);
		
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
		
		// record가 있는지 없는지 select문으로 체크
		client.query(`SELECT * FROM Applications WHERE id = ?`, params1, function(error, result){
			// 해당 id가 db에 존재하지 않으면 모든 내용을 insert
			if (result.length == 0) {

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
											else {
												//submit 버튼이면 submit을 1로 update
												if (isSubmit == 1){
													client.query(`UPDATE Applications SET submit = 1 WHERE id = ?`, params1, function(error, result){
														console.log(result);
														res.send(String(result));
													});
												}
												else {
													console.log(result);
													res.send(String(result));
												}
											}
										});
									}
								}
								else {
									//submit 버튼이면 submit을 1로 update
									if (isSubmit == 1){
										client.query(`UPDATE Applications SET submit = 1 WHERE id = ?`, params1, function(error, result){
											console.log(result);
											res.send(String(result));
										});
									}
									else {
										console.log(result);
										res.send(String(result));
									}
								}
							}
						});
					}
				});
			}
			
			
			
			// 해당 id가 db에 존재하면 update
			else {
				for (var k=0; k<9; k++){
					if (update1[k] == ''){
						update1[k] = null;
					}
				}
				
				for (var k=0; k<2; k++){
					if (update2[k] == ''){
						update2[k] = null;
					}
				}
					
				client.query(`UPDATE Applications SET sex=?, birth=?, college=?, address=?, field=?, q1=?, q2=?, q3=?, q5=? WHERE id=?`, update1, function(error, result) {
					if (error)
						console.log("Error in UPDATE Applications!");
					else {
						client.query(`UPDATE Applicants SET name=?, phone=? WHERE email=?`, update2, function(error, result) {
							if (error)
								console.log("Error in UPDATE Applicants!");
							else {
								client.query(`DELETE FROM Q4 WHERE application_id = ?`, params1, function(error, result){ //일단 지우고
									if (error)
										console.log("Error in DELETE FROM Q4!");
									else {
										if (q4_length == 0){
											//submit 버튼이면 submit을 1로 update
											if (isSubmit == 1){
												client.query(`UPDATE Applications SET submit = 1 WHERE id = ?`, params1, function(error, result){
													console.log(result);
													res.send(String(result));
												});
											}
											else {
												console.log(result);
												res.send(String(result));
											}
										}
										else {
											for (var i=0; i<q4_length; i++){
												client.query(`INSERT INTO Q4 (field, term, activity, application_id) VALUES (?, ?, ?, ?)`, [body.q4_field[i], body.term[i], body.activity[i], id], function(error, result){
													if (error)
														console.log("Error in INSERT INTO Q4(2)!");
													else {
														//submit 버튼이면 submit을 1로 update
														if (isSubmit == 1){
															client.query(`UPDATE Applications SET submit = 1 WHERE id = ?`, params1, function(error, result){
																console.log(result);
																res.send(String(result));
															});
														}
														else {
															console.log(result);
															res.send(String(result));
														}
													}
												});
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
