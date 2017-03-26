var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var pg = require('pg');
var hbs = require('express-handlebars');

global.__base = __dirname + "/app";

//connect to db
pg.defaults.ssl = process.env.DB_SSL != "false";
pg.connect(process.env.DATABASE_URL, function(err, psqlClient) {
   if (err) throw err;
   global.psql = psqlClient;
   loadRoutes(__base + "/routes");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', (process.env.PORT || 5000));
app.use('/',express.static(path.join(__dirname + '/client/public')));

app.engine('hbs', hbs(
	{
		extname : 'hbs', 
		defaultLayout: 'main',
		layoutsDir: __dirname + "/client/views/layouts/",
		helpers : {
			counter: function (index){
			  return index + 1;
			},
			date : function(date){
				var monthNames = [
					"Jaanuar", "Veebruar", "Märts",
					"Aprill", "Mai", "Juuni", "Juuli",
					"August", "September", "Oktoober",
					"November", "Detsember"
				];
				date = new Date();
				var day = date.getDate();
				var monthIndex = date.getMonth();
				var year = date.getFullYear();

				return day + ' ' + monthNames[monthIndex] + ' ' + year;
			},
			selected : function(selected, value){
				if(selected == value)
					return ' selected = "selected" ' 
				else
					return "";
			}
		}
	}));
app.set('views', path.join(__dirname, '/client/views/'));
app.set('view engine', 'hbs');

/** END OF SETUPs */

/** PROVISIONAL DEFAULT USER AND ROUTE TO CHANGE IT UNTIL AUTH IMPLEMENTED */
global.def_user = 22;
app.get('/cdf/:id',function(req,res){
	def_user = Number(req.params.id);
	res.send('ok ' + def_user);
});



/**	PROVIOSIONAL HELPER ROUTE TO SEED DB */
app.get('/generate-data', function(req,res){
	module.require(__base + "/seeder.js")();
});


/** some routes for testing */
app.get('/front', function(req,res){
	res.render('index', {title: 'test', condition: false, anyArray:[]});
});

app.get('/users',function(req,res){
	var User = require(__base + "/models/user");
	var users = User.list();
	users.on('end', function(result){
		res.json(result.rows);
	});
});

/** helper function to test ajax with new facts*/
var generateFact = function(){
	var fact = {};	
	var r = Math.round(Math.random() * 1000) + 2;
	fact.fact = "Random fact #  with not content " + r; 
	fact.user = "Random user " + Math.round(r / 2);
	fact.timestamp = Date.now() - r * 60 * 60 * 887 * 24;
	fact.upvotes = Math.round(Math.abs(Math.sin(r) * r));
	fact.downvotes = Math.round(Math.abs(Math.sin(r/2) * r));
	return fact;
};


app.get('/fact/next', function(req,res){
	res.send(generateFact());
});

/** helper function to test ajax with comments*/
var generateComment = function(){
    var comment = {};
    var r = Math.round(Math.random() * 1000) + 2;
    comment.fact = "Random comment #  with not content " + r;
    comment.user = "Random user " + Math.round(r / 2);
    comment.timestamp = Date.now() - r * 60 * 60 * 887 * 24;
    return comment;
};


app.get('/comment/next', function(req,res){
    res.send(generateComment());
});

//function to load all routes from routes folder
function loadRoutes(folderName) {
    fs.readdirSync(folderName).forEach(function(file) {

        var fullName = path.join(folderName, file);
        var stat = fs.lstatSync(fullName);

        if (stat.isDirectory()) {
            loadRoutes(fullName);
        } else if (file.toLowerCase().indexOf('.js') !=-1) {
            require(fullName)(app);
        }

    });
}

//start listening to the port set in .env
app.listen(app.get('port'), function() {
  console.log('oooooooooook', app.get('port'));
});