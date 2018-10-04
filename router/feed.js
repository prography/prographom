var express = require('express');
var router = express.Router();

var client = require("./main.js").client;

var moment = require('moment');
var fileUpload = require('express-fileupload');
var path = require('path');

router.use(fileUpload());

router.get('/', function(req, res){
    if (!req.session.user) {
        res.render('feed/feed-login', {err: false, errmsg: '', title: "프로그라피드 로그인", url: req.protocol + '://' + req.headers.host + req.url});
    } else {
        if (req.query.filter == "specific") {
            var id = req.query.id;
            sql = `SELECT * FROM pdfs WHERE id = ?`;
            client.query(sql, [id], function(error, results){
                if (error) {
                    console.log(error);
                } else {
                    res.render('feed/pdf', {err: false, title: "프로그라피드", url: req.protocol + '://' + req.header.host + req.url, pdf: results[0], user: req.session.user});
                }
            });
        } else {
            sql = `SELECT * FROM pdfs ORDER BY created_at DESC`;
            client.query(sql, function(error, results){
                if (error) {
                    console.log(error);
                } else {
                    for (var i = 0; i < results.length; i++) {
                        results[i].created_at = moment(results[i].created_at).format("YYYY-MM-DD HH:mm");
                    }
                    res.render('feed/pdfs', {err: false, title: "프로그라피드", url: req.protocol + '://' + req.header.host + req.url, pdfs: results});
                }
            });
        }
    }
});

router.post('/', function(req, res) {
    if (req.files) {
        var pdf = req.files.pdf;
        var pdfName = req.files.pdf.name;
        var reg = /pdf/

        if (!reg.test(pdfName)) {
            sql = `SELECT * FROM pdfs ORDER BY created_at DESC`;
            client.query(sql, function(error, results) {
                if (error) {
                    console.log(error);
                } else {
                    for (var i = 0; i < results.length; i++) {
                        results[i].created_at = moment(results[i].created_at).format("YYYY-MM-DD HH:mm");
                    }
                    res.render('feed/pdfs', {err: true, errmsg: '파일이 올바른 형식이 아닙니다!', title: "프로그라피드", url: req.protocol + '://' + req.header.host + req.url, pdfs: results});
                }
            });
        } else {
            pdf.mv(path.join(__dirname, '../public/uploaded/', pdfName), function (err) {
                if (err) { 
                    return res.status(500).send(err);
                } else {
                    sql = `INSERT INTO pdfs (name, owner) VALUES (?, ?)`;
                    client.query(sql, [pdfName, req.session.user], function(error, results) {
                        if (error) {
                            console.log(error);
                        } else {
                            sql = `SELECT * FROM pdfs ORDER BY created_at DESC`;
                            client.query(sql, function(error, results) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    for (var i = 0; i < results.length; i++) {
                                        results[i].created_at = moment(results[i].created_at).format("YYYY-MM-DD HH:mm");
                                    }
                                    res.render('feed/pdfs', {err: false, title: "프로그라피드", url: req.protocol + '://' + req.header.host + req.url, pdfs: results});
                                }
                            });          
                        }
                    });
                }
            });
        }

    } else {
		var body = req.body;
		if (body.admin_id == 'client' && body.admin_pw == '1111') {
            req.session.user = 'client';
            sql = `SELECT * FROM pdfs ORDER BY created_at DESC`;
            client.query(sql, function(error, results) {
                if (error) {
                    console.log(error);
                } else {
                    for (var i = 0; i < results.length; i++) {
                        results[i].created_at = moment(results[i].created_at).format("YYYY-MM-DD HH:mm");
                    }
                    res.render('feed/pdfs', {err: false, title: "프로그라피드", url: req.protocol + '://' + req.header.host + req.url, pdfs: results});
                }
            });
        } else if (body.admin_id == 'admin' && body.admin_pw == 'Prography1!') {
            req.session.user = 'admin';
            sql = `SELECT * FROM pdfs ORDER BY created_at DESC`;
            client.query(sql, function(error, results) {
                if (error) {
                    console.log(error);
                } else { 
                    for (var i = 0; i < results.length; i++) {
                        results[i].created_at = moment(results[i].created_at).format("YYYY-MM-DD HH:mm");
                    }
                    res.render('feed/pdfs', {err: false, title: "프로그라피드", url: req.protocol + '://' + req.header.host + req.url, pdfs: results});
                }
            });
        } else {
			res.render('feed/feed-login', {'err': true, 'errmsg': '아이디와 비밀 번호가 일치하지 않습니다.', title: "프로그라피드 로그인", url: req.protocol + '://' + req.headers.host + req.url});
		}
    }
});

router.get('/logout', function(req, res){
    req.session.user = null;
    res.redirect('/feed');
});

router.post('/delete', function(req, res) {
    var id = req.body.pdf;
    sql = `DELETE FROM pdfs WHERE id = ?`
    client.query(sql, [id], function(error, results){
        if (error) {
            console.log(error);
        } else {
            res.redirect('/feed');
        }
    });
});

module.exports = router;
