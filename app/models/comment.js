var Schema = require(__base + "/lib/schema");
var model = require(__base + "/lib/model");


var commentSchema = new Schema(
    "comments", 
    {
        id         : {type : "id", auto: true},
        comment       : {type : "text"},
        user_id      : {type : "number"},
        fact_id    : {type : "number"},
        created_at : {type : "timestamp", auto: true},
        updated_at : {type : "timestamp", auto: true},
    }
);

var Comment = model(commentSchema);

module.exports = Comment;