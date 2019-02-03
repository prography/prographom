var mysql = require('mysql');

var hashMap = {}

var client = mysql.createConnection({
    host: 'ec2-13-125-55-125.ap-northeast-2.compute.amazonaws.com',
    user : 'root',
    password : 'hansol64',
    database : 'prography',
    multipleStatements: true,
});

setInterval(function () {
    client.query('SELECT 1');
}, 5000);

var n_th = 4;
dates = {'due_month': 2, 'due_day': 16, 'OT_month': 3, 'OT_day': 2, 'MT_month': 3, 'MT_day': 9};

module.exports = {
  hashMap: hashMap,
  client: client,
  n_th: n_th,
  dates: dates
}

let send = require('./send.js');
let application = require('./application.js');
let recruit = require('./recruit.js');
let admin = require('./admin.js');
let feed = require('./feed.js');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('index', {
            title: '프로그라피',
			url: req.protocol + '://' + req.headers.host + req.url
        })
    });
    app.get('/about', (req, res) => {
        res.render('about', {
            title: '프로그라피::소개',
			url: req.protocol + '://' + req.headers.host + req.url
        })
    });
    app.get('/product', (req, res) => {
        res.render('product', {
            title: '프로그라피::포트폴리오',
			url: req.protocol + '://' + req.headers.host + req.url
        })
    });
    app.get('/schedule', (req, res) => {
        res.render('schedule', {
            title: '프로그라피::일정',
			url: req.protocol + '://' + req.headers.host + req.url
        })
    })

    app.use('/send', send);
    app.use('/application', application);
    app.use('/recruit', recruit);
    app.use('/admin', admin);
    app.use('/feed', feed);

    app.get('/sheet', (req, res) => {
        res.redirect('https://docs.google.com/spreadsheets/d/1L_5VyesPX86yxxr0-zwT3BigWOLEklBc2hTTN31pTiU/edit#gid=59274967');
    });

    app.get('/music', (req, res) => {
        res.render('music', {
            title: '신청곡 받아요',
            url: req.protocol + '://' + req.headers.host + req.url
        })
    })
    
    app.post('/music', async (req, res) => {
        const musicTitle = req.body.music_title
        const musicArtist = req.body.music_artist
        await client.query('INSERT INTO music(music_title, music_artist) VALUES(?, ?)', [musicTitle, musicArtist])
        res.redirect('/music')
    })
} 

