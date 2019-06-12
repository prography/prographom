const express = require('express')
const router = express.Router()

const client = require('./main.js').client
const n_th = require('./main.js').n_th
const dates = require('./main.js').dates

router.get('/', (req, res) => {
    if (req.query.filter && req.query.filter == 'checkSurvived') {
        let email = req.query.email
        let query = `SELECT survived, name, field, interview_date, interview_hour, interview_min FROM application WHERE email = '` + email + `'`
        client.query(query, (error, uresult) => {
            if (error) {
                console.log(error)
            } else {
                query = `SELECT field, interview_date, interview_hour FROM application`
                client.query(query, (error, result) => {
                    if (error) {
                        console.log(error)
                    } else {
                        let full_flags = {}
                        full_flags['front'] = [0, 0, 0, 0, 0, 0, 0, 0]
                        full_flags['nodejs'] = [0, 0, 0, 0, 0, 0, 0, 0]
                        full_flags['django'] = [0, 0, 0, 0, 0, 0, 0, 0]
                        full_flags['deep'] = [0, 0, 0, 0, 0, 0, 0, 0]

                        let interview_dict = {}
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].interview_date && result[i].interview_hour) {
                                let key = result[i].field + ',' + result[i].interview_date + ',' + result[i].interview_hour
                                if (!(key in interview_dict)) {
                                    interview_dict[key] = 1
                                } else {
                                    interview_dict[key] += 1
                                }
                            }
                        }
                        
                        let flag_count = 0
                        let hour_arr = ['1', '2', '3', '4']
                        let date_arr = ['23', '24']
                        let field_arr = ['front', 'nodejs', 'django', 'deep']

                        for (let hour in hour_arr) {
                            for (let date in date_arr) {
                                for (let field in field_arr) {
                                    if (interview_dict[field_arr[field] + ',' + date_arr[date] + ',' + hour_arr[hour]] == 4) {
                                        full_flags[field_arr[field]][flag_count] = 1
                                    }
                                }
                                flag_count += 1
                            }
                        }
                        res.send({'full_flags': full_flags, 'uresult': uresult})
                    }
                })
            }
        })
    } else {
        require('date-utils')
        let date = new Date()
        date.setHours(date.getHours() + 9) //서버 로컬 시간이 표준시간과 정확히 9시간 차이남
        let time = date.toFormat('YYYY-MM-DD HH24:MI:SS')
        
        const recruit_wait = 0 // 모집전 상태인 경우 1, 모집중 상태인 경우 0으로 변경
       
        console.log(time)
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
        } else if (time < '2019-02-17 14:00:00'){ // '1차 발표일' 설정, 모집종료 노출은 '1차 발표일' 14시 전 까지
            res.render('recruit/recruit-fin', {
				'due_day': dates.due_day,
				title: '지원하기(모집종료)',
				url: req.protocol + '://' + req.headers.host + req.url
			})
        } else if (time < '2019-02-17 23:59:59'){ // '면접시간 선택 종료일' 설정, 1차 발표 노출은 '면접시간 선택  종료일' 18시 전 까지
            res.render('recruit/recruit-result1', {
                'n_th': n_th,
                title: '서류전형 결과 확인',
                url: req.protocol + '://' + req.headers.host + req.url
            })
        } else if (time < '2019-02-24 16:00:00'){ // '면접종료시간' 설정, 면접시간확인 노출은 '면접종료시간' 전 까지
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

router.post('/update', (req, res) => {
    let day = req.body.day
    let hour = req.body.hour
    let min = req.body.min
    let email = req.body.email

    let query = `SELECT field FROM application WHERE email = '` + email + `'`
    client.query(query, (error, result) => {
        if (error) {
            console.log(error)
        } else {
            let field = result[0].field
            query = `SELECT interview_min, count(interview_min) AS count FROM application WHERE field = '` + field + `' AND interview_date = ` + day + ` AND interview_hour = ` + hour + ` GROUP BY interview_min ORDER BY interview_min`
            client.query(query, (error, result) => {
                if (error) {
                    console.log(error)
                } else {
                    var count = {0: 0, 30: 0}
                    var total_count = 0
                    for (var row in result) {
                        count[result[row].interview_min] += Number(result[row].count)
                        total_count += Number(result[row].count)
                    }

                    if (total_count == 4) {
                        res.send({'full': true})
                    } else {
                        var min = null
                        if (count[0] != 2) {
                            min = 0
                        } else if (count[30] != 2) {
                            min = 30
                        }
                        query = `UPDATE application SET interview_date = ` + day + `, interview_hour = ` + hour + `, interview_min = ` + min + ` WHERE email = '` + email + `'`
                        client.query(query, (error, result) => {
                            if (error) {
                                console.log(error)
                            } else {
                                res.send({'full': false, 'day': day, 'hour': hour, 'min': min})
                            }
                        })
                    }
                }
            })
        }
    })
})

router.post('/init', (req, res) => {
    let day = req.body.day
    let hour = req.body.hour
    let min = req.body.min
    let email = req.body.email

    query = `UPDATE application SET interview_date = ` + day + `, interview_hour = ` + hour + `, interview_min = ` + min + ` WHERE email = '` + email + `'`
    client.query(query, (error, result) => {
        if (error) {
            console.log(error)
        } else {
            res.send({'full': false, 'day': day, 'hour': hour, 'min': min})
        }
    })
})

module.exports = router
