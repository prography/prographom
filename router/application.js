const express = require('express')
const router = express.Router()

let hashMap = require('./main.js').hashMap
const client = require('./main.js').client
const n_th = require('./main.js').n_th
const dates = require('./main.js').dates

const reverseHash = (id) => {
    return hashMap[id]
}

router.get('/', (req ,res) => {
    const id = req.query.id
    if (!(id in hashMap)) {
        res.render('application/application-unauthorized', {'n_th': n_th, title: n_th + '기 지원서 작성', url: req.protocol + '://' + req.headers.host + req.url})
    } else {
        const email = reverseHash(id)

        require('date-utils')
        let date = new Date()
        date.setHours(date.getHours() + 9)
        const time = date.toFormat('YYYY-MM-DD HH24:MI:SS')

        if (time < '2020-02-29 14:00:00') {		 
            client.query(`SELECT submit FROM application WHERE email = ?`, [email], (error, result) => {
                if (error) {
                    console.log(error)
                } else {
                    if (result.length !== 0 && result[0].submit === 1) {
                        res.render('application/application-reject', {'n_th': n_th, title: n_th + "기 지원서 작성", url: req.protocol + '://' + req.headers.host + req.url})
                    } else {
                        const query_string = `SELECT name, sex, DATE_FORMAT(birth, \'%y-%m-%d\') AS birth, phone, college, address, field, github, email, q1, q2, q3, q3_1, q3_2, q5, q6, q7 FROM application WHERE email = ?`
                        client.query(query_string, [email], (error, results) => {
                            if (error) {
                                console.log(error)
                            } else {
                                if (results.length === 0) {
                                    res.render('application/application', {'dates': dates, 'n_th': n_th, 'data': {'email': email, 'q6': -1, 'q7': -1}, 'data2': [{}, {}, {}, {}, {}, {}, {}], title: n_th + "기 지원서 작성", url: req.protocol + '://' + req.headers.host + req.url})
                                } else {
                                    let data = results[0]
                                    if (data.q6 == null) data.q6 = -1
                                    if (data.q7 == null) data.q7 = -1
                                    const sql = `SELECT q4.field AS q4_field, term, activity FROM application, q4 WHERE application.email = q4.email and application.email = ?`
                                    client.query(sql, [email], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                        } else {
                                            const q4_length = results.length
                                            const remain_row = 7 - q4_length
                                            for (let i = 0; i < remain_row; i++) {
                                                results[q4_length + i] = {'q4_field': '', 'term': '', 'activity': ''}
                                            }
                                            res.render('application/application', {'dates': dates, 'n_th': n_th, 'data': data, 'data2': results, title: n_th + "기 지원서 작성", url: req.protocol + '://' + req.headers.host + req.url})
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        } else {
            res.render('application/application-fin', {'n_th': n_th, title: n_th + "기 지원서 작성" , url: req.protocol + '://' + req.headers.host + req.url})
        }
    }
})

router.post('/', (req, res) => {
    let body = req.body
    if (body.q6 === undefined) body.q6 = null
    if (body.q7 === undefined) body.q7 = null
    if (body.birth === '') body.birth = null

    let field_length = 0
    let term_length = 0
    let activity_length = 0
    for (let i = 0; i < 7; i++) {
        if (body.q4_field[i] !== '') field_length += 1
        if (body.term[i] !== '') term_length += 1
        if (body.activity[i] !== '') activity_length += 1
    }
    let q4_length = Math.max(field_length, term_length, activity_length)
    let application_params = [body.name, body.phone, body.sex, body.birth, body.college, body.address, body.field, body.github, body.q1, body.q2, body.q3, body.q3_1, body.q3_2, body.q5, body.q6, body.q7, n_th, 1, body.isSubmit]

    let q4_exists = 0
    client.query(`SELECT * FROM q4 WHERE email = ?`, [body.email], (error, result) => {
        if (result.length !== 0) q4_exists = 1
    })
    client.query(`SELECT * FROM application WHERE email = ?`, [body.email], (error, result) => {
        let query_string = ''
        if (result.length === 0) {
            query_string = `INSERT INTO application (email, name, phone, sex, birth, college, address, field, github, q1, q2, q3, q3_1, q3_2, q5, q6, q7, n_th, survived, submit) VALUES ('` + body.email + `', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        } else {
            query_string = `UPDATE application SET name=?, phone=?, sex=?, birth=?, college=?, address=?, field=?, github=?, q1=?, q2=?, q3=?, q3_1=?, q3_2=?, q5=?, q6=?, q7=?, n_th=?, survived=?, submit=? WHERE email = '` + body.email + `'`
            if (q4_exists) query_string += `; DELETE FROM q4 WHERE email = '` + body.email + `'`
        }
        client.query(query_string, application_params, (error, result) => {
            if (error) {
                console.log(error)
                console.log("Error in INSERT INTO application!")
            } else {
                for (let i = 0; i < q4_length; i++) {
                    client.query(`INSERT INTO q4 (email, field, term, activity) VALUES (?, ?, ?, ?)`, [body.email, body.q4_field[i], body.term[i], body.activity[i]], (error, result) => {
                        if (error) {
                            console.log("Error in INSERT INTO q4!")
                            return
                        }
                    })
                }
                res.sendStatus(200)
            }
        })
    })
})

module.exports = router
