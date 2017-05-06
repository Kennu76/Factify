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
        q.on("error", function(err){
            console.log(err);
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
        var  factRepo = require(__base + '/repositories/factRepository');
        factRepo.get(req.params.fact_id, function(fact){
            console.log(fact);
            if(fact && fact != 'error')
                res.json(fact);
            else{
                res.json({status : 'error'});
            }
        }) 
    });

    app.put("/facts/:fact_id", function(req,res){
        res.send("putter")
    });
    
    app.delete("/facts/:fact_id", function(req,res){
        console.log('test');
         if(!req.isAuthenticated()){
            var response = {status : 'error', message : 'Pead sisse logima'}; 
            res.json(response);
            return;
        }

        var user = req.user;
        var factid = req.params.fact_id;

        //check if belongs to that user
        var q = Fact.get(factid);
        q.on('error',function(err){
            console.log(err);
            res.json(err)
            return;
        })
        q.on('end', function(result){
            if(result.rows.length == 0)
                return;
            if(result.rows[0].user_id == user.id){
                var s = Fact.delete(factid);            
                s.on('end', function(result){ 
                    res.json({status : 'success'});
                });
                s.on('error', function(err){ 
                    console.log(err);
                    return;
                });
            }
            else
                res.json({status : 'error', message : 'Pead fakti looja olema'});
        });
    });
}