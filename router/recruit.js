const express = require('express')
const router = express.Router()

const client = require("./main.js").client
const n_th = require('./main.js').n_th
const dates = require('./main.js').dates

router.get('/', function(req, res) {
    if (req.query.filter && req.query.filter == 'checkSurvived') {
        var email = req.query.email;
        var query = `SELECT survived, name, interview_date, interview_hour, interview_min FROM application WHERE email = '` + email + `'`;
        client.query(query, function(error, result){
            if (error) {
                console.log(error);
            } else {
                res.send(result);
            }
        });
    } else {
        require('date-utils')
        let date = new Date()
        date.setHours(date.getHours() + 9) //서버 로컬 시간이 표준시간과 정확히 9시간 차이남
        let time = date.toFormat('YYYY-MM-DD HH24:MI:SS')
        
        const recruit_wait = 0 // 모집전 상태인 경우 1, 모집중 상태인 경우 0으로 변경
        
        if (recruit_wait === 1) {
            res.render('recruit/recruit-none', { // recruit_wait가 1이면 '모집전' 상태로 노출
				title: '지원하기(모집전)',
				url: req.protocol + '://' + req.headers.host + req.url
			})
        } else if (time < '2019-02-16 23:59:59'){ // '모집 종료일' 설정, 지원중 노출은 '모집 종료일' 자정 전 까지
            res.render('recruit/recruit-ing', {
				'n_th': n_th, 'due_month': dates.due_month,
				'due_day': dates.due_day,
				title: '지원하기(모집중)',
				url: req.protocol + '://' + req.headers.host + req.url
			})
        } else if (time < '2019-02-17 18:00:00'){ // '1차 발표일' 설정, 모집종료 노출은 '1차 발표일' 18시 전 까지
            res.render('recruit/recruit-fin', {
				'due_day': dates.due_day,
				title: '지원하기(모집종료)',
				url: req.protocol + '://' + req.headers.host + req.url
			})
        } else if (time < '2019-02-20 18:00:00'){ // '면접시간 선택 종료일' 설정, 1차 발표 노출은 '면접시간 선택  종료일' 18시 전 까지
            var query = `SELECT interview_date, interview_hour FROM application`;
            client.query(query, function(error, result){
                if (error) {
                    console.log(error);
                } else {
                    var interview_dict = {}
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].interview_date && result[i].interview_hour) {
                            var key = result[i].interview_date + ',' + result[i].interview_hour;
                            if (!(key in interview_dict)) {
                                interview_dict[key] = 1
                            } else {
                                interview_dict[key] += 1
                            }
                        }
                    }
                    var full_flag = [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
                    
                    var flag_count = 0;
                    var hour_arr = ['11', '12', '1', '2', '3', '4'];
                    var date_arr = ['25', '26'];

                    for (var hour in hour_arr) {
                        for (var date in date_arr) {
                            if (interview_dict[date_arr[date] + ',' + hour_arr[hour]] == 9) {
                                full_flag[flag_count] = 1;
                            }
                            flag_count += 1;
                        }
                    }
                    res.render('recruit/recruit-result1', {
                        'n_th': n_th,
                        title: '서류전형 결과 확인',
                        url: req.protocol + '://' + req.headers.host + req.url,
                        full_flag: full_flag
                    });

                }
            })
        } else if (time < '2019-02-24 18:00:00'){ // '면접종료시간' 설정, 면접시간확인 노출은 '면접종료시간' 전 까지
            res.render('recruit/recruit-result1-1', {
                'n_th': n_th,
				title: '면접시간확인',
				url: req.protocol + '://' + req.headers.host + req.url
			})
        } else if (time < '2019-02-26 18:00:00'){ // '2차 발표일' 설정, 모집종료 노출은 '2차 발표일' 18시 전 까지
            res.render('recruit/recruit-fin2', {
				'due_day': dates.due_day,
				title: '면접마감',
				url: req.protocol + '://' + req.headers.host + req.url
			})
        } else if (time < '2019-03-01 23:59:59'){ // '합격 공지 종료일' 설정, 2차발표 노출은 '합격 공지 종료일' 자정 전 까지
            res.render('recruit/recruit-result2', {
				'n_th': n_th,
				title: '2차 면접 결과 확인',
				url: req.protocol + '://' + req.headers.host + req.url
			})
        } else {
            res.render('recruit/recruit-none', {
				title: '지원하기(모집전)',
				url: req.protocol + '://' + req.headers.host + req.url
			})
        }
    }
})

router.post('/update', function (req, res) {
    var day = req.body.day;
    var hour = req.body.hour;
    var min = req.body.min;
    var email = req.body.email;

    var query = `SELECT interview_min, count(interview_min) AS count from application WHERE interview_date = ` + day + ` and interview_hour = ` + hour + ` GROUP BY interview_min ORDER BY interview_min`;
    client.query(query, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            var count = {0: 0, 20: 0, 40: 0};
            var total_count = 0;
            for (var row in result) {
                count[result[row].interview_min] += Number(result[row].count)
                total_count += Number(result[row].count);
            }

            if (total_count == 9) {
                res.send({'full': true});
            } else {
                var min = null;
                if (count[0] != 3) {
                    min = 0;
                } else if (count[20] != 3) {
                    min = 20;
                } else {
                    min = 40;
                }
                query = `UPDATE application SET interview_date = ` + day + `, interview_hour = ` + hour + `, interview_min = ` + min + ` WHERE email = '` + email + `'`;
                client.query(query, function (error, result) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send({'full': false, 'day': day, 'hour': hour, 'min': min});
                    }
                });
            }
        }
    });

});

router.post('/init', function (req, res) {
    var day = req.body.day;
    var hour = req.body.hour;
    var min = req.body.min;
    var email = req.body.email;

    query = `UPDATE application SET interview_date = ` + day + `, interview_hour = ` + hour + `, interview_min = ` + min + ` WHERE email = '` + email + `'`;
    client.query(query, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            res.send({'full': false, 'day': day, 'hour': hour, 'min': min});
        }
    });
});


module.exports = router;
