var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var pg = require('pg');
var hbs = require('express-handlebars');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var websocket = require('ws');
/**
 * Helper global variable for simpler requires.
 */
global.__base = __dirname + "/app";

/**
 * Create server
 */
var server = require('http').createServer(); 
server.on('request', app);

/**
 * Create websocket server
 */
var wss = new websocket.Server({
	server:server,
	perMessageDeflate: false
});



require (__base + '/lib/websockets.js').init(wss);

/**
 * Database connection
 */
pg.defaults.ssl = process.env.DB_SSL != "false";
pg.connect(process.env.DATABASE_URL, function(err, psqlClient) {
   if (err) throw err;
   global.psql = psqlClient;
   require(__base+"/lib/auth")(passport);
   loadRoutes(__base + "/routes");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.set('port', (process.env.PORT || 5000));
app.use('/',express.static(path.join(__dirname + '/client/public')));

/**
 * View engine configuration
 */
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

	/**
	 * Session configuration
	 * Actual configuration in /lib/auth.js
	 */
	app.use(session({ secret: 'verysecret' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(function(req, res, next) {
    res.locals.loggedin = req.isAuthenticated();
    next();
});


/** some routes for testing */

app.get('/users',function(req,res){
	var User = require(__base + "/models/user");
	var users = User.list();
	users.on('end', function(result){
		res.json(result.rows);
	});
});
i = 0;
/** helper function to test ajax */
var generateFact = function(){
    var fact = {};
    i++;
    var r = Math.round(Math.random() * 1000) + 2;
    fact.id = i;
    fact.fact = "Random fact #  with not content " + r;
    fact.user = "Random user " + Math.round(r / 2);
    fact.timestamp = Date.now() - r * 60 * 60 * 887 * 24;
    fact.votes = Math.round(Math.abs(Math.sin(r) * r));
    fact.downvotes = Math.round(Math.abs(Math.sin(r) * r/2));
    return fact;
};

app.get('/fact/next', function(req,res){
    res.send(generateFact());
});

var generateComment = function(){
    var comment = {};
    var r = Math.round(Math.random() * 1000) + 2;
    comment.comment = "Random comment #  with not content " + r;
    comment.user = "Random user " + Math.round(r / 2);
    comment.timestamp = Date.now() - r * 60 * 60 * 887 * 24;
    return comment;
};

app.get('/comment/next', function(req,res){
    res.send(generateComment());
});


/**
 * Function to load all routes from routes folder
 */

function loadRoutes(folderName) {
    fs.readdirSync(folderName).forEach(function(file) {

        var fullName = path.join(folderName, file);
        var stat = fs.lstatSync(fullName);

        if (stat.isDirectory()) {
            loadRoutes(fullName);
        } else if (file.toLowerCase().indexOf('.js') !=-1) {
            require(fullName)(app, passport);
        }

    });
}

/**
 * Start listening to the port set in .env 
 */
server.listen(app.get('port'), function(){
	console.log('Listening to port ', app.get('port'))
});