var Fact = require(__base + "/models/fact");

module.exports = function(app){

     app.get('/facts/next', function(req,res){
        var  factRepo = require(__base + '/repositories/factRepository');
        factRepo.getRandom(function(fact){
            res.json(fact);
        })
    });

    app.get("/facts", function(req,res){
        var q = Fact.list();
        q.on("error", function(){
            console.log("error");
        });
        q.on("end", function(result){
            res.json(result.rows);
        });
    }); 

    app.post("/facts", function(req,res){
        res.send("new fact");
    });

    app.get("/facts/:fact_id", function(req,res){
        var q = Fact.get(Number(req.params.fact_id));

        q.on("error", function(err){
            res.status(204);
            res.send();
        });

        q.on("end",function(result){
            res.json(result.rows[0]); 
        });
    });

    app.put("/facts/:fact_id", function(req,res){
        res.send("putter")
    });
    
    app.delete("/facts/:fact_id", function(req,res){
        res.send("deleter");
    });
}