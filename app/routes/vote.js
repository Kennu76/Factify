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

        if(!req.isAuthenticated()){
            var response = {status : 'error', message : 'Pead sisse logima'}; 
            res.json(response);
            return;
        }

        var vote = Vote.create();
        vote.type = req.body.type;
        vote.fact_id = req.body.fact;
        vote.user_id = req.user.id;

        var q = psql.query('SELECT * FROM votes where user_id = $1 and fact_id = $2', [vote.user_id, vote.fact_id])
        q.on('error',function(){
           return; 
        });

        q.on('end', function(result){

            if(result.rows.length == 0){
                var save = vote.save();
                save.on('error', function(error){
                    console.log(error);
                    res.json({status : 'error', message : 'Midagi läks valesti'})
                });
                save.on('end',function(result){
                    res.json({status : 'success', vote : vote.type});
                });
            }
            else{
                vote.id = result.rows[0].id;

                if(vote.type == result.rows[0].type){
                    res.json({status: 'error', message : 'Oled juba nii hääletanud!'});
                    return;
                }

                var save = vote.update() 
                save.on('error', function(error){
                    console.log(error);
                    res.json({status : 'error', message : 'Midagi läks valesti all'})
                });
                save.on('end',function(result){
                    res.json({status : 'success', vote : vote.type});
                });
            }
        });

        return;
      
     

        save.on('end',function(result){
            Vote.get
            res.send({status});
        });
  });

};