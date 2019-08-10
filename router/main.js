const mysql = require('mysql')

let hashMap = {}

require('dotenv').config()

const client = mysql.createConnection({
    host: 'ec2-13-125-55-125.ap-northeast-2.compute.amazonaws.com',
    user : 'root',
    password : process.env.DB_PASSWORD,
    database : 'prography',
    multipleStatements: true,
})

setInterval(() => {
    client.query('SELECT 1')
}, 5000)

const n_th = 5
dates = {'due_month': 8, 'due_day': 27, 'OT_month': 9, 'OT_day': 21, 'MT_month': 9, 'MT_day': 28}

module.exports = {
  hashMap: hashMap,
  client: client,
  n_th: n_th,
  dates: dates
}

const recruit = require('./recruit.js')
const application = require('./application.js')
const send = require('./send.js')
const quiz = require('./quiz.js')
const admin = require('./admin.js')
const feed = require('./feed.js')

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('index', {
            title: '프로그라피',
			url: req.protocol + '://' + req.headers.host + req.url
        })
    })
    app.get('/about', (req, res) => {
        res.render('about', {
            title: '프로그라피::소개',
			url: req.protocol + '://' + req.headers.host + req.url
        })
    })
    app.get('/product', (req, res) => {
        res.render('product', {
            title: '프로그라피::포트폴리오',
			url: req.protocol + '://' + req.headers.host + req.url
        })
    })
    app.get('/schedule', (req, res) => {
        res.render('schedule', {
            title: '프로그라피::일정',
			url: req.protocol + '://' + req.headers.host + req.url
        })
    })

    app.use('/recruit', recruit)
    app.use('/application', application)
    app.use('/send', send)
    app.use('/quiz', quiz)
    app.use('/admin', admin)
    app.use('/feed', feed)

    app.get('/sheet', (req, res) => {
        res.redirect('https://docs.google.com/spreadsheets/d/1L_5VyesPX86yxxr0-zwT3BigWOLEklBc2hTTN31pTiU/edit#gid=59274967')
    })

    app.get('/privacy-policy', (req, res) => {
        res.render('privacy-policy.html', {
            title: '개인정보처리방침',
            url: req.protocol + '://' + req.headers.host + req.url
        })
    })

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

    app.get('/demo-day', (req, res) => {
        res.render('demo-day', {
            title: '프로그라피 데모데이 참가신청',
            url: req.protocol + '://' + req.headers.host + req.url,
            post: false
        })
    })
    
    app.post('/demo-day', async (req, res) => {
        const name = req.body.name
        const phone = req.body.phone
        const org = req.body.org
        await client.query('INSERT INTO demo_day_application(demo_day_application_name, demo_day_application_phone, demo_day_application_org) VALUES(?, ?, ?)', [name, phone, org])
        res.render('demo-day', {
            title: '프로그라피 데모데이 참가신청',
            url: req.protocol + '://' + req.headers.host + req.url,
            post: true
        })
    })

    app.get('/demo-day-servey', (req, res) => {
        res.render('demo-day-servey', {
            title: '프로그라피 데모데이 설문',
            url: req.protocol + '://' + req.headers.host + req.url,
            qr_img_url: req.query.team + '.png',
            post: false
        })
    })
} 

