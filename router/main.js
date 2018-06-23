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
    app.get('/recruit', function(req, res) {
      res.render('recruit.html')
    });
    app.get('/project', function(req, res) {
      res.render('project.html')
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

    //apply post를 만들 계획
}
