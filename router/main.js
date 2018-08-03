var mysql = require('mysql');

var hashMap = {}

var client = mysql.createConnection({
    host: 'ec2-13-125-55-125.ap-northeast-2.compute.amazonaws.com',
    user : 'root',
    password : 'hansol64',
    database : 'prography',
    multipleStatements: true
});

client.connect(function (err) {
    console.log("Connected!");
});

var n_th = 3;
dates = {'due_month': 8, 'due_day': 1, 'OT_month': 9, 'OT_day': 1, 'MT_month': 9, 'MT_day': 2};

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
        res.render('index')
    });
    app.get('/about', function (req,res) {
        res.render('about')
    });
    app.get('/activity', function (req, res) {
      res.render('activity')
    });
    app.get('/product', function (req, res) {
        res.render('product')
    });
    app.get('/history', function (req, res) {
        res.render('history')
    });
    
    app.use('/send', send);
    app.use('/application', application);
    app.use('/recruit', recruit);
    app.use('/admin', admin);
};
