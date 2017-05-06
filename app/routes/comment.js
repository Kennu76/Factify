var Comment = require(__base + "/models/comment");
var commentrepo = require(__base + "/repositories/commentRepository");
 
module.exports = function(app){

    app.get("/comments", function(req,res){
        var q = Comment.list();

        q.on("error", function(err){
            console.log(err);
        });

        q.on("end", function(result){
            res.json(result.rows);
        });
    }); 

    /*
        comments for single fact
    */
    app.get("/comments/fact/:id", function(req,res){
        commentrepo.get(req.params.id, function(result){
            if('error' === result){
                res.json({status : 'error'});
                return;
            }
            res.json({status : 'success', data : result});
        });
    });

    app.post("/comments", function(req,res){

        if(!req.isAuthenticated()){
            var response = {status : 'error', message : 'Pead sisse logima'}; 
            res.json(response);
            return;
        }

        var comment = Comment.create();
        comment.fact_id = req.body.fact;
        comment.user_id = req.user.id;
        comment.comment = req.body.comment;

        var save = comment.save();
        save.on('error', function(error){
            res.json({status : 'error', message : 'Midagi läks valesti'})
        });
        save.on('end',function(result){
            res.json({status : 'success'});
        });
  });

  app.delete("/comments/:comment_id", function(req,res){
         if(!req.isAuthenticated()){
            var response = {status : 'error', message : 'Pead sisse logima'}; 
            res.json(response);
            return;
        }

        var user = req.user;
        var comment_id = req.params.comment_id;

        //check if belongs to that user
        var q = Comment.get(comment_id);
        q.on('error',function(err){
            console.log(err);
            res.json(err)
            return;
        })
        q.on('end', function(result){
            if(result.rows.length == 0)
                return;
            if(result.rows[0].user_id == user.id){
                var s = Comment.delete(comment_id);            
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

};