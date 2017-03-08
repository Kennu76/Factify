var express = require('express');
var app = express();
var path = require('path');

var pg = require('pg');

global.__base = __dirname + "/app";
var hbs = require('express-handlebars');

pg.defaults.ssl = process.env.DB_SSL != "false";
pg.connect(process.env.DATABASE_URL, function(err, psqlClient) {
   if (err) throw err;
   global.psql = psqlClient;
});

console.log(global.psql);


app.set('port', (process.env.PORT || 5000));
app.use('/',express.static(path.join(__dirname + '/client/public')));

app.engine('hbs', hbs({extname : 'hbs', defaultLayout: 'main',layoutsDir: __dirname + "/client/views/layouts/"}));
app.set('views', path.join(__dirname, '/client/views/'));
app.set('view engine', 'hbs');

app.listen(app.get('port'), function() {
  console.log('oooooooooook', app.get('port'));
});

app.get('/front', function(req,res){
	res.render('index', {title: 'Cool, huh!', condition: false, anyArray:[]});
});

app.get('/usertest', function(req,res){
	var User = require(__base + "/models/user");
	var u = User.create();

	u.email = "test@test.ee";
	u.firstname = "test";
	u.lastname = "blindtest";
	u.password = "12312123";
	u.username = "0";

	var save = u.save();
	save.on('error', function(error){
		res.send('err');
	});

	save.on('end',function(result){
		res.send(result);
	});

	u.update();
});

app.get('/user',function(req,res){
	var User = require(__base + "/models/user");
	var users = User.list();
	users.on('end', function(result){
		res.send(result);
	});
});




