///routes file for website pages

module.exports = function(app){

    app.get('/',function(req,res){
        res.render("index", {title: "Faktid"})
    });

    app.get('/create-fact',function(req,res){
        res.render("create-fact",{title: "Postita uus fakt"});
    });


    app.post('/create-fact', function(req,res){
        var Fact = require(__base + "/models/fact");
        var fact = Fact.create();
        
        fact.fact = req.body.fact;
        fact.title = req.body.title;
        fact.user_id = 12;

        var save = fact.save();

        save.on('error', function(error){
            res.json(error);
        });

        save.on('end',function(result){
            res.send(result);
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
        res.render('login',{title: 'Logi sisse'})
    });
};