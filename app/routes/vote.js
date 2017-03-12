var Vote = require(__base + "/models/vote");

module.exports = function(app){

    app.get("/votes", function(req,res){
        var q = Vote.list();

        q.on("error", function(err){
            console.log(err);
        });

        q.on("end", function(result){
            res.json(result.rows);
        });
    }); 

    app.post("/votes", function(req,res){

        var vote = Vote.create();
        
        vote.type = req.body.type;
        vote.user_id = def_user;
        vote.fact_id = req.body.fact;

        var save = vote.save();

        save.on('error', function(error){
            console.log(error);
            res.json(error);
        });

        save.on('end',function(result){
            res.send(result);
        });
  });

};