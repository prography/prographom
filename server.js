var express = require('express'); 
var compression = require('compression');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(bodyParser.json());

const session = cookieSession({
    name: 'session',
    keys: ['hello', 'world'],
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours,
    autoSave: true
})
app.use(session)

var router = require('./router/main')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function() {
    console.log("Express server")
});

app.use(express.static('public'));
app.use(compression());
