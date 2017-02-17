var express = require('express');
var app = express();
var path = require('path');
var pg = require('pg');

pg.defaults.ssl = process.env.DB_SSL != "false";

pg.connect(process.env.DATABASE_URL, function(err, psqlClient) {
  if (err) throw err;
  app.set('psqlClient', psqlClient) 
});




app.set('port', (process.env.PORT || 5000));

app.use('/',express.static(path.join(__dirname + '/client/public')));

app.listen(app.get('port'), function() {
  console.log('oooooooooook', app.get('port'));
});



app.get('/facts', function(req,res){
	var psqlClient = app.get('psqlClient');
	var query = psqlClient.query("SELECT * FROM facts");

	query.on('row',function(row){
		res.send(row);
	});
});

app.post('/upvote',function(req,res){
	var psqlClient = app.get('psqlClient');
	psqlClient.query("UPDATE facts SET like_count = like_count + 1");
	res.send("{res:ok}");
});





