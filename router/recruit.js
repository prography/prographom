var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    require('date-utils');
    var newDate = new Date();
    var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

    console.log(time); // remove;
    // before apply
    if (time < '2018-08-01 00:00:00')
       res.render('recruit-ing');
    // after apply
    else if (time < '2018-08-07 00:00:00')
       res.render('recruit-fin');
    // 1차 발표
    else if (time < '2018-08-09 00:00:00')
       res.render('recruit-result1');
    // 2차 발표
    else if (time < '2018-08-10 00:00:00')
       res.render('recruit-result2');

});

module.exports = router;
