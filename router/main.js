var nodemailer=require("nodemailer");
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "prography.verify",
        pass: "verify.test"
    }
});
var rand,mailOptions,host,link;
var sha256 = require('js-sha256');

var mysql = require('mysql');
var client = mysql.createConnection({
	user: 'root',
	password: 'ilove1421'
});

module.exports = function(app)
{
    app.get('/', function(req,res) {
    	res.render('index.html')
	});
    app.get('/about', function(req,res) {
    	res.render('about.html')
	});
    app.get('/history', function(req, res) {
      res.render('history.html')
    });

    app.get('/login', function(req, res) {
      res.render('login.html')
  });

    app.get('/product', function(req, res) {
      res.render('product.html')
  });

    app.get('/admin', function(req, res) {
      res.render('admin.html')
  });

    app.get('/admin', function(req, res) {
      res.render('admin.html')
  });





    app.get('/recruit', function(req, res) {
        require('date-utils');
        var newDate = new Date();
        var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

        console.log(time); // remove
        // before apply
        if (time < '2018-08-01 00:00:00')
           res.render('recruit-ing.html');
        // after apply
        else if (time < '2018-08-07 00:00:00')
           res.render('recruit-fin.html');
        // 1차 발표
        else if (time < '2018-08-09 00:00:00')
           res.render('recruit-result1.html');
        // 2차 발표
        else if (time < '2018-08-10 00:00:00')
           res.render('recruit-result2.html');

      }); 

    app.get('/application', function(req, res) {
      res.render('application.html')
    });

    app.get('/send',function(req,res){
        rand=sha256(req.query.to);
        host=req.get('host');
        link="http://"+req.get('host')+"/verify?id="+rand;
        mailOptions={
            to : req.query.to,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please click the link below to verify your email.<br><a href="+link+">Verify and write application form.</a>"
        }
        // console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response){
         if(error){
                console.log(error);
            res.end("error");
         }else{
                console.log("Message sent: " + response.message);
            res.end("sent");
             }
        });

    });
    app.get('/verify',function(req,res){
      console.log(req.protocol+":/"+req.get('host'));
      if((req.protocol+"://"+req.get('host'))==("http://"+host))
      {
          console.log("Domain is matched. Information is from Authentic email");
          if(req.query.id==rand)
          {
              console.log("email is verified");
              data={
                id:req.query.id,
                user:req.query.to,

              };
              //register data to database


              //redirect to application page
              res.redirect('/apply?id='+req.query.id);
          }
          else
          {
              console.log("email not verified");
              res.end("<h1>Bad Request</h1>");
          }
      }
      else
      {
          res.end("<h1>Request from unknown source");
      }
    });

    app.get('/etc', function(req, res) {
      res.render('etc.html')
    });
    app.get('/activity', function(req, res) {
      res.render('activity.html')
    });
    app.get('/layout', function(req, res) {
      res.render('layout.html')
    });

    app.get('/apply', function(req ,res){
	  require('date-utils');
        var id=req.query.id;
        var user="example@prography.com";
        var answers=['blah1','blah2','blah3','blah4'];
	    var newDate = new Date();
		var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
      //find the user info by the id from database



      //
      data={
        user,
        id,
        answers
      }
    //
		 console.log(time); // remove
		 // apply 진행 중
		 if (time < '2018-07-11 19:54:00')
		 	res.render('apply.ejs', data);
		 // after apply
		 else if (time < '2018-07-11 19:54:30')
		 	res.render('recruit-fin.html');
		 // 1차 발표
		 else if (time < '2018-07-11 19:54:00')
		 	res.render('recruit-result1.html');
		// 2차 발표
		else
			res.render('recruit-result2.html');
     });

	app.get('/send_kakao', function(req, res){
		var phoneArray = new Array();
		client.query('USE prography');
		client.query('SELECT phone FROM applicants', function(error, result, fields) {
			if (error){
				console.log('쿼리 문장에 오류가 있습니다.');
			} else {
				phoneArray = result;
				console.log(phoneArray);
			}
		});
	});
}
