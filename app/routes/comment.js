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
};