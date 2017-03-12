var Schema = require(__base + "/lib/schema");
var model = require(__base + "/lib/model");


var voteSchema = new Schema(
    "votes", 
    {
        id         : {type : "id", auto: true},
        user_id    : {type : "number"},
        fact_id    : {type : "number"},
        type       : {type : "id"},
        created_at : {type : "timestamp", auto: true}
    }
);

var Vote = model(voteSchema);

module.exports = Vote;