var Schema = require(__base + "/lib/schema");
var model = require(__base + "/lib/model");


var factSchema = new Schema(
    "facts", 
    {
        id         : {type : "id", auto: true},
        title      : {type : "text"},
        fact       : {type : "text"},
        created_at : {type : "timestamp", auto: true},
        updated_at : {type : "timestamp", auto: true},
        user_id    : {type : "integer"}
    }
);

var Fact = model(factSchema);

module.exports = Fact;