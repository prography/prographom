var mysql = require('mysql');

var hashMap = {}

var client = mysql.createConnection({
    host: 'ec2-13-125-55-125.ap-northeast-2.compute.amazonaws.com',
    user : 'root',
    password : 'hansol64',
    database : 'prography',
    multipleStatements: true
});

var n_th = 3;
dates = {'due_month': 8, 'due_day': 20, 'OT_month': 9, 'OT_day': 1, 'MT_month': 9, 'MT_day': 2};

module.exports = {
  hashMap: hashMap,
  client: client,
  n_th: n_th,
  dates: dates
}

var send = require('./send.js');
var application = require('./application.js');
var recruit = require('./recruit.js');
var admin = require('./admin.js');

module.exports = function(app)
{
    app.get('/', function (req,res) {
        res.render('index', {
            title: "프로그라피",
			url : req.protocol + '://' + req.headers.host + req.url
        })
    });
    app.get('/about', function (req,res) {
        res.render('about', {
            title: "프로그라피 소개",
			url : req.protocol + '://' + req.headers.host + req.url
        })
    });
    app.get('/activity', function (req, res) {
      res.render('activity', {
            title: "공식활동",
			url : req.protocol + '://' + req.headers.host + req.url
        })
    });
    app.get('/product', function (req, res) {
        res.render('product', {
            title: "포트폴리오",
			url : req.protocol + '://' + req.headers.host + req.url
        })
    });
    app.get('/history', function (req, res) {
        res.render('history', {
            title: "히스토리",
			url : req.protocol + '://' + req.headers.host + req.url
        })
    });
    
    app.use('/send', send);
    app.use('/application', application);
    app.use('/recruit', recruit);
    app.use('/admin', admin);
};
