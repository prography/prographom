const express = require('express')
const router = express.Router()

const client = require('./main.js').client

router.get('/', (req, res) => {
    if (req.session.adminUser) {
        if (!req.query.filter) {
            let sql = `SELECT email, name, field FROM application WHERE survived = 1 and submit = 1`
            client.query(sql, (error, results) => {
                if (error) {
                    console.log(error)
                } else {
                    res.render('admin/admin', {data: results, title: '운영진 페이지 - 전체 지원서', url: req.protocol + '://' + req.headers.host + req.url})
                }
            })
        } else if (req.query.filter == 'interviewTime') {
            res.render('admin/admin-interview', {title: '운영진 페이지 - 개별 지원서', url: req.protocol + '://' + req.headers.host + req.url})
        } else if (req.query.filter == 'specific') {
            const email = req.query.email

            let query_string = `SELECT name, sex, DATE_FORMAT(birth, \'%y-%m-%d\') AS birth, phone, college, address, field, github, email, q1, q2, q3, q3_1, q3_2, q5, q6, q7 FROM application WHERE email = ?`
            client.query(query_string, [email], (error, results) => {
                if (error) {
                    console.log(error)
                    client.end()
                } else {
                    let data = results[0]  
                    if (data.q6 == null) data.q6 = -1
                    if (data.q7 == null) data.q7 = -1
                    let sql = `SELECT q4.field AS q4_field, term, activity FROM application, q4 WHERE application.email = q4.email and application.email = ?`
                    client.query(sql, [email], (error, results) => {
                        if (error) {
                            console.log(error)
                        } else {
                            res.render('admin/admin-specific', {'data': data, 'data2': results, title: '운영진 페이지 - 개별 지원서', url: req.protocol + '://' + req.headers.host + req.url})
                        }
                    })
                }
            })
        }
    } else {
        res.render('admin/admin-login', {'err': false, 'errmsg': '', title: '운영진 페이지 로그인', url: req.protocol + '://' + req.headers.host + req.url})
    }
});

router.post('/', (req, res) => {
    if (req.query.filter == 'interviewTime') {
        let body = req.body
        let params = [body.date, body.hour, body.minute, body.field]
        client.query(`SELECT email, name, sex, DATE_FORMAT(birth, \'%y-%m-%d\'), phone, college, address, field, github, q1, q2, q3, q3_1, q3_2, q5, q6, q7
                    FROM application WHERE interview_date = ? and interview_hour = ? and interview_min = ? and field = ? and submit = 1 and survived = 1`, params, (error, results) => {
            if (error) {
                console.log(error)
            } else {
                count = 0
                if (results.length === 0) {
                    res.send(results)
                } else {
                    for (let i = 0; i < results.length; i++) {
                        results[i].q4 = {}
                        client.query(`SELECT ` + i + ` AS results_index, field, term, activity FROM q4 WHERE email = ?`, [results[i].email], (error, q4_results) => {
                            if (error) {
                                console.log(error)
                            } else {
                                for (let j = 0; j < q4_results.length; j++) {
                                    results[Number(q4_results[j].results_index)].q4[j] = q4_results[j]
                                }
                                count += 1
                                if (count == results.length) {
                                    res.send(results)
                                }
                            }
                        })
                    }
                }
            }
        })
    } else {
		let body = req.body
		if (body.admin_id == 'admin' && body.admin_pw == 'Prography1!') {
            req.session.adminUser = 'admin'
		    let sql = `SELECT email, name, field FROM application WHERE submit = 1 and survived = 1`
            client.query(sql, (error, results) => {
                if (error){
                    console.log(error)
                } else {
                    res.render('admin/admin', {data: results, title: '운영진 페이지 - 전체 지원서', url: req.protocol + '://' + req.headers.host + req.url})
                }
            })
		} else {
			res.render('admin/admin-login', {'err': true, 'errmsg': '아이디와 비밀 번호가 일치하지 않습니다.', title: '운영진 페이지 로그인', url: req.protocol + '://' + req.headers.host + req.url})
		}
    }
})

module.exports = router
