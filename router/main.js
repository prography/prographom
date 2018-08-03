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

var application = require('./application.js');
var admin = require('./admin.js');
var recruit = require('./recruit.js');
var send = require('./send.js');

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

    app.use('/application', application);
    app.use('/admin', admin);
    app.use('/recruit', recruit);
    app.use('/send', send);

    app.get('/check_result1', function(req, res){
        var email = req.query.email;
        var query = `SELECT survived, name FROM application WHERE email = '` + email + `'`;
        client.query(query, function(error, result){
            if (error){
                console.log(error);
            }
            else {
                res.send(result);
            }
        });
    });

    app.post('/inputTime', function(req, res){
        var day = req.body.day;
        var hour = req.body.hour;
        var min = req.body.min;
        var email = req.body.email;

        var query = "UPDATE Applications SET interview_date = "+day+", interview_hour = "+hour+", interview_min = "+min+" WHERE id = '"+email+"'";
        console.log('쿼리문성공');
        client.query(query, function(error, result){
            if (error){
                console.log('에러');
                console.log(error);
            }
            else {
                console.log('mainelse성공');
                res.send(result);
            }
        });
    });

};
