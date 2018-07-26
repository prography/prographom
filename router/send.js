var express = require('express');
var router = express.Router();

router.post('/',function(req,res){
    email_to = req.body.email_to;
    rand = hash(email_to);
    hashMap[rand] = email_to;
    console.log(hashMap);
    setTimeout(function () {
        delete hashMap[rand];
        console.log(hashMap);
        }, 300000);
    host = req.get('host');
    link = "http://" + host + "/verify?id=" + rand;
    // link = "http://" + host + "/verify?id=" + email_to;

    mailOptions={
        to : email_to,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please click the link below to verify your email.<br><a href="+link+">Verify and write application form.</a>"
    }
    // console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if (error) {
            // console.log(error);
            // res.send("error");
        } else {
            console.log("Message sent: " + response.message);
            res.send("success");
        }
    });
});

module.exports = router;
