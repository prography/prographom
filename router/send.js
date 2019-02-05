const express = require('express')
const router = express.Router()

const nodemailer = require('nodemailer')
const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'prography.verify',
        pass: 'Prography1!',
    }
})

let rand, mailOptions, host, link
const sha256 = require('js-sha256')

let hashMap = require('./main.js').hashMap

const hash = (email) => {
    return sha256('pRoG' + email + 'rApHy')
}

router.post('/', (req, res) => {
    email_to = req.body.email_to
    rand = hash(email_to)
    hashMap[rand] = email_to
    setTimeout(() => {
        delete hashMap[rand]
        console.log(hashMap)
        }, 3000000)
    host = req.get('host')
    link = 'http://' + host + '/application?id=' + rand

    mailOptions = {
        to : email_to,
        subject : '[프로그라피, 대학생 연합 프로그래밍 동아리] 지원서 작성안내',
        html : '<table width="720" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"> <tbody> <tr> <td style="background: #fff;"> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tbody> <tr> <td style="padding: 30px 40px 25px; font-size: 1px; line-height: 1px; border-bottom: 2px #e0e0e0 solid;"> <a href="http://prography.org/" target="_blank" title="새창" rel="noreferrer noopener"><img src="http://13.124.159.186/img/logo-mail.png" alt="prography" width="60" style="vertical-align: top; border: none;"></a> </td> </tr> </tbody> </table>  <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tbody> <tr> <td style="width: 40px;"></td> <td style="padding: 40px 0 50px;">  <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tbody> <tr> <td style="font: 28px/40px Malgun Gothic; letter-spacing: -1px; color: #E95192;"> 《프로그라피 지원서 작성안내》</td> </tr> <tr> <td style="padding: 30px 0 25px; font: 16px/26px Malgun Gothic; color: #767676;"> 안녕하세요. 프로그라피입니다.</td> </tr> <tr> <td style="padding-bottom: 10px; font: 16px/26px Malgun Gothic; color: #767676;">  프로그라피는 IT 서비스를 만들고자 하는 열정이 가득한 사람들이 함께 모여 꿈을 이루는 동아리입니다. 웹 프론트, 백엔드, 모바일, 딥러닝 등 다양한 분야의 사람들이 모여 다양한 프로젝트를 실시하고 있습니다. <br> <br> 지원자님의 지원서 작성 주소는 아래와 같습니다. </td> </tr> <tr> <td style="font: 14px/22px Malgun Gothic; color: #666;">  <table border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td style="display: block; height: 30px;"></td> </tr> </tbody> </table> <table border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td style="display: block; height: 10px;"></td> </tr> </tbody> </table>  <table cellpadding="0" cellspacing="0" style="width: 100%;"> <tbody> <tr> <td style="background: #a5a5a5; font-size: 1px; line-height: 1px; height: 2px;"></td> </tr> </tbody> </table> <table cellpadding="0" cellspacing="0" style="width: 100%; *width: auto; table-layout: fixed; border-bottom: 1px #a5a5a5 solid; word-break: break-all;"> <colgroup> <col width="110"> <col> </colgroup> <tbody> <tr> <th colspan="1" rowspan="1" style="padding: 8px 0; font: bold 14px/20px Malgun Gothic; letter-spacing: -1px; color: #4b5964; text-align: center; border-top: 1px #e0e0e0 solid; background: #f3f3f3;"> 지원자 E-Mail</th> <td style="padding: 8px 10px; font: 14px/20px Malgun Gothic; color: #4b5964; color: #4b5964; border-top: 1px #e0e0e0 solid; border-left: 1px #e0e0e0 solid;"> <span>'+email_to+'</span> </td> </tr> <tr> <th colspan="1" rowspan="1" style="padding: 8px 0; font: bold 14px/20px Malgun Gothic; letter-spacing: -1px; color: #4b5964; text-align: center; border-top: 1px #e0e0e0 solid; background: #f3f3f3;"> 지원서 작성 링크</th> <td style="padding: 8px 10px; font: 14px/20px Malgun Gothic; color: #4b5964; color: #4b5964; border-top: 1px #e0e0e0 solid; border-left: 1px #e0e0e0 solid;"> <a href="'+link+'">'+link+'</a> </td> </tr> </tbody> </table>  </td> </tr> </tbody> </table> </td> <td style="width: 40px;"></td> </tr> </tbody> </table>  <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tbody> <tr> <td style="padding: 40px; border-top: 2px #e0e0e0 solid; font: 14px/23px Malgun Gothic; color: #767676;"> ※ 이 메일은 발신 전용입니다.</td> </tr> <tr> <td style="padding: 24px; border-top: 1px #e0e0e0 solid; border-bottom: 1px #e0e0e0 solid; font: 12px/12px Malgun Gothic; color: #ccc; text-align: center;"> <a href="http://prography.org/about" style="color: #767676; text-decoration: none;" target="_blank" title="새창" rel="noreferrer noopener">프로그라피 소개</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="http://prography.org/activity" style="color: #767676; text-decoration: none;" target="_blank" title="새창" rel="noreferrer noopener">공식활동</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="http://prography.org/product" style="color: #767676; text-decoration: none;" target="_blank" title="새창" rel="noreferrer noopener">포트폴리오</a> </td> </tr> <tr> <td style="padding: 30px 10px; font: 12px/20px Malgun Gothic; color: #767676; text-align: center;"> 프로그라피(Prography), 대학생 연합 프로그래밍 동아리 <br> <br> Copyright ⓒ Prography 2018 All Rights Reserved.  </td> </tr> </tbody> </table>  </td> </tr> </tbody> </table>'
    }
    smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error)
            res.send("error")
        } else {
            res.send("success")
        }
    });
});

module.exports = router
