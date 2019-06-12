const express = require('express')
const router = express.Router()

const client = require('./main.js').client

const moment = require('moment-timezone')
const fileUpload = require('express-fileupload')
const path = require('path')

router.use(fileUpload())

router.get('/', (req, res) => {
    if (!req.session.user) {
        res.render('feed/feed-login', {err: false, errmsg: '', title: '프로그라피드 로그인', url: req.protocol + '://' + req.headers.host + req.url})
    } else {
        if (req.query.filter == 'specific') {
            let id = req.query.id;
            sql = 'SELECT * FROM pdfs WHERE id = ?'
            client.query(sql, [id], (error, results) => {
                if (error) {
                    console.log(error)
                } else {
                    res.render('feed/pdf', {err: false, title: '프로그라피드', url: req.protocol + '://' + req.header.host + req.url, pdf: results[0], user: req.session.user})
                }
            })
        } else {
            sql = 'SELECT * FROM pdfs ORDER BY created_at DESC'
            client.query(sql, (error, results) => {
                if (error) {
                    console.log(error)
                } else {
                    for (let i = 0; i < results.length; i++) {
                        results[i].created_at = moment(results[i].created_at).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')
                    }
                    res.render('feed/pdfs', {err: false, title: '프로그라피드', url: req.protocol + '://' + req.header.host + req.url, pdfs: results})
                }
            })
        }
    }
})

router.post('/', (req, res) => {
    if (req.files) {
        let pdf = req.files.pdf
        if (!pdf) {
            sql = 'SELECT * FROM pdfs ORDER BY created_at DESC'
            client.query(sql, (error, results) => {
                if (error) {
                    console.log(error)
                } else {
                    for (let i = 0; i < results.length; i++) {
                        results[i].created_at = moment(results[i].created_at).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')
                    }
                    res.render('feed/pdfs', {err: true, errmsg: '파일을 첨부해주세요!', title: '프로그라피드', url: req.protocol + '://' + req.header.host + req.url, pdfs: results})
                }
            })
            return
        } 
        let pdfName = req.files.pdf.name
        let reg = /pdf/

        if (!reg.test(pdfName)) {
            sql = 'SELECT * FROM pdfs ORDER BY created_at DESC'
            client.query(sql, (error, results) => {
                if (error) {
                    console.log(error)
                } else {
                    for (let i = 0; i < results.length; i++) {
                        results[i].created_at = moment(results[i].created_at).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')
                    }
                    res.render('feed/pdfs', {err: true, errmsg: '파일이 올바른 형식이 아닙니다!', title: '프로그라피드', url: req.protocol + '://' + req.header.host + req.url, pdfs: results})
                }
            })
        } else {
            pdf.mv(path.join(__dirname, '../public/uploaded/', pdfName), (err) => {
                if (err) { 
                    return res.status(500).send(err)
                } else {
                    sql = 'INSERT INTO pdfs (name, owner) VALUES (?, ?)'
                    client.query(sql, [pdfName, req.session.user], (error, results) => {
                        if (error) {
                            console.log(error)
                        } else {
                            sql = 'SELECT * FROM pdfs ORDER BY created_at DESC'
                            client.query(sql, (error, results) => {
                                if (error) {
                                    console.log(error)
                                } else {
                                    for (let i = 0; i < results.length; i++) {
                                        results[i].created_at = moment(results[i].created_at).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')
                                    }
                                    res.render('feed/pdfs', {err: false, title: '프로그라피드', url: req.protocol + '://' + req.header.host + req.url, pdfs: results})
                                }
                            })
                        }
                    })
                }
            })
        }

    } else {
		let body = req.body
		if (body.admin_id == 'client' && body.admin_pw == '1111') {
            req.session.user = 'client'
            sql = 'SELECT * FROM pdfs ORDER BY created_at DESC'
            client.query(sql, (error, results) => {
                if (error) {
                    console.log(error)
                } else {
                    for (let i = 0; i < results.length; i++) {
                        results[i].created_at = moment(results[i].created_at).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')
                    }
                    res.render('feed/pdfs', {err: false, title: '프로그라피드', url: req.protocol + '://' + req.header.host + req.url, pdfs: results})
                }
            })
        } else if (body.admin_id == 'admin' && body.admin_pw == 'Prography1!') {
            req.session.user = 'admin'
            sql = 'SELECT * FROM pdfs ORDER BY created_at DESC'
            client.query(sql, (error, results) => {
                if (error) {
                    console.log(error)
                } else { 
                    for (let i = 0; i < results.length; i++) {
                        results[i].created_at = moment(results[i].created_at).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')
                    }
                    res.render('feed/pdfs', {err: false, title: '프로그라피드', url: req.protocol + '://' + req.header.host + req.url, pdfs: results})
                }
            })
        } else {
			res.render('feed/feed-login', {'err': true, 'errmsg': '아이디와 비밀 번호가 일치하지 않습니다.', title: '프로그라피드 로그인', url: req.protocol + '://' + req.headers.host + req.url})
		}
    }
})

router.get('/logout', (req, res) => {
    req.session.user = null
    res.redirect('/feed')
})

router.post('/delete', (req, res) => {
    let id = req.body.pdf
    sql = 'DELETE FROM pdfs WHERE id = ?'
    client.query(sql, [id], (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.redirect('/feed')
        }
    })
})

module.exports = router
