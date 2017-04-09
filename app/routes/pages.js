var isAuthed = require(__base + '/lib/isAuthed');
var wsm = require(__base + '/lib/websockets').wsm;

/**
 * Routes to pages that are rendered by res.render and meant to be shown in browser
 * and their POST method handlers.
 */

module.exports = function(app){

    app.get('/',function(req,res){
        res.render("index", {title: "Faktid"})
    });

    app.get('/create-fact',isAuthed, function(req,res){
        res.render("create-fact",{title: "Postita uus fakt"});
    });


    app.get('/testpushmessage',function(req,res){
        wsm.broadcast("Push message works");
        res.send('message was sent');
    });

    app.post('/create-fact', isAuthed, function(req,res){
        var Fact = require(__base + "/models/fact");
        var fact = Fact.create();
        
        fact.fact = req.body.fact;
        fact.title = req.body.title;
        fact.user_id = req.user.id;

        var save = fact.save();


        save.on('error', function(error){
            res.json(error);
        });

        save.on('end',function(result){
            var username = req.user.username;
            wsm.broadcast(req.user.username + " postitas uue fakti!")
            res.redirect('/myfacts');
        });

    });

    app.get('/newest',function(req,res){
        res.render("newest", {title: "Uusimad faktid"});
    });

    app.get('/best',function(req,res){
        var time = req.query.time || "";

        var days = 3000;
        var times = {}; 
        times['last24h'] = 1;
        times['lastweek'] = 7;
        times['lastmonth'] = 30;

        if(times.hasOwnProperty(time))
            days = times[time];
        
        var bestFactsRepo = require(__base + "/repositories/bestFactsRepository"); 
        var bestUsersRepo = require(__base + "/repositories/bestUsersRepository"); 
        console.log(time);
        bestFactsRepo.get({limit: 5, days: days}, function(bestFacts){
        bestUsersRepo.get({limit: 5, days: days}, function(bestUsers){
            res.render("best",{title : "Parimad faktid",selec: time, bestFacts : bestFacts, bestUsers: bestUsers});
        }); 
        });
    });

     app.get('/login', function(req,res){
         res.render('login',{title: 'Logi sisse', messages : req.flash('authing')})

    });

    app.get('/registered', function(req,res){
        res.render('registered'); 
    });
    
    app.get('/myfacts', isAuthed, function(req,res){
        var Fact = require(__base + '/models/fact');
        var prm = Fact.find('user_id', req.user.id)

        prm.on('end',function(result){
            res.render('myfacts', {facts : result.rows});
        });

        prm.on('error',function(err){
           console.log(err);
        });
      });
};