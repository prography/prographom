const express = require('express')
const router = express.Router()

router.get('/1', function(req, res) {
    res.render('quiz/quiz-1', {
        title: '프로그라피',
        url: req.protocol + '://' + req.headers.host + req.url
    })
})

module.exports = router
